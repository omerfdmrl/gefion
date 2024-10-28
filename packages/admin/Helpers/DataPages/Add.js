const ViewMaker = require("../ViewMaker");

module.exports = ({ Model, config }) =>
  ViewMaker({
    template:
      '<DynamicForm :schema="schema" :model="model" :on="on" ></DynamicForm>',
    data: {
      on: "add",
      value: {},
      schema: config.schema,
      model: Model.name,
    },
  });
