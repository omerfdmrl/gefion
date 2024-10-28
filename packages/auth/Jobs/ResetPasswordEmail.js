const Mail = require("@gefion/mail");

module.exports = class ResetPasswordEmail extends Mail {
  static name = "ResetPasswordEmail";
  constructor(to, token) {
    super();
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${resetPasswordUrl}
    If you did not request any password resets, then ignore this email.`;
    this.send({
      to,
      subject: "Reset Password",
      html: text,
    });
  }
};
