<template>
  <button type="button" @click="action">
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
import adminService from "@/services/admin.service";
export default {
  props: ["callback", "value", "text", "then", "catch"],

  methods: {
    defaultThen(value) {
      this.$toast.success(value);
    },
    defaultCatch(value) {
      this.$toast.warn(value);
    },
    action() {
      if (this.callback && typeof this.callback === "string") {
        adminService
          .doPageAction(this.$route.params.path, this.callback, this.value)
          .then((value) => {
            if (this.then) {
              this.then(value);
            } else {
              this.defaultThen(value);
            }
          })
          .catch((value) => {
            if (this.catch) {
              this.catch(value);
            } else {
              this.defaultCatch(value);
            }
          });
      } else {
        this.$emit("callback");
      }
    },
  },
};
</script>
