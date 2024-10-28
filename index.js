/**
 * Main entry point of the application.
 * Performs the bootstrap process to initialize the application.
 * @file This file is responsible for start aplication
 * @module index
 *
 */

const Config = require("@gefion/config");

/**
 * Set the global __basedir variable to the current directory.
 */
function setBasedir() {
  global.__basedir = __dirname;
}

/**
 * Load the application configuration.
 *
 * @async
 * @returns {Promise<void>}
 */
async function loadConfig() {
  await Config.load(__basedir + "/configs");
}

/**
 * Require and execute the bootstrap file.
 */
function executeBootstrap() {
  require("./bootstrap/app.js");
}

/**
 * Entry point of the application.
 * Starts the bootstrap process.
 */
async function startApplication() {
  setBasedir();

  try {
    await loadConfig();
    executeBootstrap();
  } catch (error) {
    console.error("An error occurred during bootstrap application:", error);
  }
}

/**
 * Start the application
 */
startApplication();
