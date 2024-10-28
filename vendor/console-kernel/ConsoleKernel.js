const Scheduler = require("@gefion/schedule");
const Storage = require("@gefion/storage");

/**
 * Represents a console kernel for Gefion.
 * @class
 */
module.exports = class ConsoleKernel {
  /**
   * Schedules a command to run based on the provided cron expression.
   * @param {string} cronExpression - The cron expression defining the schedule.
   * @param {Function} command - The command to execute.
   * @returns {Object} The scheduled task object.
   */
  schedule(cronExpression, command) {
    return Scheduler.schedule(cronExpression, command);
  }

  /**
   * Registers console commands from the specified path.
   * @param {string} path - The path to the console commands.
   */
  commands(path) {
    require(Storage.routes(path));
  }
};
