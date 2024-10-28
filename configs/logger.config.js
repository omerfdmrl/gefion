const Storage = require("@gefion/storage");

module.exports = {
  level: "debug",
  transports: [
    {
      type: "console",
      options: {
        stderrLevels: ["error", "warning"],
      },
    },
    {
      type: "daily",
      options: {
        level: "error",
        filename: "%DATE%.log",
        dirname: Storage.storage("log"),
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      },
    },
  ],
};
