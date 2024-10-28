const Validator = require("@gefion/validator");
const Error = require("@gefion/error");

/**
 * Middleware function for request validation using a schema.
 * @param {Object} schema - The validation schema.
 * @returns {Function} - The middleware function.
 */
module.exports = (schema) => (req, res, next) => {
  const validate = Validator.validate(req, schema);
  if (validate.failed()) {
    throw Error.BadRequestError(validate.firstFail());
  }
  next();
};
