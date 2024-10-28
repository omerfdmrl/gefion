const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const Logger = require("@gefion/logger");
const Server = require("@gefion/server");
const Storage = require("@gefion/storage");

/**
 * Represents the Express provider for GefionServer.
 * @class
 */
class ServerExpress {
  /**
   * Name of the provider.
   * @type {string}
   * @static
   */
  static provider = "express";

  /**
   * The underlying HTTP server instance.
   * @type {object}
   * @static
   */
  static server;

  /**
   * The main router instance for the Express app.
   * @type {object}
   * @static
   */
  static router;

  /**
   * The Express app instance.
   * @type {object}
   * @static
   */
  static app;

  /**
   * Adds middleware to the Express app.
   * @param {app.use} args - The middleware functions to be added.
   */
  static use(...args) {
    this.app.use(...args);
  }

  /**
   * Sets the value of a setting in the Express app.
   * @param {string} setting - The setting to be set.
   * @param {*} value - The value to set for the setting.
   */
  static set(setting, value) {
    this.app.set(setting, value);
  }

  /**
   * Registers an OPTIONS route in the Express app.
   * @param {string} path - The path for the OPTIONS route.
   * @param {...Function} args - The route handlers for the OPTIONS route.
   */
  static options(path, ...args) {
    this.app.options(path, ...args);
  }

  /**
   * Adds a static file serving middleware to the Express app.
   * @param {string} link - The URL path for accessing the static files.
   * @param {string} path - The local file system path of the static files.
   * @param {object} config - Configuration of the static files.
   */
  static static(link, path, config = {}) {
    if (path) this.use(link, express.static(path, config));
    else this.use(express.static(link));
  }

  /**
   * Enables a given Express app setting.
   * @param {string} setting - The setting to be enabled.
   */
  static enable(setting) {
    this.app.enable(setting);
  }

  /**
   * Disables a given Express app setting.
   * @param {string} setting - The setting to be disabled.
   */
  static disable(setting) {
    this.app.disable(setting);
  }

  /**
   * Initializes and starts the Express server.
   * @param {Object} config - The configuration object.
   * @param {Object} cors - The configuration object for cors.
   */
  static serve(config) {
    this.app = express();

    // Set security HTTP headers
    /* this.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            scriptSrc: ["'self'", "'unsafe-eval'"],
          },
        },
      })
    ); */

    // Parse JSON request body
    this.use(express.json());

    // Parse urlencoded request body
    this.use(express.urlencoded({ extended: true }));

    // Sanitize request data
    this.use(xss());

    // Gzip compression
    this.use(compression());

    // Enable CORS
    this.use(cors(config.cors));
    this.options("*", cors());

    if (config.view_engine) {
      this.set("view engine", config.view_engine);
    }

    if (config.view_cache) {
      this.enable("view cache");
    }

    this.set("views", Storage.resource("views"));

    const port = config.port;
    this.server = this.app.listen(port, () => {
      Logger.info(`Listening to port ${port}`);
    });

    this.router = this.app;
    this.#handlers();
  }

  /**
   * Handles process-related events such as uncaught exceptions and SIGTERM signals.
   * Closes the server and exits the process when necessary.
   * @private
   */
  static #handlers() {
    const exitHandler = () => {
      if (this.server) {
        this.server.close(() => {
          Logger.info("Server closed");
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error) => {
      Logger.error(error);
      exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    process.on("SIGTERM", () => {
      Logger.info("SIGTERM received");
      exitHandler();
    });
    process.on("SIGINT", () => {
      Logger.info("SIGINT received");
      exitHandler();
    });
    process.on("SIGQUIT", () => {
      Logger.info("SIGQUIT received");
      exitHandler();
    });
  }
}

Server.register(ServerExpress);
