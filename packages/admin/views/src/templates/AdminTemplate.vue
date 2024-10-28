<script setup>
import FooterComponent from "@/components/FooterComponent.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";
import NavbarComponent from "@/components/NavbarComponent.vue";
</script>

<template>
  <NavbarComponent></NavbarComponent>
  <div class="d-flex ms-0 me-0 h-100">
    <div style="width: 340px !important">
      <SidebarComponent></SidebarComponent>
    </div>
    <div class="w-100">
      <div id="wrapper ">
        <div id="content-wrapper" class="d-flex flex-column">
          <div class="mt-3">
            <router-view :key="$route.fullPath"></router-view>
          </div>
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  </div>
</template>

<script>
import adminService from "@/services/admin.service";
import { useDataStore } from "@/store/data";
export default {
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    const data = useDataStore();
    adminService.getAdminData().then((response) => {
      data.update(response);
    });
  },
};
</script>
