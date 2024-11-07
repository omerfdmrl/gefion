const Package = require("@gefion/package");
const Config = require("@gefion/config");
const Middlewares = require(__dirname + "/Middlewares");
const Models = require("./Models");
const Error = require("@gefion/error");

module.exports = class Permission extends Package {
  static User = Models.User;

  constructor() {
    super();
  }

  async init() {
    this.middlewares(Middlewares);

    await this.config(__dirname + "/Configs/cms.config.js");

    const data = Config.get("permission");
    if (!data[Config.get("cms.adminRole")])
      throw new Error.ConfigurationError("Admin role not configured");

    require("./hooks");
  }
};
