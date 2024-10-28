module.exports = {
  prefix: "/auth",

  jwtSecret: "TEST-SECRET-CODE",

  redirect: null,

  userCollection: "User",

  tokenCollection: "Token",

  passwordRegex: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,

  accessExpirationMinutes: 20,
  refreshExpirationDays: 30,

  resetPasswordExpirationMinutes: 60,
  verifyEmailExpirationMinutes: 60,
};
