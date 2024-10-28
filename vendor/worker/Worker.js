const { Worker, workerData, parentPort } = require("worker_threads");

/**
 * Represents a utility class for running a worker thread for Gefion.
 * @class
 */
module.exports = class _Worker {
  /** @private */
  static #path;

  /**
   * The worker data.
   * @type {*}
   */
  static data = workerData;

  /**
   * The parent port for communication with the parent thread.
   * @type {import("worker_threads").MessagePort}
   */
  static parent = parentPort;

  /**
   * Sends a message to the parent thread.
   * @param {*} result - The result to send.
   */
  static post(result) {
    parentPort.postMessage(result);
  }

  /**
   * Sets the path of the worker file.
   * @param {string} path - The path of the worker file.
   * @returns {Worker} - The Worker instance.
   */
  static path(path) {
    this.#path = path;
    return this;
  }

  /**
   * Runs the worker thread.
   * @param {*} data - The data to pass to the worker.
   * @returns {Promise} - A promise that resolves with the result from the worker.
   */
  static async run(data) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(this.#path, { workerData: data });

      worker.on("message", (result) => {
        resolve(result);
      });

      worker.on("error", (error) => {
        reject(error);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(code);
        }
      });
    });
  }
};
