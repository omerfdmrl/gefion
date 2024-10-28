const winston = require("winston");
const Config = require("@gefion/config");
require("winston-daily-rotate-file");

const transports = [];
const loggerConfig = Config.get("logger");

for (let transportConfig of loggerConfig.transports) {
  switch (transportConfig.type) {
    case "console":
      transports.push(new winston.transports.Console(transportConfig.options));
      break;

    case "daily":
      transports.push(
        new winston.transports.DailyRotateFile(transportConfig.options)
      );
      break;
    case "http":
      transports.push(new winston.transports.Http(transportConfig.options));
      break;
    case "file":
      transports.push(new winston.transports.File(transportConfig.options));
      break;
    case "stream":
      transports.push(new winston.transports.Stream(transportConfig.options));
      break;
    default:
      break;
  }
}

/**
 * Custom format to enumerate error objects.
 * @param {Object} info - The log information.
 * @returns {Object} - The formatted log information.
 */
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: loggerConfig.level,
  format: winston.format.combine(
    enumerateErrorFormat(),
    // loggerConfig.level === "development"
    //   ? winston.format.colorize()
    //   : winston.format.uncolorize(),
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    winston.format.splat(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `\x1b[90m[${timestamp}] ${level}: ${message}`
    )
  ),
  transports,
});

module.exports = logger;
