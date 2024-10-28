<template>
  <ul class="nav">
    <template v-for="(item, index) in data">
      <menu-item
        :key="index"
        :item="item"
        :index="index"
        :data="data"
        v-if="!item.parent"
      />
    </template>
  </ul>
</template>

<script>
import MenuItem from "./Helper/MenuItem.vue";

export default {
  name: "MenuItems",
  components: {
    MenuItem,
  },
  props: ["data"],
};
</script>
