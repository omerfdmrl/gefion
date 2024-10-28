const Config = require("@gefion/config");
const Error = require("@gefion/error");
const Validator = require("@gefion/validator");

/**
 * Represents a mail manager for Gefion.
 * @class
 */
module.exports = class Mail {
  /** @private */
  static #providers = {};

  /**
   * Get the mail provider instance based on the configuration.
   * @param {string} provider - The provider name (optional).
   * @returns {Object} - The mail provider instance.
   */
  static provider(provider) {
    const mailConfig = Config.get("mail");
    const mailProvider = mailConfig[provider ? provider : mailConfig.provider];
    const validate = Validator.validate(
      mailProvider.provider,
      "in:" + Object.keys(this.#providers).join()
    );
    if (validate.failed()) Error.ServerError(validate.firstFail());

    mailProvider.templates = mailConfig.templates;
    mailProvider.queue = mailConfig.queue;
    return new this.#providers[mailProvider.provider](mailProvider);
  }

  /**
   * Register a mail provider class.
   * @param {Class} Class - The mail provider class.
   */
  static register(Class) {
    this.#providers[Class.provider] = Class;
  }
};
