const Job = require("@gefion/job");

module.exports = class WelcomeMail extends Job {
  constructor(to, name) {
    super();
    this.mail.template("welcomeMail").send({
      to,
      subject: "Welcome To My App!",
      data: { name },
    });
  }
};
