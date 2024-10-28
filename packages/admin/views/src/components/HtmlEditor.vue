<template>
  <div class="quill-wrapper" v-once>
    <!-- Bu div Quill editörü için kullanılacak -->
    <div ref="editorElement"></div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
  watch,
} from "vue";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

const props = defineProps(["modelValue", "placeholder"]);
const emit = defineEmits(["update:modelValue", "change"]);

let quillEditor = null;
const editorElement = ref(null);
let updatingModel = false;

// Modelden görünüme
function modelToView() {
  if (props.modelValue) {
    quillEditor.root.innerHTML = props.modelValue;
  }
}

// Görünümden modele
function viewToModel() {
  updatingModel = true;
  const content = quillEditor.root.innerHTML;
  emit("update:modelValue", content);
  emit("change", content);
  updatingModel = false;
}

onMounted(() => {
  // Quill editörünü başlatmadan önce ref'in elemente bağlı olduğundan emin olun
  if (editorElement.value) {
    // Quill editörünü başlat
    quillEditor = new Quill(editorElement.value, {
      theme: "snow",
      placeholder: props.placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
      },
    });

    // Başlangıç değerini ayarla
    modelToView();

    // Quill değişimlerini dinle
    quillEditor.on("text-change", () => {
      if (!updatingModel) {
        viewToModel();
      }
    });
  } else {
    console.error("Editor element not found.");
  }
});

onUnmounted(() => {
  quillEditor = null;
});

watch(
  () => props.modelValue,
  (val) => {
    if (!updatingModel && quillEditor.root.innerHTML !== val) {
      modelToView();
    }
  }
);
</script>

<style>
.ql-toolbar button {
  background-color: #d4ecff !important;
  color: #1d202b !important;
}
</style>
