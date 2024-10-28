const Validator = require("@gefion/validator");
const Error = require("@gefion/error");
const Model = require("./Model");

/**
 * Represents a schema definition for GefionDb.
 * @class
 */
module.exports = class Schema {
  /**
   * The methods attached to the schema.
   * @type {Object}
   */
  methods = {};
  /**
   * The statics attached to the schema.
   * @type {Object}
   */
  statics = {};
  /**
   * The pre hooks attached to the schema.
   * @type {Object}
   */
  pre = {};
  /** @private */
  #types = [String, Boolean, Number, Array, Object, Date, "model", Model];

  /**
   * Creates an instance of Schema.
   * @param {Object} schema - The raw schema definition.
   */
  constructor(schema) {
    this.schema = this.#parse(schema);
  }

  /**
   * Parses the raw schema definition and converts it into a standardized format.
   * @private
   * @param {Object} schema - The raw schema definition.
   * @throws {Error.DatabaseError} If an invalid type is encountered in the schema.
   * @returns {Object} The parsed schema.
   */
  #parse(schema) {
    const parsedSchema = {};
    Object.keys(schema).forEach((key) => {
      const value = schema[key];
      if (
        ((Validator.function(value) && !this.#types.includes(value)) ||
          (Validator.function(value.type) &&
            !this.#types.includes(value.type) &&
            String(value.type.constructor.name) != "Model") ||
          (!Validator.function(value) &&
            (Array.isArray(value.type)
              ? !value.type.every((t) => this.#types.includes(t))
              : !this.#types.includes(value.type) &&
                String(value.type.constructor.name) != "Model"))) &&
        !Array.isArray(value)
      ) {
        throw new Error.DatabaseError("Invalid Type");
      }
      if (Validator.function(value)) {
        parsedSchema[key] = {
          type: value,
          required: false,
          default: undefined,
          validate: "",
        };
      } else {
        parsedSchema[key] = {
          type: value.type,
          required: value.required !== undefined ? value.required : false,
          default: value.default !== undefined ? value.default : false,
          unique: value.unique !== undefined ? value.unique : false,
        };
        if (Validator.array(value)) {
          parsedSchema[key].type = Array;
          parsedSchema[key].itemType = value[0];
          parsedSchema[key].enum = [];
        }

        if (Validator.array(value.type)) {
          parsedSchema[key].type = Array;
          parsedSchema[key].itemType = value.type[0];
          parsedSchema[key].enum = value.enum || [];
        }

        if (value.type === "model") {
          parsedSchema[key].ref = value.ref;
        }

        if (String(value.type.constructor.name) === "Model") {
          parsedSchema[key].type = "model";
          parsedSchema[key].ref = value.type.name;
        }

        parsedSchema[key].validate = this.#getValidation(
          value.validate,
          parsedSchema[key]
        );
      }
    });
    return parsedSchema;
  }

  /**
   * Gets the validation rule based on the type, required, and custom validation.
   * @private
   * @param {string} validate - The custom validation rule.
   * @param {Object} schema - Schema for get validation rules.
   * @returns {string} The combined validation rule.
   */
  #getValidation(validate, schema) {
    var result =
      typeof schema.type === "string"
        ? schema.type
        : schema.type.name.toLowerCase();
    if (schema.type === Array) {
      result +=
        ":" +
        (typeof schema.itemType === "string"
          ? schema.itemType
          : schema.itemType.name.toLowerCase());
      result += "|in:" + schema.enum.join(",");
    }
    result += "|";
    if (schema.required) result += "required|";
    if (schema.lowercase) result += "lowercase|";
    if (schema.uppercase) result += "uppercase|";

    return result + (validate ? validate : "");
  }

  /**
   * Validates the provided data against the schema.
   * @param {Object} data - The data to validate.
   * @param {Object} schema - The schema definition to validate against.
   * @param {Object} document - The document to validate on database.
   * @returns {Object} An object containing the validation result and any encountered errors.
   */
  async validate(data, schema, document) {
    if (!schema) schema = this.schema;
    var errors = [];
    var result = {};
    const setResult = (key, value) => {
      result = Object.assign({}, result, { [key]: value });
    };
    for await (const key of Object.keys(schema)) {
      let hasError = false;
      const value = data[key];
      const schemaItem = schema[key];

      if (
        Validator.object(schemaItem) &&
        !Validator.required(schemaItem.type)
      ) {
        const validated = this.validate(value, schemaItem);
        if (validated.errors.length) {
          errors = errors.push(...validated.errors);
          hasError = true;
        }
        setResult(key, validated.result);
      } else {
        const validated = Validator.validate(
          {
            [key]: value,
          },
          {
            [key]: schemaItem.validate,
          }
        );

        if (validated.failed()) {
          errors = errors.concat(Object.values(validated.fails()));
          hasError = true;
        }
        if (schemaItem.type == "model") {
          const isExists = await Validator.model(value, schemaItem.ref);
          if (!isExists) {
            errors.push(Validator.getFailMessage(key, "model"));
            setResult(key, Validator.getFailMessage(key, "model"));
            hasError = true;
          }
        }
        if (schemaItem.unique && document.isModified(key)) {
          const isUnique = await Validator.unique(value, document._modelName);
          if (!isUnique) {
            errors.push(Validator.getFailMessage(key, "unique"));
            setResult(key, Validator.getFailMessage(key, "unique"));
            hasError = true;
          }
        }
      }
      if (!hasError && schemaItem.default && value === undefined) {
        setResult(key, schemaItem.default);
      } else if (!hasError && value) {
        setResult(key, value);
      }
    }
    return { errors, result };
  }

  /**
   * Adds additional fields to the schema.
   * @param {Object} schema - The additional schema definition to add.
   */
  add(schema) {
    const parsed = this.#parse(schema);
    Object.assign(this.schema, parsed);
  }

  /**
   * Adds a plugin to the schema.
   * @param {function} PluginFunc - The plugin function to apply to the schema.
   */
  plugin(PluginFunc) {
    PluginFunc(this);
  }
};
