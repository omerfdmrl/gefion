const Package = require("@gefion/package");
const Config = require("@gefion/config");
const Utils = require(__dirname + "/Utils");
const Middlewares = require(__dirname + "/Middlewares");

module.exports = class Permission extends Package {
  constructor() {
    super();
  }

  async init() {
    this.middlewares(Middlewares);

    await this.config(__dirname + "/Configs/permission.config.js");

    require("./hooks");
  }

  static plugin(schema) {
    return Utils.plugin(schema, Config.get("permission"));
  }
};
