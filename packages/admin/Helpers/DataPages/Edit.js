const ViewMaker = require("../ViewMaker");

module.exports = ({ Model, config }) =>
  ViewMaker({
    template:
      '<DynamicForm :schema="schema" :model="model" :getValue="true" :on="on"></DynamicForm>',
    data: {
      on: "edit",
      value: {},
      roles: ["admin", "user"],
      schema: config.schema,
      model: Model.name,
    },
  });
