const Mail = require("@gefion/mail");

module.exports = class VerificationEmail extends Mail {
  constructor(to, token) {
    super();
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,
    To verify your email, click on this link: ${verificationEmailUrl}
    If you did not create an account, then ignore this email.`;
    this.send({
      to,
      subject: "Email Verification",
      html: text,
    });
  }
};
