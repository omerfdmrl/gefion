const HttpKernel = require("@gefion/http-kernel");
const ConsoleKernel = require("@gefion/console-kernel");
const Config = require("@gefion/config");
const aggregation = require("./utils/aggregation");

/**
 * Represents a package manager for Gefion.
 * @class
 */
module.exports = class Package extends aggregation(HttpKernel, ConsoleKernel) {
  constructor() {
    super();
  }

  /**
   * Load the configuration file from the specified path.
   * @param {string} file - The path to the configuration file
   */
  async config(file) {
    await Config.add(file);
  }
};
