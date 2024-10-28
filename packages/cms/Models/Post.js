const { Model, Schema } = require("@gefion/db");
const Config = require("@gefion/config");

const postSchema = new Schema({
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
  author: {
    type: model(Config.get("cms.userCollection", "User")),
    required: true,
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
 * Static method to check if a post is published
 * @param {ObjectId} postId - The post's ID
 * @returns {Promise<boolean>}
 */
postSchema.statics.isPublished = async function (postId) {
  const post = await this.findById(postId);
  return !!post?.published;
};

/**
 * Pre-save hook to update publishedAt timestamp if post is published
 * @param {void} next
 */
postSchema.pre.save = async function (doc, next) {
  if (doc.isModified("published") && doc.published && !doc.publishedAt) {
    doc.publishedAt = new Date();
  }
  next();
};

const Post = new Model(Config.get("cms.postCollection", "Post"), postSchema, {
  timestamps: true,
});

module.exports = Post;
