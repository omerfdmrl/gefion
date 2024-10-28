const ViewMaker = require("../ViewMaker");

module.exports = ({ Model, fields }) =>
  ViewMaker({
    template: `<div class="d-sm-flex align-items-center justify-content-between mb-4">
              <router-link
                :to="{ name: 'page', params: { path: '${Model.name.toLowerCase()}-add' } }"
                class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                Create ${Model.name}</router-link>
            </div>
            <DataTable :fields="fields" :config="config"></DataTable>`,
    data: {
      config: {
        model: Model.name,
      },
      fields,
    },
  });
