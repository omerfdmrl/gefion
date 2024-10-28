import { defineStore } from "pinia";
export const useDataStore = defineStore("data", {
  state: () => {
    return {
      SidebarMenu: [],
      NavbarMenu: [],
    };
  },
  actions: {
    update({ SidebarMenu, NavbarMenu }) {
      this.SidebarMenu = SidebarMenu;
      this.NavbarMenu = NavbarMenu;
    },
  },
});
