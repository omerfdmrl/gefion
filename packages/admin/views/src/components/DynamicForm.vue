<script setup>
import apiService from "@/services/api.service";
import { useDynamicFormStore } from "@/store/dynamicForm";
const dynamicFormStore = useDynamicFormStore();
</script>

<template>
  <template v-for="(field, index) in schema" :key="index">
    <div
      v-if="field.type === 'row'"
      :class="getClass(field)"
      :style="field.style"
    >
      <DynamicForm
        :schema="field.childs"
        :model="model"
        :value="data"
        @updateValue="updateValue"
        :on="on"
      />
    </div>
    <div
      v-else-if="field.type === 'col'"
      :class="getClass(field)"
      :style="field.style"
    >
      <DynamicForm
        :schema="field.childs"
        :model="model"
        :value="data"
        @updateValue="updateValue"
        :on="on"
      />
    </div>
    <div
      v-else-if="field.type === 'card'"
      :class="getClass(field)"
      :style="field.style"
    >
      <div class="card-header" v-if="field.header">
        <DynamicForm
          :schema="field.header"
          :model="model"
          :value="data"
          @updateValue="updateValue"
          :on="on"
        />
      </div>
      <div class="card-body" :style="field.style">
        <DynamicForm
          :schema="field.childs"
          :model="model"
          :value="data"
          @updateValue="updateValue"
          :on="on"
        />
      </div>
      <div class="card-footer" v-if="field.footer" :style="field.style">
        <DynamicForm
          :schema="field.footer"
          :model="model"
          :value="data"
          @updateValue="updateValue"
          :on="on"
        />
      </div>
    </div>
    <div v-else-if="field.type === 'checkbox'" :class="getClass(field)">
      <div class="form-check mt-auto mb-2">
        <input
          class="form-check-input mt-2"
          :id="field.name"
          type="checkbox"
          v-model="data[field.name]"
          @change="(e) => updateValue(field, e.target.checked)"
          :style="field.style"
        />
        <label class="form-check-label mt-1" :for="field.name">
          {{ field.label }}
        </label>
      </div>
    </div>
    <div v-else-if="field.type === 'file'" :class="getClass(field)">
      <div class="w-100 d-flex justify-content-center" v-if="field.preview">
        <img
          class="img-account-profile rounded-circle mb-2 d-flex"
          width="300px"
          height="300px"
          :src="data[field.name]"
        />
      </div>
      <div class="mb-3">
        <label class="form-check-label mt-1" :for="field.name">
          {{ field.label }}
        </label>
        <input
          v-on:change="(e) => imagePreview(e, field.name)"
          :accept="field.accept || ''"
          class="form-control"
          type="file"
          :id="field.name"
          :style="field.style"
        />
      </div>
    </div>
    <div v-else-if="field.type === 'select'" :class="getClass(field)">
      <label class="small mb-1">{{ field.label }}</label>
      <select
        class="form-select"
        :value="data[field.name]"
        v-model="data[field.name]"
        @change="
          (e) =>
            updateValue(
              field,
              field.multiple
                ? Array.from(e.target.selectedOptions).map(
                    (option) => option.value
                  )
                : e.target.value
            )
        "
        :multiple="field.multiple || false"
        :style="field.style"
      >
        <option selected="false" disabled>Select a role:</option>
        <option
          v-for="(option, i) in field.enum"
          :key="i"
          :value="option"
          v-if="typeof option === 'string'"
        >
          {{ option }}
        </option>
        <option
          v-for="(option, ii) in field.enum"
          :key="ii"
          :value="option.value"
          v-else
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <span
      v-else-if="field.type === 'text'"
      :class="getClass(field)"
      :style="field.style"
    >
      {{ field.text }}
    </span>
    <div v-else-if="field.type === 'block-editor'" :class="getClass(field)">
      <label :for="field.name" class="small mb-1">{{ field.label }}</label>
      <BlockEditor
        v-model="data[field.name]"
        @change="(data) => updateValue(field, data)"
        :style="field.style"
        :placeholder="field.placeholder"
      ></BlockEditor>
    </div>
    <div v-else-if="field.type === 'html-editor'" :class="getClass(field)">
      <label :for="field.name" class="small mb-1">{{ field.label }}</label>
      <HtmlEditor
        v-model="data[field.name]"
        @change="(data) => updateValue(field, data)"
        :style="field.style"
        :placeholder="field.placeholder"
      ></HtmlEditor>
    </div>
    <admin-button
      v-else-if="field.type === 'AdminButton'"
      :class="getClass(field)"
      :callback="field.callback"
      :text="field.text || 'Save'"
      :value="dynamicFormStore.data[$route.params.path]"
      :then="field.then"
      :style="field.style"
    />
    <button
      v-else-if="field.type === 'ActionButton'"
      :class="getClass(field)"
      @click="() => ActionButtonClick(field)"
    >
      {{ field.text }}
    </button>
    <button
      v-else-if="field.type === 'button'"
      :class="getClass(field)"
      @click="
        () => $router.push({ name: 'page', params: { path: field.path } })
      "
    >
      {{ field.text }}
    </button>
    <div v-else :class="getClass(field)">
      <label :for="field.name" class="small mb-1">{{ field.label }}</label>
      <input
        class="form-control"
        :id="field.name"
        :type="field.type"
        :placeholder="field.placeholder"
        :style="field.style"
        v-model="data[field.name]"
        @change="(e) => updateValue(field, e.target.value)"
      />
    </div>
  </template>
