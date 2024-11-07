const { Model, Schema } = require("@gefion/db");
const Config = require("@gefion/config");

const pageSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
});

/**
 * Static method to check if a page is published
 * @param {ObjectId} pageId - The page's ID
 * @returns {Promise<boolean>}
 */
pageSchema.statics.isPublished = async function (pageId) {
  const page = await this.findById(pageId);
  return !!page?.published;
};

/**
 * Pre-save hook to update publishedAt timestamp if page is published
 * @param {void} next
 */
pageSchema.pre.save = async function (doc, next) {
  if (doc.isModified("published") && doc.published && !doc.publishedAt) {
    doc.publishedAt = new Date();
  }
  next();
};

const Page = new Model(Config.get("cms.pageCollection", "Page"), pageSchema, {
  timestamps: true,
});

module.exports = Page;
