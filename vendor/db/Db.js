const Config = require("@gefion/config");
const Validator = require("@gefion/validator");
const Error = require("@gefion/error");
const Model = require("./core/Model");
const Schema = require("./core/Schema");

/**
 * Represents a database manager for Gefion.
 * @class
 */
module.exports = class Db {
  static #providers = {};
  static #factories = {};
  static Model = Model;
  static Schema = Schema;

  constructor() {
    const providers = Config.get("database.provider");
    if (Validator.array(providers)) {
      providers.forEach((provider) => {
        const providerConfig = Config.get("database." + provider);
        const Class = Db.provider(provider);
        Class.connect(providerConfig);
      });
    } else {
      const providerConfig = Config.get(
        "database." + Config.get("database.provider")
      );
      const Class = Db.provider();
      Class.connect(providerConfig);
    }
  }

  /**
   * Get the database provider based on the configuration.
   *
   * @returns {Class} The database provider class.
   */
  static provider(provider) {
    var validProvider = null;
    const providers = Config.get("database.provider");
    if (Validator.array(providers) && !provider) {
      validProvider = providers[0];
    } else if (provider) {
      validProvider = provider;
    } else if (!Array.isArray(providers) && !provider) {
      validProvider = providers;
    }
    const providerConfig = Config.get("database." + validProvider);

    const validate = Validator.validate(
      providerConfig.provider,
      "in:" + Object.keys(Db.#providers).join()
    );
    if (validate.failed()) Error.ServerError(validate.firstFail());

    return Db.#providers[providerConfig.provider];
  }

  /**
   * Register a factory for creating instances of a specific model.
   *
   * @param {Class} Class - The factory class.
   */
  static factory(Class) {
    this.#factories[Class.model] = Class.definition;
  }

  /**
   * Seed the specified model with the given number of records.
   *
   * @param {string} model - The name of the model to seed.
   * @param {number} count - The number of records to generate.
   */
  static async seeder(seederModel, count) {
    const SeederModel = require(Storage.app("Models"))[seederModel];
    const factory = this.#factories[seederModel];
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(await factory());
    }
    await SeederModel.insertMany(data);
  }

  /**
   * Register a database provider class.
   *
   * @param {object} Class - The database provider class.
   */
  static register(Class) {
    this.#providers[Class.provider] = Class;
  }

  /**
   * Get registered model instance
   *
   * @param {String} model - Name of model
   * @returns {Model} The model object
   */
  static model(model) {
    return Model.model(model);
  }
};
