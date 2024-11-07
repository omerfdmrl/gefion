const { Model, Schema } = require("@gefion/db");
const bcrypt = require("bcryptjs");
const Permission = require("@gefion/permission");
const Config = require("@gefion/config");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: "email",
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate: "match:/^(?=.*d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/img",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

/**
 * Add Rbac plugin to schema
 */
userSchema.plugin(Permission.plugin);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * If password changes, then encrypt it
 * @param {void} next
 */
userSchema.pre.save = async function (doc, next) {
  if (doc.isModified("password")) {
    doc.password = await bcrypt.hash(doc.password, 8);
  }
  next();
};

const User = new Model(Config.get("cms.userCollection", "User"), userSchema, {
  timestamps: true,
});

module.exports = User;
