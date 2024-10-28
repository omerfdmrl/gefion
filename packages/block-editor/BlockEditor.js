const Package = require("@gefion/package");

module.exports = class BlockEditor extends Package {
  constructor() {
    super();
  }

  async init() {
    require("./hooks");
  }
};
