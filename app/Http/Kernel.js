const HttpKernel = require("@gefion/http-kernel");
const Middlewares = require(__dirname + "/Middlewares");
const Validations = require(__dirname + "/Validations");
const Jobs = require("../Jobs");
const Controllers = require(__dirname + "/Controllers");

/**
 * Custom Kernel class for handling HTTP requests and managing middleware, validations, controllers, and routes.
 * @class
 * @extends HttpKernel
 * @example <caption>Load Middlewares</caption>
 * this.middlewares(require("./Middleware"))
 * @example <caption>Group Middlewares</caption>
 * this.middlewares({ web: ["date"] });
 * @example <caption>Load Controllers</caption>
 * this.controllers(require("./Controllers"));
 * @example <caption>Load Routes</caption>
 * this.routes("api"); // /routes/api.js
 * @example <caption>Load Routes With Methods</caption>
 * Router.middleware("web").prefix("dash").name("web-api-").group(() => { this.routes("api"); });
 */
module.exports = class Kernel extends HttpKernel {
  constructor() {
    super();
    this.init();
  }
  async init() {
    this.middlewares(Middlewares);

    this.middlewares({
      web: ["date"],
    });

    this.validations(Validations);

    this.jobs(Jobs);

    this.controllers(Controllers);

    this.routes("api");
  }
};
