<template>
  <div class="editorjs" ref="htmlelement"></div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
import EditorJS from "@editorjs/editorjs";
import EmbedTool from "@editorjs/embed";
import ListTool from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import MarkerTool from "@editorjs/marker";
import HeaderTool from "@editorjs/header";
import InlineCodeTool from "@editorjs/inline-code";
import QuoteTool from "@editorjs/quote";
import DelimiterTool from "@editorjs/delimiter";
import TableTool from "@editorjs/table";
import ParagraphTool from "@editorjs/paragraph";
import WarningTool from "@editorjs/warning";
import ChecklistTool from "@editorjs/checklist";

import { onMounted, onUnmounted, ref, watch } from "vue";
const htmlelement = ref(null);
const props = defineProps(["modelValue", "placeholder"]);
const emit = defineEmits(["update:modelValue", "change"]);

let editor;
let updatingModel = false;
// model -> view
function modelToView() {
  if (!props.modelValue) {
    return;
  }
  if (typeof props.modelValue === "string") {
    editor.blocks.renderFromHTML(props.modelValue);
    return;
  }
  editor.render(props.modelValue);
}

function convertDataToHtml(blocks) {
  var convertedHtml = "";
  blocks.map((block) => {
    switch (block.type) {
      case "header":
        convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        break;
      case "embded":
        convertedHtml += `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
        break;
      case "paragraph":
        convertedHtml += `<p>${block.data.text}</p>`;
        break;
      case "delimiter":
        convertedHtml += "<hr />";
        break;
      case "image":
        convertedHtml += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
        break;
      case "list":
        convertedHtml += "<ul>";
        block.data.items.forEach(function (li) {
          convertedHtml += `<li>${li}</li>`;
        });
        convertedHtml += "</ul>";
        break;
      default:
        console.log("Unknown block type", block.type);
        break;
    }
  });
  return convertedHtml;
}

// view -> model
function viewToModel() {
  updatingModel = true;
  editor
    .save()
    .then((outputData) => {
      const data = convertDataToHtml(outputData.blocks);
      emit("update:modelValue", data);
      emit("change", data);
    })
    .finally(() => {
      updatingModel = false;
    });
}
onMounted(() => {
  editor = new EditorJS({
    holder: htmlelement.value,
    placeholder: props.placeholder,
    inlineToolbar: ["bold", "italic", "marker", "link", "inlineCode"],
    tools: {
      header: {
        class: HeaderTool,
        inlineToolbar: true,
        config: {
          placeholder: "Enter a header",
          levels: [2, 3, 4],
          defaultLevel: 2,
        },
      },
      list: {
        class: ListTool,
        inlineToolbar: true,
      },
      embed: {
        class: EmbedTool,
        inlineToolbar: true,
        config: {
          services: {
            youtube: true,
            vimeo: true,
            instagram: true,
            twitter: true,
          },
        },
      },
      image: {
        class: ImageTool,
        inlineToolbar: ["link", "bold"],
        config: {
          endpoints: {
            byFile: "/uploadFile", // Backend'de dosya yükleme URL'si
            byUrl: "/fetchUrl", // URL'den görsel yükleme
          },
        },
      },
      marker: {
        class: MarkerTool, // Metni vurgulamak için
        shortcut: "CMD+SHIFT+M",
      },
      code: {
        class: CodeTool, // Kod bloğu eklemek için
        inlineToolbar: false,
      },
      inlineCode: {
        class: InlineCodeTool, // Kod parçalarını satır içi eklemek için
        shortcut: "CMD+SHIFT+C",
      },
      quote: {
        class: QuoteTool,
        inlineToolbar: true,
        config: {
          quotePlaceholder: "Enter a quote",
          captionPlaceholder: "Quote's author",
        },
      },
      delimiter: DelimiterTool, // Ayırıcı çizgi eklemek için
      table: {
        class: TableTool,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
        },
      },
      checklist: {
        class: ChecklistTool,
        inlineToolbar: true,
      },
      warning: {
        class: WarningTool,
        inlineToolbar: false,
        config: {
          titlePlaceholder: "Title",
          messagePlaceholder: "Message",
        },
      },
      paragraph: {
        class: ParagraphTool,
        inlineToolbar: true,
      },
    },
    minHeight: "100%",
    data: props.modelValue,
    onReady: modelToView,
    onChange: viewToModel,
  });
});
watch(
  () => props.modelValue,
  () => {
    if (!updatingModel) {
      modelToView();
    }
  }
);
onUnmounted(() => {
  editor.destroy();
});
</script>

<style>
.codex-editor ::selection {
  background-color: #1d202b !important;
}
.ce-toolbar__plus,
.ce-toolbar__settings-btn {
  color: #d4ecff !important;
}
.ce-toolbar__settings-btn:hover,
.ce-toolbar__plus:hover {
  color: #1d202b !important;
}
</style>
