const Validator = require("@gefion/validator");
const Error = require("@gefion/error");
/**
 * Represents a hook manager for Gefion.
 * @class
 */
module.exports = class Hook {
  /** @private */
  static #events = {};

  /**
   * Registers a hook event with the specified name and callback.
   * @param {string} name - The name of the hook event.
   * @param {Function} [callback=null] - The callback function to be executed when the hook event is triggered.
   * @param {*} [value=null] - The initial value to be passed to the callbacks.
   * @param {number} [priority=10] - The priority of the callback (higher values run first).
   * @returns {*} The modified value after all callbacks have been executed.
   */
  static async #hook(name, callback = null, value = null, priority = 10) {
    if (callback !== null) {
      if (callback) {
        if (!this.#events[name]) {
          this.#events[name] = [];
        }
        this.#events[name].push({ callback, priority });
        return true;
      } else {
        delete this.#events[name];
        return true;
      }
    } else if (this.#events[name]) {
      let sortedEvents = this.#events[name].sort(
        (a, b) => b.priority - a.priority
      );
      for (const event of sortedEvents) {
        value = await event.callback(value);
      }
    }
    return value;
  }

  /**
   * Registers a hook event with the specified name and callback.
   * @param {string} name - The name of the hook event.
   * @param {Function} callback - The callback function to be executed when the hook event is triggered.
   * @param {number} [priority=10] - The priority of the callback (higher values run first).
   * @returns {*} The modified value after all callbacks have been executed.
   */
  static add(name, callback, priority = 10) {
    const validate = Validator.validate(
      { name, callback },
      { name: "required|string", callback: "required|function" }
    );
    if (validate.failed()) Error.ValidationError(validate.firstFail());
    return this.#hook(name, callback, null, priority);
  }

  /**
   * Executes the hook event with the specified name and passes the value through all associated callbacks.
   * @param {string} name - The name of the hook event.
   * @param {*} value - The value to be passed through the callbacks.
   * @returns {*} The modified value after all callbacks have been executed.
   */
  static async do(name, value) {
    const validate = Validator.validate(name, "required|string");
    if (validate.failed()) Error.ValidationError(validate.firstFail());
    return await this.#hook(name, null, value);
  }

  /**
   * Removes the hook event with the specified name.
   * @param {string} name - The name of the hook event to remove.
   */
  static remove(name) {
    const validate = Validator.validate(
      name,
      "required|string|in:" + Object.keys(this.#events).join(",")
    );
    if (validate.failed()) Error.ValidationError(validate.firstFail());
    return this.#hook(name, false);
  }
};
