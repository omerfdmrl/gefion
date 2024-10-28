<template>
  <div class="row">
    <component :is="componentName"></component>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
export default {
  props: ["template", "data", "methods", "style"],
  data() {
    return {
      componentName: `${this.$route.params}Component`,
    };
  },
  created() {
    this.proccess();
  },
  methods: {
    proccess() {
      const app = getCurrentInstance().appContext.app;
      const componentName = this.componentName;

      const componentMethods = {};
      const componentData = this.data;
      if (this.methods) {
        for (const [key, methodString] of Object.entries(this.methods)) {
          try {
            componentMethods[key] = new Function(
              ...methodString.params,
              methodString.body
            );
          } catch (error) {
            console.error(
              `Error creating function for method '${key}':`,
              error
            );
          }
        }
      }

      const styleElement = document.createElement("style");
      styleElement.innerHTML = this.style;
      document.head.appendChild(styleElement);

      app.component(componentName, {
        name: componentName,
        template: this.template,
        data() {
          return componentData;
        },
        methods: componentMethods,
      });
    },
  },
};
</script>
