const Config = require("@gefion/config");
const Mq = require("@gefion/mq");
const mqConfig = Config.get("mq");
const Cache = require("@gefion/cache");
const Validator = require("@gefion/validator");
const Hook = require("@gefion/hook");

Hook.add("admin-settings-data-mq-local", (model) => {
  return `<div class="row">
            <div><label for="provider" class="form-label mt-3">Provider</label><input v-model="${model}.provider" type="text" id="provider" class="form-control" disabled=""><small class="form-text text-muted">Indicates the type of queue provider, fixed as 'local'.</small></div>
            <div>
                <label for="cache" class="form-label mt-3">Cache</label>
                <select v-model="${model}.cache" id="cache" class="form-select">
                  <option v-for="(data, index) in Object.keys(data.cache).filter(c => c !== 'provider')" :value="data">{{ data }}</option>
                </select>
                <small class="form-text text-muted">Cache provider for save queue.</small>
            </div>
            <div><label for="queue" class="form-label mt-3">Host</label><input v-model="${model}.queue" type="text" id="queue" class="form-control"><small class="form-text text-muted">Specifies the queue name for defaul queue.</small></div>
          </div>`;
});

/**
 * Local Message Queue provider for Gefion.
 */
class MqLocal {
  /**
   * Name of the provider.
   * @type {string}
   * @static
   */
  static provider = "local";

  #config = mqConfig[mqConfig.provider];
  #cache = Cache.provider(mqConfig[mqConfig.provider].cache);
  #queue;
  #priority = 0;

  /**
   * Constructs a new instance of MqLocal.
   * @param {Object} config - Configuration object for the local message queue provider.
   */
  constructor(config) {
    this.#config = config;
  }

  /**
   * Sets the queue for sending messages.
   * @param {string} queue - The name of the queue.
   * @returns {MqLocal} - The MqLocal instance.
   */
  queue(queue) {
    this.#queue = queue;
    return this;
  }

  /**
   * Sets the priority for sending messages.
   * @param {number} priority - The priority of the message.
   * @returns {MqLocal} - The MqLocal instance.
   */
  priority(priority) {
    this.#priority = priority;
    return this;
  }

  /**
   * Sends a message to the message queue.
   * @param {Object} data - The data to be sent.
   */
  send(data) {
    const queue = this.#queue ? this.#queue : this.#config.queue;
    const validate = Validator.validate(queue, "required");
    if (validate.failed()) {
      Error.ServerError(validate.firstFail());
    }

    const job = {
      data,
      priority: this.#priority,
    };

    this.#cache.append(queue, job);
  }

  /**
   * Consumes messages from the message queue and invokes the provided callback.
   * @param {Function} callback - The callback function to be invoked for each consumed message.
   */
  async consume(callback) {
    const queue = this.#queue ? this.#queue : this.#config.queue;
    const datas = this.#cache.get(queue);

    if (datas) {
      const jobs = datas.sort((a, b) => a.priority - b.priority);

      jobs.forEach((job) => {
        callback(job.data);
      });
      this.#cache.del(queue);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setImmediate(this.consume.bind(this, callback));
  }
}

Mq.register(MqLocal);
