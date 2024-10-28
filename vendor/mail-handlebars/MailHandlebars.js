const handlebars = require("handlebars");
const fs = require("fs");
const Validator = require("@gefion/validator");
const Error = require("@gefion/error");

/**
 * Represents a handlebar render for GefionMail.
 * @class
 */
module.exports = class MailHandlebars {
  /** @private */
  #config;

  constructor(config) {
    this.#config = config;
  }

  /**
   * Render the specified template with the provided data.
   * @param {string} template - The template name.
   * @param {Object} data - The data to be passed to the template.
   * @returns {string} - The rendered content.
   * @throws {Error.ConfigurationError} - If the template is not found or if validation fails.
   */
  render(template, data) {
    const templateSource = fs.readFileSync(
      this.#config.templates + template.replaceAll(".", "/") + ".html",
      "utf8"
    );

    if (!templateSource) return template;

    const validate = Validator.validate(templateSource, "required");
    if (validate.failed())
      throw new Error.ConfigurationError(validate.firstFail());

    const templateContent = handlebars.compile(templateSource);

    const content = templateContent(data);

    return content;
  }
};
