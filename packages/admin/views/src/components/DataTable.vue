<template>
  <div class="card shadow">
    <div class="card-header d-flex">
      <label class="ms-2 d-flex">
        <span class="mt-auto mb-auto">Show</span>
        <select class="form-select ms-2 me-2" v-model="limit">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="mt-auto mb-auto">Entries</span>
      </label>
      <label class="ms-auto d-flex">
        <span class="mt-auto mb-auto me-2"> Search: </span>
        <input
          type="text"
          class="form-control"
          placeholder="Search"
          v-model="search.text"
        />
      </label>
    </div>
    <div class="card-body">
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col" v-for="(item, index) in fields" :key="index">
              <span
                class="d-flex justify-content-between fs-6"
                @click="sort(item.field)"
                type="button"
              >
                <span class="mt-auto mb-auto">{{ item.text }}</span>
                <span class="d-flex flex-column mb-1" v-if="item.field">
                  <span
                    :class="[
                      sorts[item.field] && sorts[item.field] == 'asc'
                        ? ''
                        : 'text-muted',
                    ]"
                    style="height: 14px"
                    >&blacktriangle;</span
                  >
                  <span
                    :class="[
                      sorts[item.field] && sorts[item.field] == 'desc'
                        ? ''
                        : 'text-muted',
                    ]"
                    style="height: 14px"
                    >&blacktriangledown;</span
                  >
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td v-for="(item2, index2) in fields" :key="index2">
              <span v-if="item2.type == 'index'">{{ index }}</span>
              <span v-else-if="item2.type == 'check'"
                ><input type="checkbox" :checked="item[item2.field]" disabled
              /></span>
              <span v-else-if="item2.type == 'length'">{{
                getData(item, item2.field).length
              }}</span>
              <span v-else-if="item2.type == 'array'">{{
                getData(item, item2.field).join(",")
              }}</span>
              <span v-else-if="item2.type == 'action'">
                <span v-for="(item3, index3) in item2.actions" :key="index3">
                  <span
                    @click="
                      item3.callback
                        ? item3.callback(item)
                        : item3.verify
                        ? verifyItem(item, item3.type)
                        : item3.route
                        ? $router.push({
                            name: 'page',
                            params: { path: item3.route },
                            query: getQuery(item, item3.query),
                          })
                        : void 0
                    "
                    :data-bs-toggle="[item3.verify ? 'modal' : '']"
                    :data-bs-target="[item3.verify ? '#DataTableModal' : '']"
                    type="button"
                  >
                    <svg
                      v-if="item3.type == 'edit'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      ></path>
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                      ></path>
                    </svg>
                    <svg
                      v-if="item3.type == 'delete'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      ></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </span>
                </span>
              </span>
              <span v-else>{{ getData(item, item2.field) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer d-flex justify-content-between">
      <div class="mt-auto mb-auto">
        Showing {{ limit * page - limit + 1 }} to {{ limit * page }} of
        {{ totalResults }} entries
      </div>
      <nav>
        <ul class="pagination pagination-md mt-auto mb-auto">
          <li :class="[page == 1 ? 'disabled' : '', 'page-item']">
            <a
              class="page-link"
              href="#"
              aria-label="Previous"
              :disabled="page == 1"
              @click="page--"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item">
            <select class="form-select" v-model="page">
              <option v-for="index in totalPages" :key="index" :value="index">
                {{ index }}
              </option>
            </select>
          </li>
          <li :class="[page == totalPages ? 'disabled' : '', 'page-item']">
            <a
              class="page-link"
              href="#"
              aria-label="Next"
              :disabled="page == totalPages"
              @click="page++"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div
    class="modal fade"
    id="DataTableModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="DataTableModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-capitalize" id="DataTableModalLabel">
            {{ this.verified.verifyType }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure about {{ this.verified.verifyType }} this item?</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="doVerify"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apiService from "@/services/api.service";
export default {
  props: ["fields", "config"],
  data() {
    return {
      page: 1,
      limit: 10,
      search: {
        text: "",
        timeout: null,
      },
      data: [],
      sorts: {},
      totalPages: 0,
      totalResults: 0,
      verified: {},
    };
  },
  watch: {
    page: function () {
      this.updateData();
    },
    "search.text": function () {
      clearTimeout(this.search.timeout);
      this.search.timeout = setTimeout(() => {
        this.updateData();
      }, 1000);
    },
  },
  methods: {
    updateData() {
      var sortBy = "";
      Object.keys(this.sorts).forEach((key) => {
        if (sortBy != "") {
          sortBy += ",";
        }
        sortBy += `${key}:${this.sorts[key]}`;
      });
      var config = {
        page: this.page,
        limit: this.limit,
        filter: "",
      };
      if (sortBy != "") config.sortBy = sortBy;
      if (this.search.text) config.search = this.search.text;

      apiService("admin/data/" + this.config.model, config, {
        method: "GET",
      }).then((response) => {
        this.data = response.results;
        this.totalPages = response.totalPages;
        this.totalResults = response.totalResults;
      });
    },
    sort(field) {
      if (!this.sorts[field]) {
        this.sorts[field] = "desc";
      }
      this.sorts[field] = this.sorts[field] == "asc" ? "desc" : "asc";
      this.updateData();
    },
    verifyItem(item, type) {
      this.verified = { ...item, verifyType: type };
    },
    doVerify() {
      if (this.verified.verifyType == "delete") {
        apiService(
          "admin/data/" + this.config.model + "/" + this.verified.id,
          {},
          {
            method: "DELETE",
          }
        ).then(() => {
          this.verified = {};
          this.updateData();
        });
      } else {
        apiService(
          "admin/data/" + this.config.model + "/" + this.verified.verifyType,
          {},
          {
            method: "POST",
          }
        ).then(() => {
          this.verified = {};
          this.updateData();
        });
      }
    },
    getData(data, field) {
      const fieldParts = field.split(".");
      let result = data;
      for (const part of fieldParts) {
        if (!Object.prototype.hasOwnProperty.call(result, part)) {
          return null;
        }
        result = result[part];
      }
      return result;
    },
    getQuery(item, query) {
      var output = {};
      if (typeof query === "string") {
        output = { [query]: item[query] };
      } else if (typeof query === "object") {
        Object.keys(query).forEach((key) => {
          output[key] = item[key];
        });
      }
      return output;
    },
  },
  mounted() {
    this.updateData();
  },
};
</script>
