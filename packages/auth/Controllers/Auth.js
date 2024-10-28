const { AuthService, UserService, TokenService } = require("../Services");

const Job = require("@gefion/job");

const register = async (req, res) => {
  const user = await UserService.createUser(req.body);
  const tokens = await TokenService.generateAuthTokens(user);
  res.status(201).send({ user, tokens });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await AuthService.loginUserWithEmailAndPassword(email, password);
  const tokens = await TokenService.generateAuthTokens(user);

  res.send({ user, tokens });
};

const logout = async (req, res) => {
  await AuthService.logout(req.body.refreshToken);
  res.status(204).send();
};

const refresh = async (req, res) => {
  const tokens = await AuthService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
};

const forgot = async (req, res) => {
  const resetPasswordToken = await TokenService.generateResetPasswordToken(
    req.body.email
  );
  Job.do("ResetPasswordEmail", req.body.email, resetPasswordToken);
  res.status(204).send();
};

const reset = async (req, res) => {
  await AuthService.resetPassword(req.query.token, req.body.password);
  res.status(204).send();
};

const sendVerification = async (req, res) => {
  const verifyEmailToken = await TokenService.generateVerifyEmailToken(
    req.user
  );
  Job.do("VerificationEmail", req.user.email, verifyEmailToken);
  res.status(204).send();
};

const verify = async (req, res) => {
  await AuthService.verifyEmail(req.query.token);
  res.status(204).send();
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  forgot,
  reset,
  sendVerification,
  verify,
};
