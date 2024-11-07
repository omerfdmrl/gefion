const Admin = require("@gefion/admin");
const Hook = require("@gefion/hook");

Hook.add("admin-page-post-edit", async (data) => {
  const field = Admin.findFieldFromSchema(data.view.data.schema, "content");
  field.type = "block-editor";
  return data;
});

Hook.add("admin-page-post-add", async (data) => {
  const field = Admin.findFieldFromSchema(data.view.data.schema, "content");
  field.type = "block-editor";
  return data;
});

Hook.add("admin-page-page-edit", async (data) => {
  const field = Admin.findFieldFromSchema(data.view.data.schema, "content");
  field.type = "block-editor";
  return data;
});

Hook.add("admin-page-page-add", async (data) => {
  const field = Admin.findFieldFromSchema(data.view.data.schema, "content");
  field.type = "block-editor";
  return data;
});
