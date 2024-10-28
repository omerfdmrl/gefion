<template>
  <div>
    <div class="flex flex-wrap">
      <button
        @click="applyBold"
        :class="{ active: currentElementStyle.includes('bold') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        <font-awesome-icon :icon="['fas', 'bold']" />
      </button>
      <button
        @click="applyItalic"
        :class="{ active: currentElementStyle.includes('italic') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        <font-awesome-icon :icon="['fas', 'italic']" />
      </button>

      <div class="dropdown mb-3 mr-3">
        <button
          class="btn btn-outline-secondary dropdown-toggle"
          :class="{ active: currentElementStyle.includes('heading') }"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          @click.stop="toggleDropdown"
        >
          Heading
        </button>
        <ul class="dropdown-menu">
          <li>
            <button class="dropdown-item" @click="applyHeading('')">
              Pharagraph
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="applyHeading('h1')">
              Heading 1
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="applyHeading('h2')">
              Heading 2
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="applyHeading('h3')">
              Heading 3
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="applyHeading('h4')">
              Heading 4
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="applyHeading('h5')">
              Heading 5
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="applyHeading('h6')">
              Heading 6
            </button>
          </li>
        </ul>
      </div>

      <button
        @click="applyUl"
        :class="{ active: currentElementStyle.includes('list-ul') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        <font-awesome-icon :icon="['fas', 'list-ul']" />
      </button>
      <button
        @click="applyOl"
        :class="{ active: currentElementStyle.includes('list-ol') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        <font-awesome-icon :icon="['fas', 'list-ol']" />
      </button>
      <button
        @click="applyAlignLeft"
        :class="{ active: currentElementStyle.includes('align-left') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        Align Left
      </button>
      <button
        @click="applyAlignCenter"
        :class="{ active: currentElementStyle.includes('align-center') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        Align Center
      </button>
      <button
        @click="applyAlignRight"
        :class="{ active: currentElementStyle.includes('align-right') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        Align Right
      </button>
      <button
        @click="highlightText"
        :class="{ active: currentElementStyle.includes('highlight') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        Highlight
      </button>
      <button
        @click="openTableDialog"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        Insert Table
      </button>
      <button
        @click="undo"
        :class="{ active: currentElementStyle.includes('undo') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        <font-awesome-icon :icon="['fas', 'undo']" />
      </button>
      <button
        @click="redo"
        :class="{ active: currentElementStyle.includes('redo') }"
        class="btn btn-outline-secondary rounded-lg px-3 py-1 mb-3 mr-3"
      >
        <font-awesome-icon :icon="['fas', 'redo']" />
      </button>
    </div>

    <div v-if="showTableDialog" class="table-dialog">
      <div>
        <label for="rows">Rows:</label>
        <input type="number" id="rows" v-model="tableRows" min="1" max="10" />
        <label for="cols">Columns:</label>
        <input type="number" id="cols" v-model="tableCols" min="1" max="10" />
        <button @click="insertTable">Create Table</button>
        <button @click="closeTableDialog">Cancel</button>
      </div>
    </div>

    <div
      v-if="showBubble"
      :style="bubbleStyle"
      class="bubble bg-white border rounded shadow p-2"
    >
      <button
        @click="applyBold"
        class="btn btn-outline-secondary"
        :class="{ active: currentElementStyle.includes('bold') }"
      >
        Bold
      </button>
      <button
        @click="applyItalic"
        class="btn btn-outline-secondary"
        :class="{ active: currentElementStyle.includes('italic') }"
      >
        Italic
      </button>
      <button
        @click="applyHeading"
        class="btn btn-outline-secondary"
        :class="{ active: currentElementStyle.includes('heading') }"
      >
        Heading
      </button>
      <!-- Diğer butonlar burada -->
    </div>

    <div
      @input="onInput"
      v-html="innerValue"
      v-once
      @mouseup="checkSelection"
      contenteditable="true"
      class="form-control border border-secondary p-4 rounded"
      style="outline: none"
      ref="editor"
    ></div>
  </div>
</template>

