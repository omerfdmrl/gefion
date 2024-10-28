/**
 * This file is the entry point for bootstrapping the application.
 * It requires the necessary extensions, helper, packages and cache files, and initializes the application by instantiating the required providers and kernels.
 * @file This file is responsible for bootstrapping the application and initializing the necessary providers and kernels.
 * @module initialization
 *
 */

/**
 * Import the required extensions, helper, packages, cache and hooks files
 */
require("./extensions");
require("./helper");
const packages = require("./packages");
function cache() {
  return require("./cache");
}
function hooks() {
  return require("./hooks");
}

/**
 * Import the required providers and kernels
 */
const ServerProvider = require("../app/Providers/ServerProvider");
const DatabaseProvider = require("../app/Providers/DatabaseProvider");
const ConsoleKernel = require("../app/Console/Kernel");
const HttpKernel = require("../app/Http/Kernel");

/**
 *
 * Bootstrap the application.
 * This function initializes the ServerProvider, DatabaseProvider, ConsoleKernel, and HttpKernel by instantiating their respective classes.
 * It waits for all the initialization tasks to complete before proceeding.
 * @function bootstrap
 * @returns {Promise<void>} A Promise that resolves when the bootstrap process is completed.
 */
async function bootstrap() {
  await Promise.all([
    new DatabaseProvider(),
    new ServerProvider(),
    new ConsoleKernel(),
    new HttpKernel(),
    cache(),
    hooks(),
    packages(),
  ]);
}

/**
 * Call the bootstrap function to start the application
 */
bootstrap();
