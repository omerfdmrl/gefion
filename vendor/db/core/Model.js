const Schema = require("./Schema");
const Document = require("./Document");
const Error = require("@gefion/error");
const Validator = require("@gefion/validator");

class Model {
  /**
   * Represents a Model for interacting with GefionDb.
   * @class
   */
  /** @private */
  static #models = {};

  constructor(name, schema, options) {
    this.name = name;
    if (!(schema instanceof Schema))
      throw new Error.DatabaseError("Invalid Schema");
    this.schema = schema;
    this.modelOptions = { ...Model.defaultModelOptions, ...options };
    this.options = {};
    this.adapter = require("@gefion/db").provider(this.modelOptions.provider);
    for (let staticMethod of Object.keys(schema.statics)) {
      Model[staticMethod] = schema.statics[staticMethod];
    }
    Model.#models[name] = this;
  }

  /**
   * Get registered model instance
   *
   * @param {String} model - Name of model
   * @returns
   */
  static model(model) {
    if (!Validator.required(this.#models[model])) return null;

    return this.#models[model];
  }

  static defaultModelOptions = {
    ascending: true,
    timestamp: false,
  };

  /**
   * Inserts a new document into the collection.
   * @param {Object} data - The data for the new document.
   * @throws {Error.DatabaseError} If there is an error during validation or database insertion.
   * @returns {Promise<Document>} A Promise that resolves to the inserted document.
   */
  async insert(data) {
    if (this.modelOptions.timestamp && data.createdAt === undefined) {
      data.createdAt = Date.now();
    }
    const document = new Document(
      data,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
    await document.save();
    return document;
  }

  /**
   * Sets the maximum number of documents to return in a query.
   * @param {number} limit - The maximum number of documents to return.
   * @returns {Model} The current Model instance with the limit filter applied.
   */
  limit(limit) {
    this.options.limit = limit;
    return this;
  }

  /**
   * Sets the sorting criteria for the query.
   * @param {Object} sort - The sorting criteria.
   * @returns {Model} The current Model instance with the sort filter applied.
   */
  sort(sort) {
    this.options.sort = sort;
    return this;
  }

  /**
   * Sets the number of documents to skip before returning results.
   * @param {number} skip - The number of documents to skip.
   * @returns {Model} The current Model instance with the skip filter applied.
   */
  skip(skip) {
    this.options.skip = skip;
    return this;
  }

  /**
   * Sets the fields of documents to select before returning results.
   * @param {Object} select - The fields of documents to select.
   * @returns {Model} The current Model instance with the select filter applied.
   */
  select(select) {
    this.options.select = select;
    return this;
  }

  /**
   * Sets the will populate fields of documents before returning results.
   * @param {string} path - The path of documents to populate.
   * @param {select} select - The path of field to select from documents.
   * @returns {Model} The current Model instance with the select filter applied.
   */
  populate(path, select) {
    this.options.populate = select
      ? {
          from: this.schema.schema[path].ref,
          localField: path,
          foreignField: "id",
          as: path,
          select,
        }
      : path;

    return this;
  }

  /**
   * Finds multiple documents in the collection that match the filter.
   * @param {Object} filter - The filter criteria.
   * @throws {Error.DatabaseError} If there is an error during database retrieval.
   * @returns {Promise<Array<Document>>} A Promise that resolves to an array of documents.
   */
  async find(filter) {
    const datas = await this.adapter
      .collection(this.name)
      .find(filter, this.options);
    const documents = [];
    datas.forEach((data) => {
      documents.push(
        new Document(
          data,
          this.schema,
          this.name,
          this.modelOptions,
          this.adapter
        )
      );
    });
    return documents;
  }

  /**
   * Finds a single document in the collection that matches the filter.
   * @param {Object} filter - The filter criteria.
   * @throws {Error.DatabaseError} If there is an error during database retrieval.
   * @returns {Promise<Document>} A Promise that resolves to the matched document or null if not found.
   */
  async findOne(filter) {
    const data = await this.adapter
      .collection(this.name)
      .findOne(filter, this.options);

    return new Document(
      data,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Finds a single document in the collection that matches the filter and updates it.
   * @param {Object} filter - The filter criteria to find the document to update.
   * @param {Object} data - The data to update the matched document.
   * @throws {Error.DatabaseError} If there is an error during validation or database update.
   * @returns {Promise<Document>} A Promise that resolves to the updated document or null if not found.
   */
  async findOneAndUpdate(filter, data) {
    if (this.modelOptions.timestamp) {
      data.updatedAt = Date.now();
    }

    await this.adapter.collection(this.name).findOneAndUpdate(filter, data);

    return new Document(
      data,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Finds a single document in the collection that matches the filter and replaces it with new data.
   * @param {Object} filter - The filter criteria to find the document to replace.
   * @param {Object} data - The data to replace the matched document.
   * @throws {Error.DatabaseError} If there is an error during validation or database update.
   * @returns {Promise<Document>} A Promise that resolves to the replaced document or null if not found.
   */
  async findOneAndReplace(filter, data) {
    if (this.modelOptions.timestamp) {
      data.updatedAt = Date.now();
    }
    const replacedData = await this.adapter
      .collection(this.name)
      .findOneAndReplace(filter, data);
    return new Document(
      replacedData,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Replaces a single document in the collection that matches the filter with new data.
   * @param {Object} filter - The filter criteria to find the document to replace.
   * @param {Object} data - The data to replace the matched document.
   * @throws {Error.DatabaseError} If there is an error during database update.
   * @returns {Promise<Document>} A Promise that resolves to the replaced document or null if not found.
   */
  async replaceOne(filter, data) {
    if (this.modelOptions.timestamp) {
      data.updatedAt = Date.now();
    }
    const replacedData = await this.adapter
      .collection(this.name)
      .replaceOne(filter, data);
    return new Document(
      replacedData,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Finds a single document in the collection that matches the provided ID.
   * @param {string} id - The ID of the document to find.
   * @throws {Error.DatabaseError} If there is an error during database retrieval.
   * @returns {Promise<Document>} A Promise that resolves to the matched document or null if not found.
   */
  async findById(id) {
    const data = await this.adapter.collection(this.name).findOne({ id });
    return new Document(
      data,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Updates a single document in the collection that matches the filter.
   * @param {Object} filter - The filter criteria to find the document to update.
   * @param {Object} data - The data to update the matched document.
   * @throws {Error.DatabaseError} If there is an error during validation or database update.
   * @returns {Promise<Document>} A Promise that resolves to the updated document.
   */
  async updateOne(filter, data) {
    if (this.modelOptions.timestamp) {
      data.updatedAt = Date.now();
    }
    const updatedData = await this.adapter
      .collection(this.name)
      .updateOne(filter, data);
    return new Document(
      updatedData,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Updates multiple documents in the collection that match the filter.
   * @param {Object} filter - The filter criteria to find the documents to update.
   * @param {Object} data - The data to update the matched documents.
   * @throws {Error.DatabaseError} If there is an error during validation or database update.
   * @returns {Promise<Document>} A Promise that resolves to the updated documents.
   */
  async updateMany(filter, data) {
    if (this.modelOptions.timestamp) {
      data.updatedAt = Date.now();
    }
    const updatedData = await this.adapter
      .collection(this.name)
      .updateMany(filter, data);
    return new Document(
      updatedData,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Finds a single document in the collection that matches the filter and deletes it.
   * @param {Object} filter - The filter criteria to find the document to delete.
   * @throws {Error.DatabaseError} If there is an error during database deletion.
   * @returns {Promise<Document>} A Promise that resolves to the deleted document or null if not found.
   */
  async findOneAndDelete(filter) {
    const data = await this.adapter
      .collection(this.name)
      .findOneAndDelete(filter);
    return new Document(
      data,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Deletes a single document in the collection that matches the filter.
   * @param {Object} filter - The filter criteria to find the document to delete.
   * @throws {Error.DatabaseError} If there is an error during database deletion.
   * @returns {Promise<Document>} A Promise that resolves to the deleted document.
   */
  async deleteOne(filter) {
    const deletedData = await this.adapter
      .collection(this.name)
      .deleteOne(filter);
    return new Document(
      deletedData,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Deletes multiple documents in the collection that match the filter.
   * @param {Object} filter - The filter criteria to find the documents to delete.
   * @throws {Error.DatabaseError} If there is an error during database deletion.
   * @returns {Promise<Document>} A Promise that resolves to the deleted documents.
   */
  async deleteMany(filter) {
    const deletedData = await this.adapter
      .collection(this.name)
      .deleteMany(filter);
    return new Document(
      deletedData,
      this.schema,
      this.name,
      this.modelOptions,
      this.adapter
    );
  }

  /**
   * Counts the number of documents in the collection that match the filter.
   * @param {Object} filter - The filter criteria to count the documents.
   * @throws {Error.DatabaseError} If there is an error during database retrieval.
   * @returns {Promise<number>} A Promise that resolves to the count of matched documents.
   */
  async count(filter) {
    return await this.adapter.collection(this.name).count(filter);
  }

  /**
   * Drops the entire collection from the database.
   * @throws {Error.DatabaseError} If there is an error during database operation.
   * @returns {Promise<boolean>} A Promise that resolves to true if the collection is dropped successfully.
   */
  async drop() {
    return await this.adapter.collection(this.name).count();
  }

  /**
   * Deletes all documents in the collection, effectively truncating it.
   * @throws {Error.DatabaseError} If there is an error during database deletion.
   * @returns {Promise<boolean>} A Promise that resolves to true if the truncation is successful.
   */
  async truncate() {
    return await this.adapter.collection(this.name).truncate();
  }
}

module.exports = Model;
