const DataPages = require("./DataPages");
const Hook = require("@gefion/hook");

const createListView = (Model, config) => {
  const ModelSchema = Model.schema.schema;
  var fields = [];
  if (config.index !== false) {
    fields.push({
      text: "#",
      type: "index",
    });
  }
  Object.keys(ModelSchema).forEach((key) => {
    if (config.fields[key].isVisible.list !== false) {
      fields.push({
        text: key[0].toUpperCase() + key.slice(1),
        field: config.fields[key].field,
        type:
          ModelSchema[key].type == Boolean
            ? "check"
            : ModelSchema[key].type == Array
            ? "array"
            : "string",
      });
    }
  });

  fields.push({
    text: "Action",
    type: "action",
    actions: [
      {
        type: "edit",
        route: `${Model.name.toLowerCase()}-edit`,
        query: "id",
      },
      {
        type: "delete",
        verify: true,
      },
    ],
  });

  return DataPages.List({ Model, fields, config });
};

const createAddView = (Model, config) => {
  const ModelSchema = Model.schema.schema;
  var fields = [];
  Object.keys(ModelSchema).forEach((key) => {
    if (config.fields[key].isVisible.edit !== false) {
      fields.push({
        text: key[0].toUpperCase() + key.slice(1),
        field: key,
        type:
          ModelSchema[key].type == Boolean
            ? "check"
            : ModelSchema[key].type == Array
            ? "array"
            : "string",
      });
    }
  });

  return DataPages.Add({ Model, fields, config });
};

const createEditView = (Model, config) => {
  const ModelSchema = Model.schema.schema;
  var fields = [];
  Object.keys(ModelSchema).forEach((key) => {
    if (config.fields[key].isVisible.edit !== false) {
      fields.push({
        text: key[0].toUpperCase() + key.slice(1),
        field: key,
        type:
          ModelSchema[key].type == Boolean
            ? "check"
            : ModelSchema[key].type == Array
            ? "array"
            : "string",
      });
    }
  });

  return DataPages.Edit({ Model, fields, config });
};

const generateConfig = (Model, config) => {
  const ModelSchema = Model.schema.schema;
  const emptyConfig = {
    fields: {},
    listFields: Object.keys(ModelSchema),
    showFields: Object.keys(ModelSchema),
    editFields: Object.keys(ModelSchema),
    filterFields: Object.keys(ModelSchema),
    schema: Object.keys(ModelSchema),
  };
  config = Object.assign(emptyConfig, config);

  Object.keys(ModelSchema).forEach((key, index) => {
    if (!config.fields[key]) {
      config.fields[key] = {
        isVisible: {
          list: config.listFields.includes(key),
          show: config.showFields.includes(key),
          edit: config.editFields.includes(key),
          filter: config.filterFields.includes(key),
        },
      };
    } else if (typeof config.fields[key].isVisible === "boolean") {
      config.fields[key] = {
        isVisible: {
          list: config.fields[key].isVisible,
          show: config.fields[key].isVisible,
          edit: config.fields[key].isVisible,
          filter: config.fields[key].isVisible,
        },
      };
    }
    if (!config.fields[key].field) config.fields[key].field = key;
    if (!config.fields[key].isVisible.edit) {
      config.schema.splice(index, 1);
    }
  });

  return config;
};
module.exports = (name, config = {}) => {
  const Model = model(name[0].toUpperCase() + name.slice(1));
  const conf = generateConfig(Model, config);
  const ListView = createListView(Model, conf);
  const AddView = createAddView(Model, conf);
  const EditView = createEditView(Model, conf);

  Hook.add("admin-navbar-menu", (data) => {
    data.push({
      name: `${Model.name[0].toUpperCase() + Model.name.slice(1)}s`,
      path: "page",
      type: "relative",
      params: {
        path: `${Model.name.toLowerCase()}s`,
      },
    });
    return data;
  });

  Hook.add("admin-sidebar-menu", (data) => {
    data.push({
      name: `${Model.name[0].toUpperCase() + Model.name.slice(1)}s`,
      path: "page",
      type: "relative",
      params: {
        path: `${Model.name.toLowerCase()}s`,
      },
    });
    return data;
  });

  Hook.add(`admin-page-${Model.name.toLowerCase()}s`, (data) => {
    return {
      view: ListView,
    };
  });
  Hook.add(`admin-page-${Model.name.toLowerCase()}-add`, (data) => {
    return {
      view: AddView,
    };
  });
  Hook.add(`admin-page-${Model.name.toLowerCase()}-edit`, (data) => {
    return {
      view: EditView,
    };
  });
};
