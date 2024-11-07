const mongoose = require("mongoose");
const Logger = require("@gefion/logger");
const Error = require("@gefion/error");
const DB = require("@gefion/db");

/**
 * Represents the Mongoose provider for GefionDb.
 * @class
 */
class DbMongoose {
  /**
   * Name of the provider.
   * @type {string}
   * @static
   */
  static provider = "mongoose";
  /** @private */
  static #collection = null;

  /**
   * Creates an instance of GefionDb.
   * @param {Object} config - The configuration object.
   * @param {string} config.url - The MongoDB connection URL.
   * @param {Object} config.options - The options to pass to the MongoDB driver.
   */
  static connect(config) {
    mongoose
      .connect(config.url, config.options)
      .then(() => {
        Logger.info("Connected to database");
      })
      .catch((error) => {
        throw new Error.DatabaseError(error);
      });
  }

  /**
   * Gets the collection by name.
   * @param {string} name - The name of the collection.
   * @returns {Promise<Collection>} A Promise that resolves to the GefionDb Collection.
   */
  static collection(name) {
    this.#collection = name;
    return this;
  }

  /**
   * Inserts a single document into the collection.
   * @param {Object} data - The data to be inserted.
   * @returns {Promise<InsertOneWriteOpResult<any>>} A Promise that resolves to the result of the insertion.
   */
  static async insertOne(filter) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .insertOne(filter);
  }

  /**
   * Finds documents in the collection that match the specified filter.
   * @param {Object} filter - The filter criteria.
   * @param {Object} options - The options for the query.
   * @returns {Promise<Array>} A Promise that resolves to an array of matched documents.
   */
  static async find(filter, options) {
    const pipeline = [
      { $match: filter },
      { $sort: { [options.sort]: 1 } || { _id: 1 } },
      { $skip: options.skip || 0 },
      { $limit: options.limit || 10 },
    ];
    if (options.select) {
      pipeline.push({
        $project: {
          ...(typeof options.select === "string"
            ? { [options.select]: 1 }
            : options.select.split(" ").reduce(
                (acc, field) => {
                  acc[field] = 1;
                  return acc;
                },
                { _id: 0 }
              )),
        },
      });
    } else {
      pipeline.push({
        $project: { _id: 0 },
      });
    }
    if (options.populate) {
      pipeline.push({
        $lookup: {
          from: options.populate.from,
          localField: options.populate.localField,
          foreignField: "id",
          as: options.populate.as,
          pipeline: options.populate.select
            ? [
                {
                  $project: {
                    ...(typeof options.populate.select === "string"
                      ? { [options.populate.select]: 1 }
                      : options.populate.select
                          .split(" ")
                          .reduce((acc, field) => {
                            acc[field] = 1;
                            return acc;
                          }, {})),
                    _id: 0,
                  },
                },
              ]
            : undefined,
        },
      });
      pipeline.push({
        $unwind: {
          path: `$${options.populate.as}`,
          preserveNullAndEmptyArrays: true,
        },
      });
    }
    return await mongoose.connection.db
      .collection(this.#collection)
      .aggregate(pipeline)
      .toArray();
  }

  /**
   * Finds a single document in the collection that matches the specified filter.
   * @param {Object} filter - The filter criteria.
   * @param {Object} options - The options for the query.
   * @returns {Promise<Object>} A Promise that resolves to the matched document or null if not found.
   */
  static async findOne(filter, options) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .findOne(filter, options);
  }

  /**
   * Finds a single document in the collection that matches the filter and updates it.
   * @param {Object} filter - The filter criteria to find the document to update.
   * @param {Object} data - The data to update the matched document.
   * @returns {Promise<Object>} A Promise that resolves to the updated document or null if not found.
   */
  static async findOneAndUpdate(filter, data) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .findOneAndUpdate(filter, { $set: data });
  }

  /**
   * Updates a single document in the collection that matches the filter.
   * @param {Object} filter - The filter criteria to find the document to update.
   * @param {Object} data - The data to update the matched document.
   * @returns {Promise<UpdateWriteOpResult>} A Promise that resolves to the result of the update operation.
   */
  static async updateOne(filter, data) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .updateOne(filter, data);
  }

  /**
   * Updates multiple documents in the collection that match the filter.
   * @param {Object} filter - The filter criteria to find the documents to update.
   * @param {Object} data - The data to update the matched documents.
   * @returns {Promise<UpdateWriteOpResult>} A Promise that resolves to the result of the update operation.
   */
  static async updateMany(filter, data) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .updateMany(filter, data);
  }

  /**
   * Finds a single document in the collection that matches the filter and replaces it with new data.
   * @param {Object} filter - The filter criteria to find the document to replace.
   * @param {Object} data - The data to replace the matched document.
   * @returns {Promise<Object>} A Promise that resolves to the replaced document or null if not found.
   */
  static async findOneAndReplace(filter, data) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .findOneAndReplace(filter, data);
  }

  /**
   * Replaces a single document in the collection that matches the filter with new data.
   * @param {Object} filter - The filter criteria to find the document to replace.
   * @param {Object} data - The data to replace the matched document.
   * @returns {Promise<ReplaceWriteOpResult>} A Promise that resolves to the result of the replace operation.
   */
  static async replaceOne(filter, data) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .replaceOne(filter, data);
  }

  /**
   * Finds a single document in the collection that matches the filter and deletes it.
   * @param {Object} filter - The filter criteria to find the document to delete.
   * @returns {Promise<Object>} A Promise that resolves to the deleted document or null if not found.
   */
  static async findOneAndDelete(filter) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .findOneAndDelete(filter);
  }

  /**
   * Deletes a single document in the collection that matches the filter.
   * @param {Object} filter - The filter criteria to find the document to delete.
   * @returns {Promise<DeleteWriteOpResultObject>} A Promise that resolves to the result of the delete operation.
   */
  static async deleteOne(filter) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .deleteOne(filter);
  }

  /**
   * Deletes multiple documents in the collection that match the filter.
   * @param {Object} filter - The filter criteria to find the documents to delete.
   * @returns {Promise<DeleteWriteOpResultObject>} A Promise that resolves to the result of the delete operation.
   */
  static async deleteMany(filter) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .deleteMany(filter);
  }

  /**
   * Counts the number of documents in the collection that match the filter.
   * @param {Object} filter - The filter criteria to count the documents.
   * @returns {Promise<number>} A Promise that resolves to the count of matched documents.
   */
  static async count(filter) {
    return await mongoose.connection.db
      .collection(this.#collection)
      .countDocuments(filter);
  }

  /**
   * Drops the collection.
   * @returns {Promise<boolean>} A Promise that resolves to true if the collection is dropped successfully.
   */
  static async drop() {
    return await mongoose.connection.db.collection(this.#collection).drop();
  }

  /**
   * Truncates (deletes all documents) the collection.
   * @returns {Promise<DeleteWriteOpResultObject>} A Promise that resolves to the result of the delete operation.
   */
  static async truncate() {
    return await mongoose.connection.db
      .collection(this.#collection)
      .deleteMany({});
  }
}

DB.register(DbMongoose);
