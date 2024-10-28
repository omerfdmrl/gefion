import { defineStore } from "pinia";
import storageService from "@/services/storage.service.js";
export const useThemeStore = defineStore("theme", {
  state: () => {
    return {
      theme: "light",
    };
  },
  actions: {
    changeTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      storageService.set("theme", this.theme);
      this.update();
    },
    update() {
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      const storageThemeMq = storageService.get("theme");
      this.theme = storageThemeMq
        ? storageThemeMq
        : darkThemeMq.matches
        ? "dark"
        : "light";
      document.getElementsByTagName("html")[0].dataset.bsTheme = this.theme;
    },
  },
});
