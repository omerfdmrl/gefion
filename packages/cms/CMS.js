const Package = require("@gefion/package");
const Config = require("@gefion/config");
const Middlewares = require(__dirname + "/Middlewares");
const Models = require("./Models");

module.exports = class Permission extends Package {
  static User = Models.User;

  constructor() {
    super();
  }

  async init() {
    this.middlewares(Middlewares);

    await this.config(__dirname + "/Configs/cms.config.js");

    require("./hooks");
  }
};
