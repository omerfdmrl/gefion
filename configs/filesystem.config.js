const Storage = require("@gefion/storage");

module.exports = {
  provider: "local",

  local: {
    driver: "local",
    path: Storage.storage("app"),
    visibility: true,
    link: "public/",
  },

  public: {
    driver: "local",
    path: Storage.storage("public"),
    visibility: true,
    link: "publicas",
  },

  s3: {
    driver: "s3",
    key: "",
    secret: "",
    region: "",
    bucket: "",
    url: "",
    endpoint: "",
  },

  gdriver: {
    driver: "gdriver",
    id: "",
    secret: "",
    redirect: "",
    refresh: "",
  },

  ftp: {
    driver: "ftp",
    host: "host",
    port: 21,
    user: "username",
    password: "password",
  },

  sftp: {
    driver: "sftp",
    host: "host",
    port: 21,
    user: "username",
    password: "password",
  },
};
