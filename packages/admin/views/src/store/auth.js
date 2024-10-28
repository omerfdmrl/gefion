import { defineStore } from "pinia";
import storageService from "@/services/storage.service";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      name: "",
      email: "",
      roles: [],
      permissions: [],
    };
  },
  actions: {
    login({ user, tokens }) {
      this.name = user.name;
      this.email = user.email;
      this.roles = user.roles;
      this.permissions = user.permissions;
      storageService.set("session", tokens);
      storageService.set("user", {
        name: user.name,
        email: user.email,
        roles: user.roles.join(","),
        permissions: user.permissions.join(","),
      });
    },
    async update() {
      const user = await storageService.get("user");
      if (!user) return;
      this.name = user.name;
      this.email = user.email;
      this.roles = user.roles.split(",");
      this.permissions = user.permissions.split(",");
    },
    logout() {
      this.name = "";
      this.email = "";
      this.roles = [];
      this.permissions = [];
      storageService.remove("session");
      storageService.remove("user");
    },
  },
});
