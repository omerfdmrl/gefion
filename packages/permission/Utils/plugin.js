const Validator = require("@gefion/validator");
const Error = require("@gefion/error");
const Config = require("@gefion/config");

module.exports = (schema, rolePermissions) => {
  schema.add({
    roles: {
      type: [String],
      enum: Object.keys(Config.get("permission")).filter(
        (c) => c !== "default"
      ),
    },
    permissions: {
      type: [String],
      enum: Object.values(Config.get("permission")),
    },
  });

  schema.methods.assignRole = async function (role) {
    const validate = Validator.validate(role, "required|string");
    if (validate.failed()) Error.ValidationError(validate.firstFail());

    if (!this.roles.includes(role)) {
      this.roles.push(role);
    }
    await this.save();
    return this;
  };

  schema.methods.revokeRole = async function (role) {
    const validate = Validator.validate(role, "required|string");
    if (validate.failed()) Error.ValidationError(validate.firstFail());

    const index = this.roles.indexOf(role);
    if (index !== -1) {
      this.roles.splice(index, 1);
      await this.save();
    }

    return this;
  };

  schema.methods.hasRole = function (role) {
    const validate = Validator.validate(role, "required|string");
    if (validate.failed()) Error.ValidationError(validate.firstFail());
    return this.roles.includes(role);
  };

  schema.methods.givePermissionTo = async function (permission) {
    const validate = Validator.validate(permission, "required|string");
    if (validate.failed()) Error.ValidationError(validate.firstFail());

    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
      await this.save();
    }

    return this;
  };

  schema.methods.revokePermissionTo = async function (permission) {
    const validate = Validator.validate(permission, "required|string");
    if (validate.failed()) Error.ValidationError(validate.firstFail());

    const index = this.permissions.indexOf(permission);
    if (index !== -1) {
      this.permissions.splice(index, 1);
      await this.save();
    }

    return this;
  };

  schema.methods.can = function (permission) {
    const validate = Validator.validate(permission, "required|string");
    if (validate.failed()) Error.ValidationError(validate.firstFail());

    return (
      this.roles.some(
        (role) =>
          rolePermissions[role] && rolePermissions[role].includes(permission)
      ) || this.permissions.includes(permission)
    );
  };
};
