const DB = require("@gefion/db");

/**
 * This class is responsible for providing database functionality and connect the application to database
 * @class
 * @extends DB
 */
module.exports = class DatabaseProvider extends DB {
  constructor() {
    super();
  }
};
