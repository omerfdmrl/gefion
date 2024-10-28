const Router = require("@gefion/router");
const Job = require("@gefion/job");
const Validator = require("@gefion/validator");
const Storage = require("@gefion/storage");
const path = require("path");
/**
 * Represents a http kernel for Gefion.
 * @class
 */
module.exports = class HttpKernel {
  /**
   * Loads the routes from the specified file or files.
   * @param {string|string[]} routes - The path(s) to the route file(s).
   */
  routes(routes) {
    if (Validator.string(routes)) {
      require(path.isAbsolute(routes) ? routes : Storage.routes(routes));
    } else if (Validator.array(routes)) {
      routes.forEach((route) => {
        require(path.isAbsolute(route) ? route : Storage.routes(route));
      });
    }
  }

  /**
   * Load the jobs from the specified file or files
   * @param {string|string[]} jobs - The path(s) to the job file(s)
   */
  jobs(jobs) {
    if (Validator.object(jobs)) {
      Object.keys(jobs).forEach((key) => {
        Job.register(jobs[key]);
      });
    } else {
      Job.register(jobs);
    }
  }

  /**
   * Registers middleware groups or individual middleware functions.
   * @param {Object} middlewares - An object containing middleware groups or individual middleware functions.
   */
  middlewares(middlewares) {
    Object.keys(middlewares).forEach((middleware) => {
      if (Validator.array(middlewares[middleware])) {
        Router.addMiddlewareGroup(middleware, middlewares[middleware]);
      } else {
        Router.addMiddleware(middleware, middlewares[middleware]);
      }
    });
  }

  /**
   * Registers route validations.
   * @param {Object} validations - An object containing route validations.
   */
  validations(validations) {
    Object.keys(validations).forEach((validation) => {
      Object.keys(validations[validation]).forEach((key) => {
        Router.addValidation(
          validation + "." + key,
          validations[validation][key]
        );
      });
    });
  }

  /**
   * Registers route controllers.
   * @param {Object} controllers - An object containing route controllers.
   */
  controllers(controllers) {
    Object.keys(controllers).forEach((controller) => {
      Object.keys(controllers[controller]).forEach((key) => {
        Router.addController(
          controller + "." + key,
          controllers[controller][key]
        );
      });
    });
  }
};
