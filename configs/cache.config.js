const Storage = require("@gefion/storage");

module.exports = {
  provider: "local1",
  local1: {
    provider: "local",
    path: Storage.storage("cache"),
    filePerKey: "true",
    ttl: 3600,
  },
  mqlocal2: {
    provider: "local",
    path: "/home/omer/Desktop/Gefion2/storage/mq/",
    filePerKey: true,
  },
};
