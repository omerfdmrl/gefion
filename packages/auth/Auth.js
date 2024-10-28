const Package = require("@gefion/package");
const Router = require("@gefion/router");
const Config = require("@gefion/config");
const Validations = require(__dirname + "/Validations");
const Controllers = require(__dirname + "/Controllers");
const Jobs = require("./Jobs");
const Middlewares = require(__dirname + "/Middlewares");
const passport = require("passport");

module.exports = class Auth extends Package {
  constructor() {
    super();
  }

  async init() {
    await this.config(__dirname + "/Configs/auth.config.js");

    this.middlewares(Middlewares);

    passport.use(require(__dirname + "/Configs/JwtStrategy.js"));

    this.jobs(Jobs);

    this.validations(Validations);

    this.controllers(Controllers);

    await Router.prefix(Config.get("auth.prefix"))
      .controller("Auth.")
      .validation("Auth.")
      .group(() => {
        this.routes(__dirname + "/routes.js");
      });
  }
};
