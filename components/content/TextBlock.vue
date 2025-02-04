<template>
  <div class="text-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart($event)" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="$emit('duplicate')" />

    <DeleteBlockButton @delete="$emit('remove')" />

    <div class="block-content">
      <div class="block-header flex items-center mb-2">
        <div class="block-type text-sm text-gray-500">Текстовый блок</div>
      </div>

      <FormatToolbar :current-alignment="currentAlignment" :current-color="currentColor" @format-text="formatText"
        @set-alignment="setAlignment" @apply-color="applyColor" />

      <div ref="editor" contenteditable="true"
        class="editor-content w-full p-2 border rounded transition-colors duration-200"
        :class="{ 'border-blue-400': dragState.isDragging }"
        :style="{ textAlign: currentAlignment, color: currentColor }" @input="handleInput"
        placeholder="Введите текст..."></div>
    </div>
  </div>
</template>

<script>
import dragdrop from '@/mixins/dragdrop'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import FormatToolbar from '@/components/shared/FormatToolbar.vue'

export default {
  name: 'TextBlock',

  components: {
    DeleteBlockButton,
    BlockControls,
    FormatToolbar
  },

  mixins: [dragdrop],

  props: {
    content: {
      type: [String, Object],
      default: ''
    },
    index: {
      type: Number,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: 'main-editor'
    },
    isInsideColumn: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentAlignment: 'left',
      currentColor: '#1F2937',
      savedSelection: null,
      dragState: {
        isDragging: false
      }
    }
  },

  mounted() {
    if (typeof this.content === 'string') {
      this.$refs.editor.innerHTML = this.content;
    } else if (typeof this.content === 'object') {
      this.$refs.editor.innerHTML = this.content.text || '';
      this.currentAlignment = this.content.alignment || 'left';
      this.currentColor = this.content.color || '#1F2937';
    }
  },

  methods: {
    handleMove(direction) {
      const fromIndex = this.index
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
      this.$store.commit('MOVE_BLOCK', { fromIndex, toIndex })
    },

    removeBlock() {
      this.$emit('remove-original-block', {
        parentId: this.parentId,
        index: this.index
      })
    },

    saveSelection() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        this.savedSelection = selection.getRangeAt(0);
      }
    },

    restoreSelection() {
      if (this.savedSelection) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.savedSelection);
      }
    },

    handleInput(event) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const start = range.startOffset;
      const end = range.endOffset;

      const updatedContent = {
        text: event.target.innerHTML,
        alignment: this.currentAlignment,
        color: this.currentColor
      };
      
      this.$emit('update:content', updatedContent);

      this.$nextTick(() => {
        const newRange = document.createRange();
        newRange.setStart(selection.anchorNode, start);
        newRange.setEnd(selection.anchorNode, end);
        selection.removeAllRanges();
        selection.addRange(newRange);
      });
    },

    formatText(command) {
      this.applyTextCommand(command);
    },

    setAlignment(align) {
      this.currentAlignment = align;
      this.applyTextCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`);
    },

    applyColor(color) {
      this.currentColor = color;
      this.applyTextCommand('foreColor', color);
    },

    applyTextCommand(command) {
      this.$refs.editor.focus();
      this.restoreSelection();
      document.execCommand(command, false, null);
      this.saveSelection();
    },

    onDragStart(event) {
      const blockData = {
        type: 'Text',
        index: this.index,
        parentId: this.parentId,
        source: 'editor',
        content: this.content,
        originalBlock: {
          type: 'Text',
          content: this.content
        }
      }
      event.dataTransfer.setData('application/json', JSON.stringify(blockData))
    },

    handleSelection() {
      this.saveSelection();
    }
  },

  watch: {
    content: {
      handler(newContent) {
        if (this.$refs.editor && !this.$refs.editor.matches(':focus')) {
          // Обновляем DOM только если элемент не в фокусе
          if (typeof newContent === 'string') {
            this.$refs.editor.innerHTML = newContent;
          } else if (typeof newContent === 'object') {
            this.$refs.editor.innerHTML = newContent.text || '';
            this.currentAlignment = newContent.alignment || 'left';
            this.currentColor = newContent.color || '#1F2937';
          }
        }
      },
      deep: true
    }
  },

  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event)
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>

.heading-block, .text-block, .image-block {
  position: relative;
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.block-controls-wrapper) {
  z-index: 1000 !important;
}

.text-block {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.text-block:not(.is-inside-column) :deep(.block-controls) {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease-in-out;
}

.text-block:not(.is-inside-column):hover :deep(.block-controls) {
  opacity: 1;
  transform: translateX(0);
}

.editor-content {
  min-height: 60px;
}

.editor-content:empty:before {
  content: attr(placeholder);
  color: #9CA3AF;
}

.editor-content:focus {
  @apply border-blue-400;
  outline: none;
}

.text-block :deep(.delete-button) {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.text-block:hover :deep(.delete-button) {
  opacity: 1;
}
</style>