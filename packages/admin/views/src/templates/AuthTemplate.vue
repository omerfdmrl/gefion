<template>
  <div class="d-flex w-100 h-100">
    <router-view class="w-50 h-50 m-auto" :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import authService from "@/services/auth.service";
export default {
  async mounted() {
    const status = await authService.isTokensExpired();
    if (status !== -1) this.$router.push({ name: "dashboard" });
  },
};
</script>
