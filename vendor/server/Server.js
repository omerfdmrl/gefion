const Config = require("@gefion/config");
const Error = require("@gefion/error");
const Validator = require("@gefion/validator");

/**
 * Represents a server manager for Gefion.
 * @class
 */
module.exports = class Server {
  static #providers = {};

  /**
   * Constructs an instance of the Server class.
   * Initializes and starts the server based on the configured provider.
   */
  constructor() {
    const serverConfig = Config.get("server");
    const corsConfig = Config.get("cors");
    const ProviderClass = Server.provider();
    ProviderClass.serve(Object.assign(serverConfig, { cors: corsConfig }));
    const Public = Config.get("filesystem");
    Object.values(Public).forEach((d) => {
      if (!Validator.string(Validator) && d.visibility) {
        ProviderClass.static(this.#addSlash(d.link), d.path);
      }
    });
  }

  /**
   * Get the server provider based on the configuration.
   * @returns {object} - The server provider instance.
   */
  static provider() {
    const serverConfig = Config.get("server");
    const validate = Validator.validate(
      serverConfig.provider,
      "in:" + Object.keys(Server.#providers).join()
    );
    if (validate.failed()) Error.ServerError(validate.firstFail());
    return this.#providers[serverConfig.provider];
  }

  /**
   * Register a server provider class.
   * @param {object} Class - The server provider class.
   */
  static register(Class) {
    this.#providers[Class.provider] = Class;
  }

  #addSlash(path) {
    return path.startsWith("/") ? path : "/" + path;
  }
};
