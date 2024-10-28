const Package = require("@gefion/package");
const Router = require("@gefion/router");
const Config = require("@gefion/config");
const Validations = require(__dirname + "/Validations");
const Controllers = require(__dirname + "/Controllers");
const plox = require(__dirname + "/Configs/plox.js");
const Plox = require("@gefion/plox");
const ViewMaker = require("./Helpers/ViewMaker");
const DataMaker = require("./Helpers/DataMaker");
const findFieldFromSchema = require("./Helpers/findFieldFromSchema");

module.exports = class Admin extends Package {
  static ViewMaker = ViewMaker;
  static DataMaker = DataMaker;
  static findFieldFromSchema = findFieldFromSchema;

  constructor() {
    super();
  }

  async init() {
    await this.config(__dirname + "/Configs/admin.config.js");

    require("./hooks");

    this.validations(Validations);

    this.controllers(Controllers);

    Plox.add("admin:add", plox.addUser);

    Router.static("/admin", __dirname + "/views/dist/");

    await Router.prefix("/admin")
      .middleware("auth")
      .controller("Admin.")
      .group(() => {
        this.routes(__dirname + "/routes.js");
      });

    Router.get(Config.get("admin.prefix") + "*", (req, res) => {
      res.sendFile(__dirname + "/views/dist/index.html");
    });
  }
};
