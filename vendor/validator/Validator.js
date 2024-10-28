const Config = require("@gefion/config");

/**
 * Represents a utility class for validating data based on defined rules for Gefion.
 * @class
 */
module.exports = class Validator {
  /** @private */
  static #messages =
    Config.get("validator") && Object.keys(Config.get("validator")).length
      ? Config.get("validator.messages")
      : {};
  /** @private */
  static #defaultMessages = {
    required: ":attribute field is required.",
    array: ":attribute field must be an array.",
    string: ":attribute field must be a string.",
    numeric: ":attribute field must be a number.",
    integer: ":attribute field must be an integer.",
    object: ":attribute field must be an object.",
    boolean: ":attribute field must be an boolean.",
    function: ":attribute field must be an function.",
    min: ":attribute field must be at least :value characters.",
    max: ":attribute field must be at most :value characters.",
    email: ":attribute field must be a valid email address.",
    in: ":attribute field must be one of the following values: :value.",
    lowercase: ":attribute field must consist of lowercase letters.",
    uppercase: ":attribute field must consist of uppercase letters.",
    match: ":attribute field did not match the rules.",
    model: ":attribute field was not found in the database.",
    unique: ":attribute field is already registered",
  };

  /** @private */
  static #errors = {
    obstruct: {},
    arbitrary: {},
  };
  /** @private */
  static #data = {};
  /** @private */
  static #rules = {};
  /** @private */
  static #validationFunctions = [
    "required",
    "array",
    "string",
    "numeric",
    "integer",
    "object",
    "boolean",
    "function",
    "min",
    "max",
    "email",
    "in",
    "lowercase",
    "uppercase",
    "match",
  ];
  /**
   * Validates the given data based on the defined rules.
   * @param {object} data - The data to be validated.
   * @param {object} rules - The validation rules to apply to the data.
   * @returns {Validator} - A Validator instance with validation results.
   */
  static validate(data, rules) {
    this.#data = typeof rules === "string" ? { key: data } : data;
    this.#rules = typeof rules === "string" ? { key: rules } : rules;
    this.#errors = {
      obstruct: {},
      arbitrary: {},
    };
    this.#validateRecursive(this.#data, this.#rules);
    return this;
  }

  /**
   * Recursively validates nested data based on the defined rules.
   * @private
   * @param {object} data - The data to be validated.
   * @param {object} rules - The validation rules to apply to the data.
   * @param {string} parentKey - The parent key for nested data.
   */
  static #validateRecursive(data, rules, parentKey = "") {
    for (const field in rules) {
      const key = parentKey ? `${parentKey}.${field}` : field;
      if (
        this.required(rules[field]) &&
        this.object(rules[field]) &&
        this.object(data[field])
      ) {
        this.#validateRecursive(data[field], rules[field], key);
      } else {
        const fieldRules = rules[field].split("|");
        for (const rule of fieldRules) {
          const [ruleName, ruleValue] = rule.split(":");
          if (!this.#validationFunctions.includes(ruleName)) {
            // this.#addError("_system", "error", "Method not exists", false);
          } else if (
            rule &&
            ruleName &&
            !this[ruleName](data[field], ruleValue)
          ) {
            this.#addError(
              key,
              ruleName,
              ruleValue,
              fieldRules.includes("required")
            );
            break;
          }
        }
      }
    }
  }

  /**
   * Adds an error message for a specific field and validation rule.
   * @private
   * @param {string} field - The field/key name where the error occurred.
   * @param {string} ruleName - The name of the validation rule that failed.
   * @param {string} ruleValue - The value associated with the validation rule (optional).
   */
  static #addError(field, ruleName, ruleValue, obstruct) {
    if (!this.#errors[obstruct ? "obstruct" : "arbitrary"][field]) {
      this.#errors[obstruct ? "obstruct" : "arbitrary"][field] = [];
    }

    const message = this.#getMessage(field, ruleName, ruleValue);
    this.#errors[obstruct ? "obstruct" : "arbitrary"][field].push(message);
  }

  /**
   * Retrieves the error message for a specific field and validation rule.
   * @private
   * @param {string} field - The field/key name where the error occurred.
   * @param {string} ruleName - The name of the validation rule that failed.
   * @param {string} ruleValue - The value associated with the validation rule (optional).
   * @returns {string} - The error message.
   */
  static #getMessage(field, ruleName, ruleValue) {
    if (this.#messages[field]) {
      return this.#messages[field];
    }

    const defaultMessage =
      this.#defaultMessages[ruleName] || `${field} value should be validated.`;
    let message = defaultMessage.replace(":attribute", field);
    if (ruleValue) {
      message = message.replace(":value", ruleValue);
    }

    return message;
  }

  /**
   * Checks if a field is required.
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is required.
   */
  static required(field) {
    return (
      field !== undefined &&
      field !== "" &&
      field !== false &&
      (this.object(field) ? Object.keys(field).length > 0 : true)
    );
  }

  /**
   * Checks if a field is an array.
   * @param {*} field - The field value.
   * @param {string} value - The type of array items.
   * @returns {boolean} - Indicates if the field is an array.
   */
  static array(field, value) {
    return (
      Array.isArray(field) &&
      (value ? field.every((i) => typeof i === value) : true)
    );
  }

  /**
   * Checks if a field is a string.
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is a string.
   */
  static string(field) {
    return typeof field === "string";
  }

  /**
   * Checks if a field is numeric.
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is numeric.
   */
  static numeric(field) {
    if (typeof field === "number") return true;
    if (typeof field !== "string") return false;
    return !isNaN(field) && !isNaN(parseFloat(field));
  }

  /**
   * Checks if a field is an integer.
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is an integer.
   */
  static integer(field) {
    return Number.isInteger(field);
  }

  /**
   * Checks if a field is an object.
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is an object.
   */
  static object(field) {
    return typeof field === "object";
  }

  /**
   * Checks if a field is an boolean.
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is an boolean.
   */
  static boolean(field) {
    return typeof field === "boolean";
  }

  /**
   * Checks if a field is an function.
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is an boolean.
   */
  static function(field) {
    return typeof field === "function";
  }

  /**
   * Checks if a field meets the minimum length requirement.
   * @param {*} field - The field value.
   * @param {string} value - The minimum length value.
   * @returns {boolean} - Indicates if the field meets the minimum length requirement.
   */
  static min(field, value) {
    const fieldValue = field;

    if (this.string(fieldValue)) {
      return fieldValue.length >= parseInt(value, 10);
    }

    if (this.numeric(fieldValue)) {
      return fieldValue >= parseInt(value, 10);
    }

    return false;
  }

  /**
   * Checks if a field meets the maximum length requirement.
   * @param {*} field - The field value.
   * @param {string} value - The maximum length value.
   * @returns {boolean} - Indicates if the field meets the maximum length requirement.
   */
  static max(field, value) {
    const fieldValue = field;

    if (this.string(fieldValue)) {
      return fieldValue.length <= parseInt(value, 10);
    }

    if (this.numeric(fieldValue)) {
      return fieldValue <= parseInt(value, 10);
    }

    return false;
  }

  /**
   * Checks if a field is a valid email address.
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is a valid email address.
   */
  static email(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(field);
  }

  /**
   * Checks if a field is one of the specified values.
   * @param {*} field - The field value.
   * @param {string} value - The comma-separated list of allowed values.
   * @returns {boolean} - Indicates if the field is one of the allowed values.
   */
  static in(field, value) {
    return value.split(",").includes(field);
  }

  /**
   * Checks if a field is lowercase
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is one of the allowed values.
   */
  static lowercase(field) {
    return field == field.toLowerCase();
  }

  /**
   * Checks if a field is uppercase
   * @param {*} field - The field value.
   * @returns {boolean} - Indicates if the field is one of the allowed values.
   */
  static uppercase(field) {
    return field == field.toUpperCase();
  }

  /**
   * Checks if a field is matching with regex expression.
   * @param {*} field - The field value.
   * @param {string} value - The comma-separated list of allowed values.
   * @returns {boolean} - Indicates if the field is one of the allowed values.
   */
  static match(field, value) {
    const regexPattern =
      /^\/(.+)\/(i|g|m|ig|im|gi|gm|mg|igm|img|gmi|mgi|gim|mig)$/;

    if (typeof value === "string") {
      const matchResult = value.match(regexPattern);
      if (matchResult) {
        const [, pattern, flags] = matchResult;
        return new RegExp(pattern, flags).test(field);
      } else {
        return new RegExp(value).test(field);
      }
    } else if (value instanceof RegExp) {
      return value.test(field);
    }
    return false;
  }

  /**
   * Checks if a field is matching with database records
   * @param {*} field - The field value.
   * @param {string} value - The name of model.
   * @returns {boolean} - Indicates if the field is one of the allowed values.
   */
  static async model(field, value) {
    const count = await model(value).count({ id: field });
    return count > 0;
  }

  /**
   * Checks if a field is inuqiue in database records
   * @param {*} field - The field value.
   * @param {string} value - The name of model.
   * @returns {boolean} - Indicates if the field is one of the allowed values.
   */
  static async unique(field, value) {
    const count = await model(value).count({ id: field });
    return count !== 0;
  }

  /**
   * Checks if any validation errors occurred.
   * @returns {boolean} - Indicates if any validation errors occurred.
   */
  static failed() {
    return Object.keys(this.#errors.obstruct).length !== 0;
  }

  /**
   * Retrieves the validation errors.
   * @returns {object} - The validation errors.
   */
  static fails() {
    return Object.assign(this.#errors.arbitrary, this.#errors.obstruct);
  }

  /**
   * Retrieves the first validation error message.
   * @returns {string|null} - The first validation error message, or null if no errors occurred.
   */
  static firstFail() {
    return Object.values(this.#errors.obstruct)[0] || null;
  }

  /**
   * Retrieves the error message for a specific field and validation rule.
   * @private
   * @param {string} field - The field/key name where the error occurred.
   * @param {string} ruleName - The name of the validation rule that failed.
   * @returns {string} - The error message.
   */
  static getFailMessage(field, ruleName) {
    return this.#getMessage(field, ruleName);
  }
};
