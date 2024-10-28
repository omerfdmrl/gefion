const Config = require("@gefion/config");
const Error = require("@gefion/error");

module.exports = (permission) => (req, res) => {
  const permissions = Config.get("permission." + req.user);
  if (!permissions) throw new Error.UnauthorizedError("Please authenticate");
  if (!permissions.includes(permission))
    throw new Error.UnauthorizedAccessError("Forbidden");

  next();
};
