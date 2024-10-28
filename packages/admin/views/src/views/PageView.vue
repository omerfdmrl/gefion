<template>
  <!-- Begin Page Content -->
  <div class="container-fluid">
    <!-- Page Heading -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800 text-capitalize">
        {{ this.$route.params.path.split("-").join(" ") }}
      </h1>
    </div>
    <!-- Account details card-->
    <DataComponent
      v-if="template"
      :template="template"
      :data="data"
      :methods="methods"
      :style="style"
    ></DataComponent>
  </div>
</template>

<script>
import adminService from "@/services/admin.service";
import DataComponent from "@/components/DataComponent.vue";
export default {
  data() {
    return {
      template: null,
      data: {},
      methods: {},
      style: ``,
    };
  },
  created() {
    adminService
      .getPage(this.$route.params.path)
      .then((response) => {
        this.template = response.view.template;
        this.data = response.view.data;
        this.methods = response.view.methods;
        this.style = response.view.style;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  components: { DataComponent },
};
</script>
