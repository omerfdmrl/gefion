/**
 * Middleware helper function to catch and handle errors in asynchronous routes.
 * @param {Function} fn - The asynchronous route handler or middleware function to be wrapped.
 * @returns {Function} - A new middleware function that catches errors and forwards them to the next middleware.
 */
const catchError = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    res
      .status(err.statusCode || 404)
      .send(err.message.split(":").slice(1).join(" "));
  });
};

module.exports = catchError;
