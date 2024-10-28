<script setup>
import MenuComponent from "./MenuComponent.vue";
const { useDataStore } = require("@/store/data");
const data = useDataStore();
</script>

<template>
  <div class="d-flex flex-column flex-shrink-0 p-3 shadow h-100 text-center">
    <MenuComponent
      :data="data.SidebarMenu"
      class="nav-pills flex-column mb-auto"
    ></MenuComponent>
  </div>
</template>
