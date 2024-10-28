const Validator = require("@gefion/validator");
const Error = require("@gefion/error");
const Server = require("@gefion/server").provider();
const ValidationMiddleware = require("./utils/validation-middleware");
const CatchError = require("./utils/catch-error");
const Config = require("@gefion/config");

/**
 * Represents a router for defining routes and handling HTTP requests.
 * @class
 */
module.exports = class Router {
  /** @private */
  static #routes = [];
  /** @private */
  static #middlewares = {};
  /** @private */
  static #middleware;
  /** @private */
  static #middlewareGroups = {};
  /** @private */
  static #prefix = "";
  /** @private */
  static #name = "";
  /** @private */
  static #nameable = false;
  /** @private */
  static #validations = {};
  /** @private */
  static #validation = "";
  /** @private */
  static #validable = false;
  /** @private */
  static #currentValidation = "";
  /** @private */
  static #controllers = {};
  /** @private */
  static #controller = "";

  /**
   * Defines a route with the specified HTTP method, path, middleware, and callback.
   * @param {string} method - The HTTP method for the route (e.g., "get", "post").
   * @param {string} path - The path for the route.
   * @param {string|Array} middleware - The middleware(s) to be applied to the route.
   * @param {Function|null} callback - The callback function to handle the route.
   * @returns {Router} - The Router instance.
   */
  static route(method, path, middleware, callback = null) {
    path = this.#addSlash(path);
    const validate = Validator.validate(
      method,
      "required|in:all,get,post,delete,put,patch"
    );
    if (validate.failed()) Error.ServerError(validate.firstFail());

    const fullPath = this.#prefix + path;

    let validMiddleware = middleware;

    if (callback) {
      validMiddleware = this.#proccessMiddleware(middleware);
    }
    if (this.#middleware) {
      if (callback) {
        validMiddleware = [
          ...validMiddleware,
          ...this.#proccessMiddleware(this.#middleware),
        ];
      } else {
        callback = validMiddleware;
        validMiddleware = [...this.#proccessMiddleware(this.#middleware)];
      }
    }

    if (this.#currentValidation) {
      let validation = Object.keys(this.#validations).includes(
        this.#currentValidation
      )
        ? this.#validations[this.#currentValidation]
        : this.#currentValidation;
      if (callback) {
        validMiddleware.unshift(ValidationMiddleware(validation));
      } else {
        callback = validMiddleware;
        validMiddleware = [ValidationMiddleware(validation)];
      }
    }

    if (Validator.string(callback)) {
      callback = this.#controllers[this.#controller + callback];
    }

    if (Validator.string(validMiddleware)) {
      validMiddleware = this.#controllers[this.#controller + validMiddleware];
    }

    this.#routes.push({
      method,
      path: fullPath,
      middleware: validMiddleware,
      callback,
    });
    this.#addValidationField();
    if (callback) {
      Server.app[method](fullPath, validMiddleware, CatchError(callback));
    } else {
      Server.app[method](fullPath, CatchError(validMiddleware));
    }
    this.#nameable = true;
    this.#validable = true;
    this.#currentValidation = "";
    return this;
  }

  /**
   * Generates a URL with the specified route name and data.
   * @param {string} name - The name of the route.
   * @param {Object} data - The data to populate the URL parameters.
   * @returns {string} - The generated URL.
   */
  static generate(name, data) {
    const route = this.#routes.find((r) => r.name === name);
    const validate = Validator.validate(route, "required");
    if (validate.failed()) Error.ServerError(validate.firstFail());

    var path = route.path.replace(/(\/:\w+\??)/g, function (m, c) {
      c = c.replace(/[/:?]/g, "");
      return data[c] ? "/" + data[c] : "";
    });
    const url = Config.get("server.url");
    if (url && url.endsWith("/")) path = path.slice(1);
    return (url ? url : "") + path;
  }

  /**
   * Defines a route that matches all HTTP methods.
   * @param {string} path - The path for the route.
   * @param {string|Array} middleware - The middleware(s) to be applied to the route.
   * @param {Function|null} callback - The callback function to handle the route.
   * @returns {Router} - The Router instance.
   */
  static all(path, middleware, callback = null) {
    return this.route("all", path, middleware, callback);
  }

  /**
   * Defines a route with the "GET" HTTP method.
   * @param {string} path - The path for the route.
   * @param {string|Array} middleware - The middleware(s) to be applied to the route.
   * @param {Function|null} callback - The callback function to handle the route.
   * @returns {Router} - The Router instance.
   */
  static get(path, middleware, callback = null) {
    return this.route("get", path, middleware, callback);
  }

  /**
   * Defines a route with the "POST" HTTP method.
   * @param {string} path - The path for the route.
   * @param {string|Array} middleware - The middleware(s) to be applied to the route.
   * @param {Function|null} callback - The callback function to handle the route.
   * @returns {Router} - The Router instance.
   */
  static post(path, middleware, callback = null) {
    return this.route("post", path, middleware, callback);
  }

  /**
   * Defines a route with the "DELETE" HTTP method.
   * @param {string} path - The path for the route.
   * @param {string|Array} middleware - The middleware(s) to be applied to the route.
   * @param {Function|null} callback - The callback function to handle the route.
   * @returns {Router} - The Router instance.
   */
  static delete(path, middleware, callback = null) {
    return this.route("delete", path, middleware, callback);
  }

  /**
   * Defines a route with the "PUT" HTTP method.
   * @param {string} path - The path for the route.
   * @param {string|Array} middleware - The middleware(s) to be applied to the route.
   * @param {Function|null} callback - The callback function to handle the route.
   * @returns {Router} - The Router instance.
   */
  static put(path, middleware, callback = null) {
    return this.route("put", path, middleware, callback);
  }

  /**
   * Defines a route with the "PATCH" HTTP method.
   * @param {string} path - The path for the route.
   * @param {string|Array} middleware - The middleware(s) to be applied to the route.
   * @param {Function|null} callback - The callback function to handle the route.
   * @returns {Router} - The Router instance.
   */
  static patch(path, middleware, callback = null) {
    return this.route("patch", path, middleware, callback);
  }

  /**
   * Serves static files from the specified directory.
   * @param {string} link - The URL path prefix for accessing the static files.
   * @param {string} path - The local file system path to the directory containing the static files.
   * @returns {Router} - The Router instance.
   */
  static static(link, path, config) {
    return Server.static(link, this.#addSlash(path), config);
  }

  /**
   * Sets the middleware for the routes.
   * @param {string} middleware - The middleware to be applied to the routes.
   * @returns {Router} - The Router instance.
   */
  static middleware(middleware) {
    this.#middleware = middleware;
    return this;
  }

  /**
   * Sets the prefix for the routes.
   * @param {string} prefix - The prefix for the routes.
   * @returns {Router} - The Router instance.
   */
  static prefix(prefix) {
    this.#prefix = this.#prefix + this.#addSlash(prefix);
    return this;
  }

  /**
   * Defines a route group with the specified callback function.
   * @param {Function} callback - The callback function to define the route group.
   * @returns {void}
   */
  static async group(callback) {
    await callback(this);
    this.#prefix = "";
    this.#name = "";
    this.#validation = "";
    this.#currentValidation = "";
    this.#controller = "";
    this.#middleware = undefined;
    this.#validable = false;
  }

  /**
   * Sets the validation for the routes.
   * @param {string} validation - The validation key for the routes.
   * @returns {Router} - The Router instance.
   */
  static validation(validation) {
    if (this.#validable) {
      this.#currentValidation = Validator.string(validation)
        ? this.#validation + validation
        : validation;
      this.#validable = false;
    } else {
      this.#validation = validation;
      this.#validable = true;
    }
    return this;
  }

  /**
   * Sets the controller for the routes.
   * @param {string} controller - The controller key for the routes.
   * @returns {Router} - The Router instance.
   */
  static controller(controller) {
    this.#controller = controller;
    return this;
  }

  /**
   * Sets the name for the route.
   * @param {string} name - The name for the route.
   * @returns {Router} - The Router instance.
   */
  static name(name) {
    if (this.#nameable) {
      Object.assign(this.#routes[this.#routes.length - 1], {
        name: this.#name + name,
      });
      this.#nameable = false;
    } else {
      this.#name = name;
    }
    return this;
  }

  /**
   * Adds a middleware with the specified name and callback function.
   * @param {string} name - The name of the middleware.
   * @param {Function} callback - The callback function for the middleware.
   * @returns {void}
   */
  static addMiddleware(name, callback) {
    if (this.#middlewares[name]) return;
    this.#middlewares[name] = callback;
  }

  /**
   * Adds a middleware group with the specified name and middlewares.
   * @param {string} name - The name of the middleware group.
   * @param {Array} middlewares - The middlewares for the group.
   * @returns {void}
   */
  static addMiddlewareGroup(name, middlewares) {
    if (this.#middlewareGroups[name]) return;
    this.#middlewareGroups[name] = middlewares;
  }

  /**
   * Adds a validation with the specified name and rules.
   * @param {string} name - The name of the validation.
   * @param {Object} rules - The rules for the validation.
   * @returns {void}
   */
  static addValidation(key, validation) {
    if (this.#validations[key]) return;
    this.#validations[key] = validation;
  }

  /**
   * Adds a controller with the specified name and callback function.
   * @param {string} name - The name of the controller.
   * @param {Function} callback - The callback function for the controller.
   * @returns {void}
   */
  static addController(key, controller) {
    if (this.#controllers[key]) return;
    this.#controllers[key] = controller;
  }

  /**
   * List all routes, middlewares and validations
   * @returns {Array} routes
   * @returns {Object} middlewares
   * @returns {Object} validations
   */
  static list() {
    return {
      routes: this.#routes,
      middlewares: this.#middlewares,
      validations: this.#validations,
    };
  }

  /**
   * Clear all routes, middlewares and validations
   */
  static clear() {
    this.#routes = [];
    this.#middlewares = [];
    this.#validations = [];
  }

  /**
   * Processes the middleware(s) and returns an array of valid middlewares.
   * @param {string|Array} middleware - The middleware(s) to be processed.
   * @returns {Array} - An array of valid middlewares.
   * @private
   */
  static #proccessMiddleware(middleware) {
    let validMiddleware;
    if (Validator.string(middleware)) {
      const data = middleware.split(":");

      const validate = Validator.validate(
        data[0],
        "in:" + Object.keys(this.#middlewares).join()
      );
      const validateFailed = validate.failed();
      const validate2 = Validator.validate(
        data[0],
        "in:" + Object.keys(this.#middlewareGroups).join()
      );
      if (validateFailed && validate2.failed())
        Error.ServerError(validate.firstFail());
      if (data[1]) {
        validMiddleware = !validateFailed
          ? [this.#middlewares[data[0]](...data[1].split(","))]
          : this.#proccessMiddleware(this.#middlewareGroups[middleware]);
      } else {
        validMiddleware = !validateFailed
          ? [this.#middlewares[middleware]]
          : this.#proccessMiddleware(this.#middlewareGroups[middleware]);
      }
    } else if (Validator.array(middleware)) {
      validMiddleware = middleware.map((mw) => {
        if (Validator.string(mw)) {
          const validate = Object.keys(this.#middlewares).includes(mw);
          if (!validate && !Object.keys(this.#middlewareGroups).includes(mw)) {
            throw new Error.ServerError();
          }

          return validate
            ? this.#middlewares[mw]
            : this.#proccessMiddleware(this.#middlewareGroups[mw]);
        } else {
          return mw;
        }
      });
    } else if (Validator.function(middleware)) {
      validMiddleware = middleware;
    }
    return validMiddleware;
  }

  /**
   * Adds a slash to the beginning of the path if it is missing.
   * @param {string} path - The path to add a slash to.
   * @returns {string} - The path with a slash added to the beginning.
   * @private
   */
  static #addSlash(path) {
    return path.startsWith("/") ? path : "/" + path;
  }

  /**
   * Adds a validation field to the route object.
   * @private
   */
  static #addValidationField() {
    if (!this.#currentValidation) return;
    Object.assign(this.#routes[this.#routes.length - 1], {
      validation: this.#currentValidation,
    });
  }
};
