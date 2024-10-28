/**
 * Base class for all custom errors.
 * @class
 * @extends Error
 */
class BaseError extends Error {
  /**
   * Creates an instance of BaseError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code.
   * @param {string} defaultMessage - The default error message.
   */
  constructor(message, statusCode, defaultMessage) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.message = message ? `${defaultMessage}: ${message}` : defaultMessage;
  }
}

/**
 * Error for Bad Request (400).
 * @class
 * @extends BaseError
 */
class BadRequestError extends BaseError {
  /**
   * Creates an instance of BadRequestError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 400, "Bad Request");
  }
}

/**
 * Error for Unauthorized access (401).
 * @class
 * @extends BaseError
 */
class UnauthorizedError extends BaseError {
  /**
   * Creates an instance of UnauthorizedError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 401, "Unauthorized");
  }
}

/**
 * Error for Not Found (404).
 * @class
 * @extends BaseError
 */
class NotFoundError extends BaseError {
  /**
   * Creates an instance of NotFoundError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 404, "Not Found");
  }
}

/**
 * Error for Internal Server Error (500).
 * @class
 * @extends BaseError
 */
class InternalServerError extends BaseError {
  /**
   * Creates an instance of InternalServerError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 500, "Internal Server Error");
  }
}

/**
 * Error for validation failures.
 * @class
 * @extends BaseError
 */
class ValidationError extends BaseError {
  /**
   * Creates an instance of ValidationError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 422, "Validation Error");
  }
}

/**
 * Error for Unauthorized Access (401).
 * @class
 * @extends BaseError
 */
class UnauthorizedAccessError extends BaseError {
  /**
   * Creates an instance of UnauthorizedAccessError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 401, "Unauthorized Access");
  }
}

/**
 * Error for Database failures.
 * @class
 * @extends BaseError
 */
class DatabaseError extends BaseError {
  /**
   * Creates an instance of DatabaseError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 500, "Database Error");
  }
}

/**
 * Error for External Service failures.
 * @class
 * @extends BaseError
 */
class ExternalServiceError extends BaseError {
  /**
   * Creates an instance of ExternalServiceError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 503, "External Service Error");
  }
}

/**
 * Error for Configuration failures.
 * @class
 * @extends BaseError
 */
class ConfigurationError extends BaseError {
  /**
   * Creates an instance of ConfigurationError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 500, "Configuration Error");
  }
}

/**
 * Error for generic Server errors (500).
 * @class
 * @extends BaseError
 */
class ServerError extends BaseError {
  /**
   * Creates an instance of ServerError.
   * @param {string} [message=""] - The error message.
   */
  constructor(message = "") {
    super(message, 500, "Server Error");
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  ValidationError,
  UnauthorizedAccessError,
  DatabaseError,
  ExternalServiceError,
  ConfigurationError,
  ServerError,
  /**
   * Registers a custom error class dynamically.
   * @param {Function} Class - The custom error class to register.
   */
  register(Class) {
    this[Class.name] = Class;
  },
};
