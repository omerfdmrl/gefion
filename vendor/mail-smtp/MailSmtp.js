const nodemailer = require("nodemailer");
const Handlebars = require("@gefion/mail-handlebars");
const Mail = require("@gefion/mail");
const Hook = require("@gefion/hook");

Hook.add("admin-settings-data-mail-smtp", (model) => {
  return `<div class="row">
            <div><label for="provider" class="form-label mt-3">Provider</label><input v-model="${model}.provider" type="text" id="provider" class="form-control" disabled=""><small class="form-text text-muted">Indicates the type of email provider, fixed as 'smtp'.</small></div>
            <div><label for="from" class="form-label mt-3">From</label><input v-model="${model}.from" type="text" id="from" class="form-control"><small class="form-text text-muted">Specifies the sender's email address.</small></div>
            <div><label for="host" class="form-label mt-3">Host</label><input v-model="${model}.host" type="text" id="host" class="form-control"><small class="form-text text-muted">Specifies the hostname or IP address of the SMTP server.</small></div>
            <div><label for="port" class="form-label mt-3">Port</label><input v-model="${model}.port" type="number" id="port" class="form-control"><small class="form-text text-muted">Specifies the port number used by the SMTP server.</small></div>
            <div>
                <div class="row">
                  <div><label for="user" class="form-label mt-3">Username</label><input v-model="${model}.auth.user" type="text" id="user" class="form-control"><small class="form-text text-muted">Specifies the username for authentication.</small></div>
                  <div><label for="pass" class="form-label mt-3">Password</label><input v-model="${model}.auth.pass" type="password" id="pass" class="form-control"><small class="form-text text-muted">Specifies the password for authentication.</small></div>
                </div>
            </div>
            <div><label for="pool" class="form-label mt-3">Pool</label><input v-model="${model}.pool" class="form-check-input form-control" type="checkbox" id="pool" value="true"><small class="form-text text-muted">Enables connection pooling if checked.</small></div>
            <div><label for="maxConnections" class="form-label mt-3">Max Connections</label><input v-model="${model}.maxConnections" type="number" id="maxConnections" class="form-control"><small class="form-text text-muted">Specifies the maximum number of connections allowed.</small></div>
            <div><label for="rateDelta" class="form-label mt-3">Rate Delta</label><input v-model="${model}.rateDelta" type="number" id="rateDelta" class="form-control"><small class="form-text text-muted">Specifies the rate delta value.</small></div>
            <div><label for="rateLimit" class="form-label mt-3">Rate Limit</label><input v-model="${model}.rateLimit" type="number" id="rateLimit" class="form-control"><small class="form-text text-muted">Specifies the rate limit value.</small></div>
          </div>`;
});

/**
 * Represents the SMTP provider for GefionMail
 * @class
 * @extends Handlebars
 */
class MailSmtp extends Handlebars {
  /**
   * Name of the provider.
   * @type {string}
   * @static
   */
  static provider = "smtp";
  /** @private */
  #config;
  /** @private */
  #transporter;
  /** @private */
  #template;

  constructor(config) {
    super(config);
    this.#config = config;
    this.#transporter = nodemailer.createTransport(config);
  }

  /**
   * Set the template to be used for sending emails.
   * @param {string} template - The template name.
   * @returns {MailSmtp} - Returns the current instance of MailSmtp.
   */
  template(template) {
    this.#template = template;
    return this;
  }

  /**
   * Send an email with the specified details.
   * @param {Object} options - The email options.
   * @param {string} options.to - The recipient email address.
   * @param {string} options.subject - The email subject.
   * @param {Object} options.data - The data to be passed to the email template.
   * @param {string} options.html - The HTML content of the email.
   * @returns {Promise} - A Promise that resolves when the email is sent.
   */
  send({ to, subject, data, html }) {
    const sendMail = this.#transporter.sendMail({
      to,
      subject,
      html: this.render(this.#template ? this.#template : html, data),
      from: this.#config.from,
    });
    this.#template = "";
    return sendMail;
  }
}

Mail.register(MailSmtp);
