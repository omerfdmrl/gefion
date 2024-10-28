const Config = require("@gefion/config");

module.exports.User =
  model(Config.get("user.userCollection")) || require("./User");

module.exports.Post =
  model(Config.get("user.postCollection")) || require("./Post");
