const Config = require("@gefion/config");
const { DataMaker } = require("@gefion/admin");
const Hook = require("@gefion/hook");
const Admin = require("@gefion/admin");
const { User } = require("./Models");

DataMaker("user", {
  listFields: ["name", "email", "roles"],
  fields: {
    password: {
      isVisible: {
        list: false,
        edit: true,
        filter: false,
        show: false,
      },
    },
    permissions: {
      isVisible: false,
    },
    email: {
      isVisible: true,
    },
  },
  schema: [
    {
      type: "row",
      childs: [
        {
          type: "col",
          breakpoint: "xl-8",
          childs: [
            {
              type: "card",
              header: [
                {
                  type: "text",
                  text: "User Informations",
                },
              ],
              footer: [
                {
                  type: "ActionButton",
                  callback: "save",
                  text: "Save",
                  on: "add",
                },
                {
                  type: "ActionButton",
                  callback: "update",
                  text: "Update",
                  on: "edit",
                },
              ],
              class: "mb-4",
              childs: [
                {
                  type: "input",
                  name: "name",
                  label: "Name",
                },
                {
                  type: "row",
                  childs: [
                    {
                      type: "col",
                      breakpoint: "8",
                      childs: [
                        {
                          type: "email",
                          name: "email",
                          label: "Email",
                        },
                      ],
                    },
                    {
                      type: "col",
                      breakpoint: "4",
                      childs: [
                        {
                          type: "checkbox",
                          name: "isEmailVerified",
                          label: "Email Verified",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "select",
                  enum: Object.keys(Config.get("permission")).filter(
                    (c) => c !== "default"
                  ),
                  multiple: true,
                  name: "role",
                  label: "Role",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

DataMaker("post", {
  listFields: ["title", "author", "published", "createdAt"],
  fields: {
    content: {
      isVisible: {
        list: false,
        edit: true,
        filter: false,
        show: true,
      },
    },
    published: {
      isVisible: {
        list: true,
        edit: true,
        filter: true,
        show: true,
      },
    },
    author: {
      isVisible: {
        list: true,
        edit: true,
        filter: true,
        show: true,
      },
      field: "author.name",
    },
  },
  schema: [
    {
      type: "row",
      childs: [
        {
          type: "col",
          breakpoint: "xl-8",
          childs: [
            {
              type: "input",
              name: "title",
              class: "border-0",
              placeholder: "Add Title...",
              style:
                "text-align:center; border: none !important; font-size: 30px; box-shadow: none;",
            },
            {
              type: "html-editor",
              name: "content",
              class: "h-100",
              placeholder: "Type / to choose a block",
            },
          ],
        },
        {
          type: "col",
          breakpoint: "xl-4",
          childs: [
            {
              type: "card",
              header: [
                {
                  type: "text",
                  text: "Post Details",
                },
              ],
              footer: [
                {
                  type: "ActionButton",
                  callback: "save",
                  text: "Save",
                  on: "add",
                },
                {
                  type: "ActionButton",
                  callback: "update",
                  text: "Update",
                  on: "edit",
                },
              ],
              childs: [
                {
                  type: "file",
                  accept: "image/*",
                  preview: true,
                },
                {
                  type: "row",
                  childs: [
                    {
                      type: "col",
                      breakpoint: "6",
                      childs: [
                        {
                          type: "select",
                          name: "author",
                          label: "Author",
                          enum: ["author 1", "author 2", "author 3"],
                        },
                      ],
                    },
                    {
                      type: "col",
                      breakpoint: "6",
                      childs: [
                        {
                          type: "checkbox",
                          name: "published",
                          label: "Published",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

Hook.add(`admin-page-post-edit`, async (data) => {
  const users = await User.find({});
  const e = [];
  for (const user of users) {
    e.push({
      value: user.id,
      label: user.name,
    });
  }

  const field = Admin.findFieldFromSchema(data.view.data.schema, "author");
  field.enum = e;
  return data;
});

Hook.add(`admin-data-list-post`, ({ filter, options }) => {
  options.populate = "author..name";
  return {
    filter,
    options,
  };
});