</template>

<script>
export default {
  props: ["schema", "value", "model", "getValue", "on"],
  data() {
    return {
      data: { ...this.value },
    };
  },
  created() {
    if (this.getValue) {
      const dynamicFormStore = useDynamicFormStore();
      apiService(
        "admin/data/" + this.model + "/" + this.$route.query.id,
        {},
        {
          method: "GET",
        }
      )
        .then((val) => {
          this.data = val;
          dynamicFormStore.update(this.$route.params.path, val);
        })
        .catch((err) => this.$toast.error(err));
    } else if (this.value) {
      this.data = this.value;
    }
    this.$emit("getValue");
  },
  watch: {
    value: function (val) {
      this.data = val;
    },
  },
  methods: {
    ActionButtonClick(field) {
      const dynamicFormStore = useDynamicFormStore();

      if (field.callback === "save") {
        apiService(
          "admin/data/" + this.model,
          dynamicFormStore.data[this.$route.params.path]
        )
          .then(() => {
            this.$toast.success("Data Saved");
            this.data = {};
            dynamicFormStore.data[this.$route.params.path] = {};
          })
          .catch((err) => this.$toast.warn(err));
      }
      if (field.callback === "update") {
        apiService(
          "admin/data/" + this.model + "/" + this.$route.params.path,
          dynamicFormStore.data[this.$route.params.path],
          {
            method: "PATCH",
          }
        )
          .then(() => {
            this.$toast.success("Data Updated");
          })
          .catch((err) => this.$toast.warn(err));
      }
    },
    updateValue(field, value) {
      this.data[field.name] = value;
      const dynamicFormStore = useDynamicFormStore();
      dynamicFormStore.update(this.$route.params.path, {
        [field.name]: value,
      });
      this.$emit("updateValue", field, value);
    },
    getClass(field) {
      var output = "";
      if (field.type === "row") {
        output += " row ";
      }
      if (field.breakpoint) {
        output += ` col-${field.breakpoint} `;
      }
      if (field.type === "card") {
        output += " card mb-xl-0 pe-0 ps-0 ";
      }
      if (field.type === "checkbox") {
        output += " h-100 d-flex ";
      }
      if (
        field.type === "AdminButton" ||
        field.type === "ActionButton" ||
        field.type === "button"
      ) {
        output += " btn mt-2 ms-2 ";
        if (field.callback === "save") {
          output += " btn-success ";
        }
        if (field.callback === "update") {
          output += " btn-success ";
        }
      }
      if (field.class) {
        output += field.class;
      }
      if (field.fullscreen) {
        output += "h-100 w-100 fixed-top bg-dark";
      }
      return output;
    },
    imagePreview(event, name) {
      const file = event.target.files[0];
      if (file) {
        this.data[name] = URL.createObjectURL(file);
      }
    },
  },
};
</script>

<style>
.ql-container {
  height: 500px;
  border: var(--bs-border-width) solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
}
</style>
