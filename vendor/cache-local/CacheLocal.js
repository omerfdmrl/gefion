const Cache = require("@gefion/cache");
const Hook = require("@gefion/hook");
const Validator = require("@gefion/validator");
const Error = require("@gefion/error");
const fs = require("fs");
const path = require("path");

Hook.add("admin-settings-data-cache-local", (model) => {
  return `<div class="row">
            <div class=""><label for="provider" class="form-label mt-3">Provider</label><input v-model="${model}.provider" type="text" id="provider" class="form-control" disabled=""><small class="form-text text-muted">Indicates the type of cache provider, fixed as 'local'.</small></div>
            <div class=""><label for="path" class="form-label mt-3">Path</label><input v-model="${model}.path" type="text" id="path" class="form-control"><small class="form-text text-muted">Specifies the path where the cache data will be stored locally.</small></div>
            <div class=""><label for="filePerKey" class="form-label mt-3">File Per Key</label><input v-model="${model}.filePerKey" class="form-check-input form-control" type="checkbox" id="filePerKey" value="true"><small class="form-text text-muted">If true, generates a separate file for each cache key; otherwise, stores all keys in a single file.</small></div>
            <div class=""><label for="ttl" class="form-label mt-3">TTL</label><input v-model="${model}.ttl" type="number" id="ttl" class="form-control"><small class="form-text text-muted">Time to live (TTL) for cached data. 0 means data will never expire.</small></div>
          </div>`;
});

/**
 * Represents a local cache provider for GefionCache.
 * @class
 */
class CacheLocal {
  /**
   * Name of the provider.
   * @type {string}
   * @static
   */
  static provider = "local";

  /** @private */
  #file;
  #ttl;
  #config;
  #defaultFile = "cache";

  /**
   * Creates an instance of CacheLocal.
   * @param {object} config - The configuration for the cache provider.
   */
  constructor(config) {
    this.#config = config;
  }

  /**
   * Sets the file name for the cache.
   * @param {string} file - The file name.
   * @returns {CacheLocal} The current CacheLocal instance.
   */
  file(file) {
    this.#file = file;
    return this;
  }

  /**
   * Sets the time-to-live (TTL) value for the cache.
   * @param {number} ttl - The TTL value in minutes.
   * @returns {CacheLocal} The current CacheLocal instance.
   */
  ttl(ttl) {
    this.#ttl = ttl;
    return this;
  }

  /**
   * Sets a key-value pair in the cache.
   * @param {string} key - The cache key.
   * @param {string|number|object} value - The value to be cached.
   */
  set(key, value) {
    const validate = Validator.validate(key, "required");
    if (validate.failed()) {
      Error.ServerError(validate.firstFail());
    }

    const ttl =
      (this.#ttl !== undefined
        ? this.#ttl
        : this.#config.ttl
        ? this.#config.ttl
        : 0) *
      60 *
      1000;

    const parsedValue = {
      timestamp: ttl !== 0 ? Date.now() + ttl : 0,
      data: this.#isJson(value) ? JSON.stringify(value) : value,
    };

    const data = this.#read(key);
    data[key] = JSON.stringify(parsedValue);
    this.#write(data, key);
  }

  /**
   * Appends data to an existing cache value.
   * @param {string} key - The cache key.
   * @param {string|number|object} data - The data to append.
   */
  append(key, data) {
    const validate = Validator.validate(key, "required");
    if (validate.failed()) {
      Error.ServerError(validate.firstFail());
    }
    const fileData = this.#read(key);
    let value;
    if (!fileData[key]) {
      fileData[key] = { data: {}, timestamp: 0 };
      value = fileData[key];
    } else {
      value = JSON.parse(fileData[key]);
      if (
        value.timestamp !== 0 &&
        (!value.timestamp || value.timestamp < Date.now())
      ) {
        this.del(key);
        return undefined;
      }
    }

    if (!Validator.required(value.data)) value.data = [];

    if (!Validator.string(value.data) && !Validator.array(value.data)) {
      return undefined;
    }

    if (Validator.array(value.data)) {
      value.data.push(data);
    } else {
      value.data += data;
    }

    fileData[key] = JSON.stringify(value);
    this.#write(fileData, key);
  }

  /**
   * Retrieves the value of a cache key.
   * @param {string} key - The cache key.
   * @returns {string|number|object|undefined} The cached value, or `undefined` if the key does not exist or has expired.
   */
  get(key) {
    const validate = Validator.validate(key, "required");
    if (validate.failed()) {
      Error.ServerError(validate.firstFail());
    }

    const data = this.#read(key);
    if (!Validator.required(data)) {
      return undefined;
    }

    const value = JSON.parse(data[key]);

    if (
      value.timestamp !== 0 &&
      (!value.timestamp || value.timestamp < Date.now())
    ) {
      this.del(key);
      return undefined;
    }

    return this.#isJson(value.data) ? JSON.parse(value.data) : value.data;
  }

  /**
   * Deletes a cache key.
   * @param {string} key - The cache key.
   */
  del(key) {
    const validate = Validator.validate(key, "required");
    if (validate.failed()) {
      Error.ServerError(validate.firstFail());
    }

    const data = this.#read(key);
    delete data[key];
    this.#write(data, key);
  }

  /**
   * Clears the cache for a specific key.
   * @param {string} key - The cache key.
   */
  clear(key) {
    this.#write({}, key);
  }

  /**
   * Deletes empty cache files from the cache directory.
   */
  deleteEmptyFiles() {
    const files = fs.readdirSync(this.#config.path);
    files.forEach((file) => {
      const data = fs.readFileSync(this.#config.path + file, "utf8");
      if (!Validator.required(JSON.parse(data))) {
        fs.unlinkSync(this.#config.path + file);
      }
    });
  }

  /** @private */
  async #read(key) {
    const file = this.#file
      ? this.#file
      : this.#config.filePerKey
      ? key
      : this.#defaultFile;

    await this.#ifNotExists(this.#config.path + file);
    const data = fs.readFileSync(this.#config.path + file, "utf8");
    return JSON.parse(data);
  }

  /** @private */
  #write(data, key) {
    const file = this.#file
      ? this.#file
      : this.#config.filePerKey
      ? key
      : this.#defaultFile;

    this.#ifNotExists(this.#config.path + file);
    fs.writeFileSync(this.#config.path + file, JSON.stringify(data), "utf8");

    this.#ttl = undefined;
    this.#file = undefined;
  }

  /** @private */
  async #ifNotExists(filePath) {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify({}));
    }
  }

  /** @private */
  #isJson(data) {
    try {
      JSON.parse(data);
    } catch (error) {
      return false;
    }
    return true;
  }
}

Cache.register(CacheLocal);
