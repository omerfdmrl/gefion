const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const Config = require("@gefion/config");
const tokenTypes = require("./tokenTypes");
const { User } = require("../Models");

const jwtOptions = {
  secretOrKey: Config.get("auth.jwtSecret"),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

module.exports = new JwtStrategy(jwtOptions, jwtVerify);
