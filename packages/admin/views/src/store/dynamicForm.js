import { defineStore } from "pinia";

export const useDynamicFormStore = defineStore("dynamicForm", {
  state: () => {
    return {
      data: {},
    };
  },
  actions: {
    update(key, value) {
      if (!this.data[key]) this.data[key] = {};
      if (typeof value === "string") {
        this.data[key] = value;
      } else if (typeof value === "object") {
        Object.keys(value).forEach((k) => {
          this.data[key][k] = value[k];
        });
      }
    },
  },
});
