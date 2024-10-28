<template>
  <li class="nav-item ms-2 d-flex" v-if="item">
    <router-link
      v-if="item.type == 'relative'"
      :to="{ name: item.path, params: item.params }"
      class="nav-link"
    >
      {{ item.name }}
    </router-link>
    <a
      v-else
      :href="item.path"
      :target="item.target ?? '_self'"
      class="nav-link p-0"
    >
      {{ item.name }}
    </a>
    <button
      type="button"
      class="btn dropdown-toggle dropdown-toggle-split p-0"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      v-if="hasChildren"
    >
      <span class="visually-hidden">Toggle Dropstart</span>
    </button>
    <ul v-if="hasChildren" class="dropdown-menu">
      <menu-item
        v-for="(child, childIndex) in children"
        :key="childIndex"
        :item="child"
        :index="childIndex"
        :data="data"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: "MenuItem",
  props: ["item", "index", "data"],
  computed: {
    hasChildren() {
      return (
        this.data.filter(
          (d) =>
            d.parent === this.item.path || d.parent === this.item.params.path
        ).length > 0
      );
    },
    children() {
      return this.data.filter(
        (d) => d.parent === this.item.path || d.parent === this.item.params.path
      );
    },
  },
};
</script>
