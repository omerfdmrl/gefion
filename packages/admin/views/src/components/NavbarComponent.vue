<script setup>
import utilsService from "@/services/utils.service";
import ThemeToggler from "./ThemeToggler.vue";
import MenuComponent from "./MenuComponent.vue";
const { useDataStore } = require("@/store/data");
const data = useDataStore();
</script>

<template>
  <nav class="navbar navbar-expand-lg shadow">
    <div class="container">
      <a class="navbar-brand" href="#">
        <span>Gefion</span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <MenuComponent
          :data="data.NavbarMenu"
          class="navbar-nav me-auto mb-2 mb-lg-0"
        ></MenuComponent>
        <ul class="navbar-nav mb-2 mb-lg-0">
          <ThemeToggler class="mt-1 mb-md-2"></ThemeToggler>
          <li class="nav-item dropdown d-flex ms-lg-3">
            <img
              :src="`https://www.gravatar.com/avatar/${utilsService.MD5(
                auth.email
              )}`"
              width="35"
              height="35"
              class="rounded-circle"
            /><a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              >omerfdmrl</a
            >
            <ul class="dropdown-menu">
              <li>
                <a href="/profile/omerfdmrl" class="dropdown-item">Profile</a>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li><a href="#" class="dropdown-item">Editor Panel</a></li>
              <li><a href="#" class="dropdown-item">Admin Panel</a></li>
              <li>
                <a @click="logout" class="dropdown-item" href="#">Logout</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/store/auth";
import authService from "@/services/auth.service";
export default {
  data() {
    return {
      auth: useAuthStore(),
    };
  },
  methods: {
    logout() {
      authService.logout();
      this.auth.logout();
      this.$router.push({ name: "auth-login" });
    },
  },
};
</script>
