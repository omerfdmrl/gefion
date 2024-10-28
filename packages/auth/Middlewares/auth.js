const passport = require("passport");
const Error = require("@gefion/error");
const Config = require("@gefion/config");
const Router = require("@gefion/router");

const verifyCallback =
  (req, res, resolve, reject) => async (err, user, info) => {
    if (err || info || !user) {
      const redirect = Config.get("auth.redirect");
      if (redirect) res.redirect(Router.generate(redirect));
      return reject(Error.UnauthorizedError("Please authenticate"));
    }
    req.user = user;

    resolve();
  };

module.exports = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, res, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};
