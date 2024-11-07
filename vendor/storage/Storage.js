const Config = require("@gefion/config");
const Validator = require("@gefion/validator");
const Error = require("@gefion/error");

/**
 * Represents the utility methods for file and resource paths, as well as disk storage operations for GefionDb.
 * @class
 */
module.exports = class Storage {
  /** @private */
  static #providers = {};
  /** @private */
  static basedir = __basedir;

  /**
   * Generates the file path for route files.
   * @param {string} path - Relative path to the route file.
   * @returns {string} - Absolute file path for the route file.
   */
  static routes(path) {
    return (
      __basedir + "/routes/" + this.#addExtension(this.#removeSlash(path), "js")
    );
  }

  /**
   * Generates the file path for application files.
   * @param {string} path - Relative path to the application file.
   * @returns {string} - Absolute file path for the application file.
   */
  static app(path) {
    return __basedir + "/app/" + this.#addSlash(this.#removeSlash(path));
  }

  /**
   * Generates the file path for resource files.
   * @param {string} path - Relative path to the resource file.
   * @returns {string} - Absolute file path for the resource file.
   */
  static resource(path) {
    return __basedir + "/resources/" + this.#addSlash(this.#removeSlash(path));
  }

  /**
   * Generates the file path for storage files.
   * @param {string} path - Relative path to the storage file.
   * @returns {string} - Absolute file path for the storage file.
   */
  static storage(path) {
    return __basedir + "/storage/" + this.#addSlash(this.#removeSlash(path));
  }

  /**
   * Removes leading slash from the path.
   * @private
   * @param {string} path - The path to remove the leading slash from.
   * @returns {string} - The modified path without the leading slash.
   */
  static #removeSlash(path) {
    return path.startsWith("/") ? path.substring(1) : path;
  }

  /**
   * Adds a trailing slash to the path.
   * @private
   * @param {string} path - The path to add the trailing slash to.
   * @returns {string} - The modified path with the trailing slash.
   */
  static #addSlash(path) {
    return path.endsWith("/") ? path : path + "/";
  }

  /**
   * Adds an extension to the path if it doesn't already have one.
   * @private
   * @param {string} path - The path to add the extension to.
   * @param {string} extension - The extension to add.
   * @returns {string} - The modified path with the extension.
   */
  static #addExtension(path, extension) {
    return path.endsWith(extension) ? path : path + "." + extension;
  }

  /**
   * Registers a storage provider.
   * @param {object} provider - The storage provider to register.
   */
  static register(provider) {
    this.#providers[provider.provider] = provider;
  }

  /**
   * Retrieves an instance of the disk storage provider.
   * @param {string} provider - The name of the storage provider.
   * @returns {object} - The instance of the storage provider.
   */
  static disk(provider) {
    const storageConfig = Config.get("filesystem");
    const providerName = provider ? provider : storageConfig.provider;
    const storageProvider = storageConfig[providerName];
    const validate = Validator.validate(
      provider,
      "in:" + Object.keys(this.#providers).join()
    );

    if (validate.failed()) return Error.ValidationError(validate.firstFail());
    return new this.#providers[providerName](storageProvider);
  }
};
