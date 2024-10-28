/**
 * This file defines and provides access to various modules and functions that serve different purposes in a larger application or system.
 * @file JavaScript file containing global functions and module imports.
 * @module initialization
 *
 */

const Router = require("@gefion/router");
const Storage = require("@gefion/storage");
const Logger = require("@gefion/logger");
const Config = require("@gefion/config");
const Cache = require("@gefion/cache");
const Server = require("@gefion/server");
const Validator = require("@gefion/validator");
const Mq = require("@gefion/mq");
const Worker = require("@gefion/worker");
const Faker = require("@faker-js/faker");
const Job = require("@gefion/job");
const Hook = require("@gefion/hook");
const Db = require("@gefion/db");

/**
 * Get the router module.
 * @global
 * @returns {Router} The Router provider.
 */
global.router = () => {
  return Router;
};

/**
 * Generate a URL route using the Router module.
 * @global
 * @param {string} name - The name of the route.
 * @param {Object} data - The data object used for route parameters.
 * @returns {string} The generated URL route.
 */
global.route = (name, data) => {
  return Router.generate(name, data);
};

/**
 * Get the resource path using the Storage module.
 * @global
 * @param {string} path - The path to the resource.
 * @returns {string} The full resource path.
 */
global.resource = (path) => {
  return Storage.resource(path);
};

/**
 * Get the storage path using the Storage module.
 * @global
 * @param {string} path - The path to the storage.
 * @returns {string} The full storage path.
 */
global.storage = (path) => {
  return Storage.storage(path);
};

/**
 * Get the Config module.
 * @global
 * @returns {Object} The Config module.
 */
global.config = () => {
  return Config;
};

/**
 * Get the Server provider.
 * @global
 * @returns {Object} The Server provider.
 */
global.server = () => {
  return Server.provider();
};

/**
 * Get the Cache provider.
 * @global
 * @returns {Object} The Cache provider.
 */
global.cache = () => {
  return Cache.provider();
};

/**
 * Get the Logger module.
 * @global
 * @returns {Object} The Logger module.
 */
global.logger = () => {
  return Logger;
};

/**
 * Get the Validator module.
 * @global
 * @returns {Object} The Validator module.
 */
global.validator = () => {
  return Validator;
};

/**
 * Get the Mq provider.
 * @global
 * @returns {Object} The Mq provider.
 */
global.mq = () => {
  return Mq.provider();
};

/**
 * Create a new job instance.
 * @global
 * @param {string} name - The name of the job.
 * @param {...*} args - Arguments to pass to the job constructor.
 * @returns {Object|boolean} The job instance if it exists, or false otherwise.
 */
global.job = (name, ...args) => {
  return Job.do(name, ...args);
};

/**
 * Get registered model instance
 * @global
 * @param {String} model - Name of model
 * @returns {Model} The model object
 */
global.model = (name) => {
  return Db.model(name);
};

/**
 * Get the path of a worker script.
 * @global
 * @param {string} name - The name of the worker script.
 * @returns {string} The path of the worker script.
 */
global.worker = (name) => {
  return Worker.path(Storage.app(`Workers/${name}.js`));
};

/**
 * Get the Faker module.
 * @global
 * @returns {Object} The Faker module.
 */
global.fake = () => {
  return Faker.faker;
};

/**
 * Get the Hook module.
 * @global
 * @returns {Object} The Faker module.
 */
global.hooks = () => {
  return Hook;
};
