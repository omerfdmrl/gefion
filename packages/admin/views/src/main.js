import { createApp } from "vue/dist/vue.esm-bundler";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Vue3Toastify, { toast } from "vue3-toastify";
import AdminButton from "./components/AdminButton.vue";
import DataTable from "./components/DataTable.vue";
import DynamicForm from "./components/DynamicForm.vue";
import BlockEditor from "./components/BlockEditor.vue";
import HtmlEditor from "./components/HtmlEditor.vue";
import WysiwygEditor from "./components/WysiwygEditor.vue";

import "@/assets/base.css";
import "@/assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "vue3-toastify/dist/index.css";

import apiService from "./services/api.service";

const app = createApp(App);

app.config.globalProperties.$toast = toast;
app.config.globalProperties.$api = apiService;
app.use(Vue3Toastify, {
  autoClose: 3000,
  theme: "dark",
  position: "top-right",
  type: "default",
  dangerouslyHTMLString: true,
});

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(fas, far, fab);
dom.watch();

app.component("AdminButton", AdminButton);
app.component("DataTable", DataTable);
app.component("DynamicForm", DynamicForm);
app.component("BlockEditor", BlockEditor);
app.component("HtmlEditor", HtmlEditor);
app.component("WysiwygEditor", WysiwygEditor);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia()).use(router).mount("#app");
