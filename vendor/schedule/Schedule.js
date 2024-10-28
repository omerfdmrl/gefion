const cron = require("node-cron");
const Config = require("@gefion/config");
const Validator = require("@gefion/validator");

/**
 * Represents a task scheduler for Gefion.
 * @class
 */
module.exports = class Schedule {
  static #cronExpression;
  static #command;
  static #commands = {};

  /**
   * Register a command with a callback function.
   * @param {string} command - The command name.
   * @param {Function} callback - The callback function to be executed.
   */
  static command(command, callback) {
    this.#commands[command] = callback;
  }

  /**
   * Schedule a task to run at a specified cron expression.
   * @param {string} cronExpression - The cron expression defining the schedule.
   * @param {string|Function} command - The command associated with the task. It can be a command name or a callback function.
   * @returns {cron.ScheduledTask} - Task that you can manipulate or stop.
   */
  static schedule(cronExpression, command) {
    this.#cronExpression = cronExpression;
    this.#command = command;
    return this.#start();
  }

  static #start() {
    const func = Validator.string(this.#command)
      ? this.#commands[this.#command]
      : this.#command;
    return cron.schedule(this.#cronExpression, func, Config.get("schedule"));
  }
};
