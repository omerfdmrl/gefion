const ViewMaker = require("@gefion/admin").ViewMaker;

const Config = require("@gefion/config");
const PermissionConfig = Config.get("permission");

module.exports = ViewMaker({
  template: `
      <div class="mb-4">
        <div class="row">
          <div class="col-md-4 ms-2" v-for="(role, index) in Object.keys(model).filter(v => Array.isArray(model[v]))" :key="index">
            <label :for="role" class="form-label mt-3 d-flex">{{ role }}
              <div class="dropdown">
                <button class="btn dropdown-toggle" type="button" :id="'dropdownMenu' + role" data-bs-toggle="dropdown" aria-expanded="false">
                  ...
                </button>
                <ul class="dropdown-menu" :aria-labelledby="'dropdownMenu' + role">
                  <li>
                    <a class="dropdown-item p-0" href="#">
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#DeleteModal"
                        @click="deletedIndex = role"
                        class="btn p-0">
                        <font-awesome-icon class="ms-3" :style="{color: 'tomato'}" :icon="['fa', 'trash']" />
                        <span class="ms-2">Delete role</span>
                      </button>
                    </a>
                  </li>
                  <li class="mt-2">
                    <admin-button callback="default" :value="role" :then="thenDefault.bind(null, role)" class="dropdown-item p-0" href="#" v-if="role !== model.default">
                      <font-awesome-icon class="ms-3" :style="{color: 'green'}" :icon="['fa', 'check']" />
                      <span class="ms-2">Set as default</span>
                    </admin-button>
                    <a class="dropdown-item p-0" href="#" v-else>
                      <font-awesome-icon class="ms-3" :style="{color: 'lightgreen'}" :icon="['fa', 'check']" />
                      <span class="ms-2">Default role</span>
                    </a>
                  </li>
                </ul>
              </div>
            </label>
            <select multiple :id="role" class="form-select" style="{MaxWidth: '350px'}" v-model="model[role]">
              <option v-for="(permission, index2) in permissions" :key="index2" :value="permission">{{ permission }}</option>
            </select>
          </div>
          <div class="mt-5">
            <admin-button class="btn btn-success mt-2 ms-2" callback="save" text="Save" :value="model" :then="thenSave" />
            <button 
                data-bs-toggle="modal"
                data-bs-target="#AddModal"
                class="btn btn-primary mt-2 ms-2">Add +</button>
          </div>
        </div>
      </div>
      
      <div
        class="modal fade"
        id="DeleteModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="DeleteModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1
                class="modal-title fs-5 text-capitalize"
                id="DeleteModalLabel"
              >
                Delete Role
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>
                Are you sure about delete this
                role?
              </p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <admin-button 
                class="btn btn-primary"
                data-bs-dismiss="modal"
                callback="delete"
                :value="deletedIndex"
                :then="thenDelete.bind(null, deletedIndex)"
                text="Understood" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="AddModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="AddModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1
                class="modal-title fs-5 text-capitalize"
                id="AddModalLabel"
              >
                Add Role
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="mb-4">
                <label for="roleName" class="form-label mt-3">Role Name</label>
                <input v-model="addedRole.name" type="text" id="roleName" class="form-control">
              </div>
              <select multiple  class="form-select" style="{MaxWidth: '350px'}" v-model="addedRole.permissions">
                <option v-for="(permission, index2) in permissions" :key="index2" :value="permission">{{ permission }}</option>
              </select>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <admin-button 
                class="btn btn-primary"
                data-bs-dismiss="modal"
                callback="add"
                :value="addedRole"
                :then="thenAdd.bind(null, addedRole.name)"
                text="Add" />
            </div>
          </div>
        </div>
      </div>
    `,
  data: {
    permissions: [
      ...new Set(
        Object.entries(PermissionConfig)
          .filter(([key, value]) => Array.isArray(value))
          .flatMap(([key, value]) => value)
      ),
    ],
    model: PermissionConfig,
    deletedIndex: null,
    addedRole: {},
  },
  methods: {
    thenSave: (a) => {
      this.$toast.success("Saved");
    },
    thenDelete: (role, res) => {
      this.$toast.warn("Deleted");
      delete this.model[role];
    },
    thenAdd: () => {
      this.$toast.success("Added");
      this.model[role] = this.addedRole.permissions;
      this.addedRole = {};
    },
    thenDefault: (role) => {
      this.$toast.success("Default role changed");
      this.model.default = role;
    },
  },
});
