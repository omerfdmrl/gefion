const Config = require("@gefion/config");
const Error = require("@gefion/error");
const Validator = require("@gefion/validator");

/**
 * Represents a message queue manager for Gefion.
 * @class
 */
module.exports = class Mq {
  /** @private */
  static #providers = {};

  /**
   * Get an instance of the specified message queue provider.
   * @param {string} provider - The name of the message queue provider.
   * @returns {Object} - An instance of the specified message queue provider.
   */
  static provider(provider) {
    const mqConfig = Config.get("mq");
    const mqProvider = mqConfig[provider ? provider : mqConfig.provider];
    const validate = Validator.validate(
      mqProvider.provider,
      "in:" + Object.keys(this.#providers).join()
    );
    if (validate.failed()) Error.ServerError(validate.firstFail());
    return new this.#providers[mqProvider.provider](mqProvider);
  }

  /**
   * Register a message queue provider class.
   * @param {Class} Class - The message queue provider class to register.
   */
  static register(Class) {
    this.#providers[Class.provider] = Class;
  }
};
