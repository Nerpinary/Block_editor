<template>
  <div 
    class="heading-block relative group"
    :class="{ 'is-dragging': dragState.isDragging }"
    draggable="true"
    @dragstart="onDragStart($event)"
    @dragend="onDragEnd"
  >
    <BlockControls 
      :index="index"
      :is-last="isLast"
      @move="$emit('move', $event)"
      @duplicate="$emit('duplicate')"
    />

    <DeleteBlockButton @delete="$emit('remove-original-block')" />

    <div class="block-content">
      <div class="block-header flex items-center mb-2">
        <div class="block-type text-sm text-gray-500">Заголовок</div>
      </div>
      
      <FormatToolbar
        :current-alignment="currentAlignment"
        :current-color="currentColor"
        @format-text="formatText"
        @set-alignment="setAlignment"
        @apply-color="applyColor"
      />
      
      <div
        ref="editor"
        contenteditable="true"
        class="editor-content text-2xl font-bold w-full p-2 border rounded transition-colors duration-200"
        :class="{ 'border-blue-400': dragState.isDragging }"
        :style="{ textAlign: currentAlignment, color: currentColor }"
        @input="handleInput"
        @keyup="saveSelection"
        @mouseup="saveSelection"
        placeholder="Введите заголовок..."
      ></div>
    </div>
  </div>
</template>

<script>
import dragdrop from '@/mixins/dragdrop'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import FormatToolbar from '@/components/shared/FormatToolbar.vue'
import { HeadingIcon } from '@/components/icons'

export default {
  name: 'HeadingBlock',
  
  components: {
    DeleteBlockButton,
    BlockControls,
    FormatToolbar,
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
      }
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
    }
  },

  mounted() {
    try {
      const parsed = JSON.parse(this.content)
      this.currentAlignment = parsed.alignment || 'left'
      this.currentColor = parsed.color || '#1F2937'
      this.localContent = parsed.text || ''
      this.$refs.editor.innerHTML = this.localContent
    } catch {
      this.$refs.editor.innerHTML = this.content
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
      this.currentAlignment = align
      this.$refs.editor.focus()
      this.restoreSelection()
      document.execCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`, false, null)
      this.saveSelection()
      this.updateContent()
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
        color: this.currentColor
      })
      this.$emit('update:content', content)
    },

    onDragStart(event) {
      const blockData = {
        type: 'Heading',
        index: this.index,
        parentId: this.parentId,
        source: 'editor',
        content: this.content,
        originalBlock: {
          type: 'Heading',
          content: typeof this.content === 'object' 
            ? { ...this.content }
            : { text: this.content, level: 1 }
        }
      }
      event.dataTransfer.setData('application/json', JSON.stringify(blockData))
    },

    onInput(event) {
      this.$emit('update:content', {
        text: event.target.value,
        level: 1
      })
    }
  }
}
</script>

<style scoped>
.heading-block {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Добавляем стили для анимации BlockControls */
.heading-block :deep(.block-controls) {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease-in-out;
}

.heading-block:hover :deep(.block-controls) {
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
</style>