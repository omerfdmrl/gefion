const DB = require("@gefion/db");
const tokenTypes = require("../Configs/tokenTypes");
const Config = require("@gefion/config");

const tokenSchema = new DB.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: "model",
      ref: Config.get("auth.userCollection", "User"),
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Token
 */
const Token = new DB.Model(
  Config.get("auth.tokenCollection", "Token"),
  tokenSchema
);

module.exports = Token;
