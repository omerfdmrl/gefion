<script setup>
import { useThemeStore } from "@/store/theme";
const theme = useThemeStore();
theme.update();
</script>

<template>
  <component :is="currentTemplate">
    <router-view :key="$route.fullPath"></router-view>
  </component>
</template>

<script>
import auth from "@/templates/AuthTemplate.vue";
import admin from "@/templates/AdminTemplate.vue";
export default {
  computed: {
    currentTemplate() {
      return this.$route.meta.template;
    },
  },
  components: {
    auth,
    admin,
  },
};
</script>
