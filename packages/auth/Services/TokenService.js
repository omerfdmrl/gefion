const jwt = require("jsonwebtoken");
const userService = require("./UserService");
const { Token } = require("../Models");
const Error = require("@gefion/error");
const tokenTypes = require("../Configs/tokenTypes");
const Config = require("@gefion/config");

function addMinutes(date, minutes) {
  const newDate = new Date(date);
  return new Date(newDate.getTime() + minutes * 60000);
}

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Date} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  userId,
  expires,
  type,
  secret = Config.get("auth.jwtSecret")
) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: new Date(expires).getTime(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Date} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.insert({
    token,
    user: userId,
    expires: new Date(expires).toJSON(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, Config.get("auth.jwtSecret"));
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = addMinutes(
    new Date(),
    Config.get("auth.accessExpirationMinutes", 30)
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = addDays(
    new Date(),
    Config.get("auth.refreshExpirationDays", 30)
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: new Date(accessTokenExpires).toJSON(),
    },
    refresh: {
      token: refreshToken,
      expires: new Date(refreshTokenExpires).toJSON(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error.NotFoundError("No users found with this email");
  }
  const expires = addMinutes(
    new Date(),
    Config.get("auth.resetPasswordExpirationMinutes", 60)
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = addMinutes(
    new Date(),
    Config.get("auth.verifyEmailExpirationMinutes", 60)
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
