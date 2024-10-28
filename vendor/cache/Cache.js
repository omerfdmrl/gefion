const Config = require("@gefion/config");
const Error = require("@gefion/error");
const Validator = require("@gefion/validator");

/**
 * Represents a cache manager for Gefion.
 * @class
 */
module.exports = class Cache {
  /** @private */
  static #providers = {};

  /**
   * @typedef {Object} Provider
   * @property {Function} file - Set file name
   * @property {Function} ttl - Set ttl (storage) time
   * @property {Function} set - Cache new data
   * @property {Function} append - Append value to data
   * @property {Function} get - Get cache value
   * @property {Function} del - Delete cache
   * @property {Function} clear - Delete all cached data
   * @property {Function} deleteEmptyFiles - Delete empty cache files
   */

  /**
   * Gets an instance of the cache provider.
   * @param {string} [provider] - The provider name. If not specified, uses the default provider from the configuration.
   * @returns {Provider} An instance of the cache provider.
   */
  static provider(provider) {
    const cacheConfig = Config.get("cache");
    const cacheProvider =
      cacheConfig[provider ? provider : cacheConfig.provider];
    const validate = Validator.validate(
      cacheProvider.provider,
      "in:" + Object.keys(this.#providers).join()
    );
    if (validate.failed()) Error.ServerError(validate.firstFail());

    return new this.#providers[cacheProvider.provider](cacheProvider);
  }

  /**
   * Registers a cache provider class.
   * @param {object} Class - The cache provider class to register.
   */
  static register(Class) {
    this.#providers[Class.provider] = Class;
  }
};
