/**
 * This file is responsible for initializing the necessary packages.
 * @file This file is responsible for initializing the necessary packages.
 * @module packages
 *
 */

module.exports = async function packages() {
  const CMS = require("@gefion/cms");
  const Cms = new CMS();
  await Cms.init();

  const Auth = require("@gefion/auth");
  const auth = new Auth();
  await auth.init();

  const Permission = require("@gefion/permission");
  const permission = new Permission();
  await permission.init();

  const Admin = require("@gefion/admin");
  const admin = new Admin();
  await admin.init();

  const BlockEditor = require("@gefion/block-editor");
  const blockEditor = new BlockEditor();
  await blockEditor.init();
};
