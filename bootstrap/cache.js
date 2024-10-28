/**
 * This file is responsible for caching the necessary providers.
 * This caches are using for the Plox.
 * @file This file is responsible for caching the necessary providers.
 * @module caching
 *
 */

const Cache = require("@gefion/cache").provider();
const Router = require("@gefion/router");
const Job = require("@gefion/job");

Cache.set("bootstrap/routes", Router.list().routes);
Cache.set("bootstrap/middlewares", Router.list().middlewares);
Cache.set("bootstrap/validations", Router.list().validations);
Cache.set("bootstrap/jobs", Job.list());
