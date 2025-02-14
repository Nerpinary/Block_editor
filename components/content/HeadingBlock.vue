<template>
  <div class="heading-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart($event)" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="$emit('duplicate')" />

    <DeleteBlockButton @delete="$emit('remove')" />

    <div class="block-content">
      <div class="block-header flex items-center justify-between mb-2">
        <div class="block-type text-sm text-gray-500">Заголовок</div>
        <HeadingLevelSelector 
          :value="currentLevel" 
          @input="updateHeadingLevel" />
      </div>

      <FormatToolbar :current-alignment="currentAlignment" :current-color="currentColor" @format-text="formatText"
        @set-alignment="setAlignment" @apply-color="applyColor" />

      <div ref="editor" contenteditable="true"
        class="editor-content w-full p-2 border rounded transition-colors duration-200"
        :class="[
          headingClasses,
          {
            'border-blue-400': dragState.isDragging,
            'border-gray-300': !dragState.isDragging
          }
        ]"
        :style="{ textAlign: currentAlignment, color: currentColor }"
        @input="handleInput"
        @keyup="handleSelection"
        @mouseup="handleSelection"
        :innerHTML="localContent"
        placeholder="Введите заголовок...">
      </div>
    </div>
  </div>
</template>

<script>
import dragdrop from '@/mixins/dragdrop'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import FormatToolbar from '@/components/shared/FormatToolbar.vue'
import HeadingLevelSelector from '@/components/shared/HeadingLevelSelector.vue'
import { HeadingIcon } from '@/components/icons'

export default {
  name: 'HeadingBlock',

  components: {
    DeleteBlockButton,
    BlockControls,
    FormatToolbar,
    HeadingLevelSelector,
    HeadingIcon
  },

  mixins: [dragdrop],

  props: {
    content: {
      type: [String, Object],
      default: () => ({
        text: '',
        level: 1
      })
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
      localContent: '',
      dragState: {
        isDragging: false
      },
      currentLevel: 1
    }
  },

  computed: {
    headingText() {
      if (!this.content) return ''
      return typeof this.content === 'string'
        ? this.content
        : (this.content.text || '')
    },

    headingLevel() {
      if (!this.content) return 1
      return typeof this.content === 'object'
        ? (this.content.level || 1)
        : 1
    },

    headingClasses() {
      const sizes = {
        1: 'text-4xl',
        2: 'text-3xl',
        3: 'text-2xl',
        4: 'text-xl',
        5: 'text-lg',
        6: 'text-base'
      }
      return `font-bold ${sizes[this.currentLevel]}`
    }
  },

  mounted() {
    let content = this.content;
    
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        content = {
          text: content,
          alignment: 'left',
          color: '#1F2937',
          level: 1
        };
      }
    }

    this.currentAlignment = content.alignment || 'left';
    this.currentColor = content.color || '#1F2937';
    this.localContent = content.text || '';
    this.currentLevel = content.level || 1;
    
    if (this.$refs.editor) {
      this.$refs.editor.innerHTML = this.localContent;
    }
  },

  methods: {
    handleMove(direction) {
      const fromIndex = this.index
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
      this.$store.commit('MOVE_BLOCK', { fromIndex, toIndex })
    },

    saveSelection() {
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        this.savedSelection = selection.getRangeAt(0)
      }
    },

    restoreSelection() {
      if (this.savedSelection) {
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(this.savedSelection)
      }
    },

    handleInput(event) {
      this.saveSelection()
      this.localContent = event.target.innerHTML
      this.updateContent()
      this.$nextTick(() => {
        this.restoreSelection()
      })
    },

    formatText(command) {
      this.$refs.editor.focus()
      this.restoreSelection()
      document.execCommand(command, false, null)
      this.saveSelection()
      this.updateContent()
    },

    setAlignment(align) {
      this.currentAlignment = align;
      this.applyTextCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`);
    },

    applyTextCommand(command) {
      this.$refs.editor.focus();
      this.restoreSelection();
      document.execCommand(command, false, null);
      this.saveSelection();
      this.updateContent();
    },

    applyColor(color) {
      this.currentColor = color
      this.$refs.editor.focus()
      this.restoreSelection()
      document.execCommand('foreColor', false, color)
      this.saveSelection()
      this.updateContent()
    },

    updateContent() {
      const content = JSON.stringify({
        text: this.localContent,
        alignment: this.currentAlignment,
        color: this.currentColor,
        level: this.currentLevel
      })
      this.$emit('update:content', content)
    },

    onDragStart(event) {
      const blockData = {
        type: 'Heading',
        index: this.index,
        parentId: this.parentId,
        source: 'editor',
        content: typeof this.content === 'object' ? this.content.text : this.content,
        originalBlock: {
          type: 'Heading',
          content: this.content
        }
      }
      event.dataTransfer.setData('application/json', JSON.stringify(blockData))
    },

    handleSelection() {
      this.saveSelection();
    },

    updateHeadingLevel(level) {
      this.currentLevel = level
      this.updateContent()
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

.heading-block {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.heading-block:not(.is-inside-column) :deep(.block-controls) {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease-in-out;
}

.heading-block:not(.is-inside-column):hover :deep(.block-controls) {
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

.heading-block :deep(.delete-button) {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.heading-block:hover :deep(.delete-button) {
  opacity: 1;
}
</style>