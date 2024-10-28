<template>
  <div id="theme-switch">
    <div class="switch"></div>
  </div>
</template>

<script>
import { useThemeStore } from "@/store/theme";
export default {
  mounted() {
    const theme = useThemeStore();
    document
      .getElementById("theme-switch")
      .addEventListener("click", function () {
        theme.changeTheme();
      });
  },
};
</script>

<style scoped>
#theme-switch {
  color: var(--text);
  width: 70px;
  height: 30px;
  background: #333;
  border-radius: 50px;
  position: relative;
}
#theme-switch .switch {
  background: white;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  position: absolute;
  top: 3px;
  left: 4px;
  transition: 0.5s all ease;
}
html[data-bs-theme="dark"] #theme-switch .switch {
  transform: translateX(37px);
}
</style>
