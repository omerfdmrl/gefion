const fs = require("fs");
const path = require("path");
const Error = require("@gefion/error");

/**
 * Represents a configuration manager for Gefion.
 * @class
 */
module.exports = class Config {
  /** @private */
  static #configs = {};
  static #path;

  /**
   * Loads the configuration files from the specified path.
   * @param {string} path - The path to the configuration files.
   */
  static async load(path) {
    this.#path = path;
    const files = await fs.promises.readdir(path);
    if (files.includes("filesystem.config.js"))
      this.#configs["validator"] = require(`${path}/validator.config.js`);
    for (let file of files) {
      const config = await require(`${path}/${file}`);
      this.#configs[file.split(".")[0]] = config;
    }
  }

  /**
   * Load the configuration file from the specified path.
   * @param {string} file - The path to the configuration file
   */
  static async add(file) {
    const fileName = await path.basename(file).split(".")[0];
    if (this.#configs[fileName]) return;
    this.#configs[fileName] = await require(file);
  }

  /**
   * Retrieves the value associated with the specified key from the configuration.
   * If the key or any intermediate object in the key path is not found, the defaultValue is returned.
   * @param {*} defaultValue - The value to be returned if the key or any intermediate object is not found. Optional.
   * @returns {*} The value associated with the key, or the defaultValue if not found. If the key or any intermediate object is not found and defaultValue is not provided, undefined is returned.
   * @throws {Error.ConfigurationError} If the key is not provided.
   */
  static get(key, defaultValue) {
    if (!key) throw new Error.ConfigurationError();
    const parts = key.split(".");
    let obj = this.#configs[parts[0]];
    for (let i = 1; i < parts.length; i++) {
      if (obj && obj.hasOwnProperty(parts[i])) {
        obj = obj[parts[i]];
      } else if (defaultValue) {
        return defaultValue;
      } else {
        return undefined;
      }
    }

    return obj;
  }

  /**
   * Sets the value associated with the specified key in the configuration.
   * If the key or any intermediate object in the key path is not found, an error is thrown.
   * The function merges the new data with the existing data at the specified key.
   * @param {string} key - The key specifying the path in the configuration where the data should be set. Required.
   * @param {object} data - The data to be set at the specified key. Required.
   * @throws {Error.ConfigurationError} If the key is not provided
   */
  static async set(key, data) {
    const oldData = this.get(key, false);
    if (!oldData) throw new Error.ConfigurationError();
    const parts = key.split(".");
    let dataToModify = oldData;
    parts.forEach((part) => {
      dataToModify = dataToModify[part];
    });
    const modifiedData = { ...dataToModify, ...data };
    this.#configs[parts[0]] = modifiedData;
    let modifiedDataString = JSON.stringify(modifiedData, null, 2);
    modifiedDataString = "module.exports = " + modifiedDataString;
    fs.writeFileSync(`${this.#path}/${parts[0]}.config.js`, modifiedDataString);
  }

  /**
   * Retrieves all configurations.
   * @returns {object} An object containing all the configuration key-value pairs.
   */
  static all() {
    return this.#configs;
  }
};
