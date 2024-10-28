const Error = require("@gefion/error");

/**
 * Represents a document instance for a specific model for GefionDb.
 * @class
 */
module.exports = class Document {
  /**
   * Creates an instance of Document.
   * @param {Object} data - The data for the document.
   * @param {Object} modelSchema - The schema definition for the model.
   * @param {string} modelName - The name of the model.
   * @param {Object} options - The options for the document.
   * @param {Object} adapter - The adapter for database operations.
   */
  constructor(data, modelSchema, modelName, options, adapter) {
    if (!data) throw new Error.DatabaseError("There is no data");
    Object.assign(this, data);
    if (!this.id) {
      this._isNew = true;
      this.id = Document.generateID();
      data.id = this.id;
    }
    Object.keys(modelSchema.schema).forEach((key) => {
      if (!data[key]) {
        const modelData = modelSchema.schema[key];
        this[key] = modelData.default
          ? modelData.default
          : this.#getDefaultByType(modelData.type);
        data[key] = this[key];
      }
    });
    Object.defineProperty(this, "_data", {
      writable: true,
      configurable: false,
      enumerable: false,
      value: data,
    });
    Object.defineProperty(this, "_modelSchema", {
      writable: true,
      configurable: false,
      enumerable: false,
      value: modelSchema,
    });
    for (let method of Object.keys(modelSchema.methods)) {
      this[method] = modelSchema.methods[method].bind(this);
    }
    for (let pre of Object.keys(modelSchema.pre)) {
      modelSchema.pre[pre] = modelSchema.pre[pre].bind(this);
    }
    Object.defineProperty(this, "_modelName", {
      writable: true,
      configurable: false,
      enumerable: false,
      value: modelName,
    });
    Object.defineProperty(this, "_options", {
      writable: true,
      configurable: false,
      enumerable: false,
      value: options,
    });
    Object.defineProperty(this, "_adapter", {
      writable: true,
      configurable: false,
      enumerable: false,
      value: adapter,
    });
  }

  /**
   * @private
   * @param {Function|String} type - Field type to get default data
   * @returns {*};
   */
  #getDefaultByType(type) {
    switch (type) {
      case String:
        return "";
      case Boolean:
        return false;
      case Number:
        return 0;
      case Array:
        return [];
      case Object:
        return {};
      default:
        return undefined;
    }
  }

  /**
   * Check the if field modified
   * @returns {Boolean} Result of check as true or false
   */
  isModified(field) {
    return this._isNew ? true : this._data[field] !== this[field];
  }

  /**
   * Saves the document to the database.
   * @throws {Error.DatabaseError} If there is an error during validation or database insertion.
   * @returns {Promise<Object>} A Promise that resolves to the saved document.
   */
  async save() {
    var currentData = {};
    let shouldSave = true;

    if (this._modelSchema.pre.save) {
      await new Promise((resolve, reject) => {
        this._modelSchema.pre.save(this, (err) => {
          if (err) {
            shouldSave = err;
            reject(err);
          } else {
            shouldSave = true;
            resolve();
          }
        });
      });
    }
    Object.keys(this._data).forEach((key) => {
      currentData[key] = this[key];
    });
    if (shouldSave !== true) {
      throw new Error.DatabaseError(shouldSave);
    }

    const validated = await this._modelSchema.validate(currentData, null, this);

    if (validated.errors && validated.errors.length)
      throw new Error.DatabaseError(validated.errors[0]);

    if (this._isNew) {
      return await this._adapter
        .collection(this._modelName)
        .insertOne(currentData);
    } else {
      return await this._adapter
        .collection(this._modelName)
        .updateOne({ id: currentData.id }, { $set: currentData });
    }
  }

  /**
   * Updates the document in the database.
   * @param {Object} data - The data to be updated in the document.
   * @throws {Error.DatabaseError} If there is an error during validation or database update.
   * @returns {Promise<Object>} A Promise that resolves to the updated document.
   */
  async update(data) {
    var currentData = {};
    Object.keys(this._data).forEach((key) => {
      currentData[key] = data[key] ? data[key] : this[key];
    });
    const validated = this._modelSchema.validate(currentData);
    if (validated.errors && validated.errors.length)
      throw new Error.DatabaseError(validated.errors[0]);
    return await this._adapter
      .collection(this._modelName)
      .updateOne({ id: this._data.id }, currentData);
  }

  /**
   * Gets the count of elements in the document.
   * @returns {number} The count of elements in the document.
   */
  count() {
    return this._data.length;
  }

  /**
   * Checks if the document is valid based on its schema.
   * @returns {boolean} true if the document is valid; otherwise, false.
   */
  isValid() {
    var currentData = {};
    Object.keys(this._data).forEach((key) => {
      currentData[key] = this[key] ? this[key] : this._data[key];
    });
    return this.this._modelSchema.validate(currentData);
  }

  /**
   * Deletes the document from the database.
   * @throws {Error.DatabaseError} If there is an error during database deletion.
   * @returns {Promise<boolean>} A Promise that resolves to true if the deletion is successful.
   */
  async delete() {
    return await this._adapter.collection(this._modelName).deleteOne({
      id: this._data.id,
    });
  }

  /**
   * Populates a specific path in the document with data from the database.
   * @param {string} path - The path to populate in the document.
   * @throws {Error.DatabaseError} If there is an error during database retrieval.
   * @returns {Promise<Object>} A Promise that resolves to the populated data.
   */
  async populate(path) {
    const data = await this._adapter
      .collection(this._modelSchema.schema[path].ref)
      .findOne({ id: this._data[path] });

    Object.assign(this._data, { path: data });
    this[path] = data;

    const currentData = Object.keys(this._data).reduce((acc, key) => {
      acc[key] = this[key] !== undefined ? this[key] : this._data[key];
      return acc;
    }, {});
    return currentData;
  }

  static generateID() {
    return [...Array(24)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  }
};