<script>
export default {
  name: "WysiwygEditor",

  props: {
    html: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      innerValue: this.html,
      showBubble: false,
      bubbleStyle: {},
      currentElementStyle: [],
      showTableDialog: false,
      tableRows: 2,
      tableCols: 2,
      intervalId: null,
    };
  },
  watch: {
    html(newValue) {
      if (newValue === this.innerValue) return;
      this.$refs.editor.innerHTML = newValue;
      this.innerValue = newValue;
    },
  },
  mounted() {
    this.startSelectionWatcher();
  },
  unmounted() {
    clearInterval(this.intervalId);
  },
  methods: {
    startSelectionWatcher() {
      this.intervalId = setInterval(() => {
        this.checkSelection();
      }, 100);
    },
    toggleDropdown() {
      const selection = window.getSelection();
      if (selection.toString().length === 0) {
        this.showBubble = false;
      }
    },
    checkSelection() {
      const selection = window.getSelection();

      if (selection.toString().length > 0) {
        this.showBubble = true;

        const range = selection.getRangeAt(0).getBoundingClientRect();

        this.bubbleStyle = {
          top: `${window.scrollY + range.top - 50}px`,
          left: `${window.scrollX + range.left}px`,
        };

        var selectedNode = selection.anchorNode.parentElement;
        if (selectedNode.children.length > 0)
          selectedNode = selectedNode.children[0];

        const computedStyle = window.getComputedStyle(selectedNode);

        this.currentElementStyle = [];

        if (
          computedStyle.fontWeight === "700" ||
          computedStyle.fontWeight === "bold"
        ) {
          this.currentElementStyle.push("bold");
        }
        if (computedStyle.fontStyle === "italic") {
          this.currentElementStyle.push("italic");
        }
        if (/h[1-6]/.test(selectedNode.tagName.toLowerCase())) {
          this.currentElementStyle.push("heading");
        }
        if (this.checkListType(selectedNode, "ul")) {
          this.currentElementStyle.push("list-ul");
        }
        if (this.checkListType(selectedNode, "ol")) {
          this.currentElementStyle.push("list-ol");
        }

        const textAlign = computedStyle.textAlign;

        if (textAlign === "left" || textAlign === "-moz-left") {
          this.currentElementStyle.push("align-left");
        } else if (textAlign === "right" || textAlign === "-moz-right") {
          this.currentElementStyle.push("align-right");
        } else if (textAlign === "center" || textAlign === "-moz-center") {
          this.currentElementStyle.push("align-center");
        }

        if (computedStyle.backgroundColor == "rgb(255, 255, 0)") {
          this.currentElementStyle.push("highlight");
        }
      } else {
        this.showBubble = false;
        this.currentElementStyle = [];
      }
    },
    checkListType(node, listType) {
      while (node) {
        if (node.tagName && node.tagName.toLowerCase() === listType) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    },
    onInput(event) {
      this.innerValue = event.target.innerHTML;
      this.$emit("update:html", this.innerValue);
      this.$emit("change", this.innerValue);
    },

    applyBold() {
      document.execCommand("bold");
      this.checkSelection();
    },
    applyItalic() {
      document.execCommand("italic");
      this.checkSelection();
    },
    applyHeading(level) {
      if (level) {
        document.execCommand("formatBlock", false, level);
      } else {
        document.execCommand("formatBlock", false, "p");
      }
      this.checkSelection();
    },
    applyUl() {
      document.execCommand("insertUnorderedList");
      this.checkSelection();
      this.showBubble = false;
    },
    applyOl() {
      document.execCommand("insertOrderedList");
      this.checkSelection();
      this.showBubble = false;
    },
    applyAlignLeft() {
      document.execCommand("justifyLeft");
      this.checkSelection();
    },
    applyAlignCenter() {
      document.execCommand("justifyCenter");
      this.checkSelection();
    },
    applyAlignRight() {
      document.execCommand("justifyRight");
      this.checkSelection();
    },
    highlightText() {
      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText.length > 0) {
          var parent = range.startContainer.parentElement;
          const computedStyle = window.getComputedStyle(parent);

          if (computedStyle.backgroundColor === "rgb(255, 255, 0)") {
            document.execCommand("removeFormat");
          } else {
            document.execCommand("backColor", false, "yellow");
          }
          this.checkSelection();
        }
      }
    },
    openTableDialog() {
      this.showTableDialog = true;
    },
    closeTableDialog() {
      this.showTableDialog = false;
    },
    insertTable() {
      const rows = this.tableRows;
      const cols = this.tableCols;
      if (rows > 0 && cols > 0) {
        let tableHTML =
          "<table style='width:100%; border-collapse: collapse;'>";
        for (let i = 0; i < rows; i++) {
          tableHTML += "<tr>";
          for (let j = 0; j < cols; j++) {
            tableHTML +=
              "<td style='border: 1px solid black; padding: 8px;'></td>";
          }
          tableHTML += "</tr>";
        }
        tableHTML += "</table>";
        document.execCommand("insertHTML", false, tableHTML);
      }
      this.closeTableDialog();
    },
    undo() {
      document.execCommand("undo");
    },
    redo() {
      document.execCommand("redo");
    },
  },
};
</script>

<style scoped>
.table-dialog {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.bubble {
  position: absolute;
  z-index: 1000;
}
</style>
