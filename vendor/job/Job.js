const Mail = require("@gefion/mail");

/**
 * Represents a job registry for Gefion.
 * @class
 */
module.exports = class Job {
  /** @private */
  static #jobs = {};

  constructor() {
    this.mail = Mail.provider();
  }

  /**
   * Registers a job or multiple jobs in the registry.
   * @param {Object|Function} Class - The job class or an object containing job classes.
   */
  static register(Class) {
    if (this.#jobs[Class.name]) return;
    this.#jobs[Class.name] = Class;
  }

  /**
   * Executes a job with the given name and arguments.
   * @param {string} name - The name of the job to execute.
   * @param {...any} args - Arguments to pass to the job constructor.
   * @returns {Object} - An instance of the executed job.
   */
  static do(name, ...args) {
    return new this.#jobs[name](...args);
  }

  /**
   * List all jobs
   * @returns {Object} jobs
   */
  static list() {
    return this.#jobs;
  }
};
