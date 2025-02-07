<template>
  <div 
    class="heading-block"
    :class="[
      { 'is-dragging': dragState.isDragging },
      { 'is-inside-column': isInsideColumn }
    ]" 
    draggable="true"
    @dragstart="onDragStart" 
    @dragend="onDragEnd"
  >
    <BlockControls 
      v-if="!isInsideColumn" 
      :index="index" 
      :is-last="isLast" 
      @move="handleMove"
      @duplicate="handleDuplicate" 
    />
    <DeleteBlockButton @delete="handleDelete" />

    <div class="heading-content">
      <div class="heading-header">
        <div class="heading-type">Заголовок</div>
        <HeadingLevelSelector 
          v-model="currentLevel"
          @update:modelValue="updateHeadingLevel" 
        />
      </div>

      <FormatToolbar 
        :current-alignment="currentAlignment" 
        :current-color="currentColor" 
        @format-text="formatText"
        @set-alignment="setAlignment" 
        @apply-color="applyColor" 
      />

      <div 
        ref="editorRef" 
        contenteditable="true"
        class="heading-editor"
        :class="[
          headingClasses,
          { 'is-dragging': dragState.isDragging }
        ]"
        :style="editorStyles"
        @input="handleInput"
        @keyup="handleSelection"
        @mouseup="handleSelection"
        :placeholder="'Введите заголовок...'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useEditorStore } from '@/stores/editor'
import type { CSSProperties } from 'vue'
import type { HeadingContent, TextAlign, HeadingLevel } from '@/types/content'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useBlockActions } from '@/composables/useBlockActions'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import FormatToolbar from '@/components/shared/toolbar/FormatToolbar.vue'
import HeadingLevelSelector from '@/components/shared/HeadingLevelSelector.vue'
import type { BlockData, Block } from '@/types/blocks'

interface Props {
  content: string | HeadingContent
  index: number
  isLast: boolean
  parentId: string
  isInsideColumn: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    text: '',
    level: 1 as HeadingLevel,
    alignment: 'left' as TextAlign,
    color: '#1F2937'
  }),
  parentId: 'main-editor',
  isLast: false,
  isInsideColumn: false
})

const emit = defineEmits<{
  'update:content': [{ content: HeadingContent }]
  'remove': []
  'duplicate': []
  'move': [payload: { direction: 'up' | 'down', index: number, parentId: string }]
}>()

const { handleDelete, handleDuplicate, handleMove } = useBlockActions({
  index: props.index,
  parentId: props.parentId,
  emit
})

const store = useEditorStore()
const editorRef = ref<HTMLDivElement | null>(null)

const getInitialContent = (content: string | HeadingContent): HeadingContent => {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content)
    } catch {
      return {
        text: content,
        alignment: 'left',
        color: '#1F2937',
        level: 1
      }
    }
  }
  return content
}

const initialContent = getInitialContent(props.content)
const currentAlignment = ref<TextAlign>(initialContent.alignment)
const currentColor = ref(initialContent.color)
const currentLevel = ref<HeadingLevel>(initialContent.level)
const localContent = ref(initialContent.text)
const savedSelection = ref<Range | null>(null)
const { dragState, onDragStart: startDrag, onDragEnd } = useDragAndDrop()

const headingClasses = computed(() => {
  const sizes: Record<HeadingLevel, string> = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base'
  }
  return `font-bold ${sizes[currentLevel.value]}`
})

const editorStyles = computed((): CSSProperties => ({
  textAlign: currentAlignment.value,
  color: currentColor.value
}))

const saveSelection = () => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0)
  }
}

const restoreSelection = () => {
  if (savedSelection.value) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(savedSelection.value)
    }
  }
}

const handleInput = (event: Event) => {
  if (event.target instanceof HTMLElement) {
    saveSelection()
    localContent.value = event.target.innerHTML
    updateContent()
    nextTick(() => {
      restoreSelection()
    })
  }
}

const formatText = (command: string) => {
  if (!editorRef.value) return
  editorRef.value.focus()
  restoreSelection()
  document.execCommand(command, false)
  saveSelection()
  updateContent()
}

const setAlignment = (align: string) => {
  currentAlignment.value = align as TextAlign
  applyTextCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`)
}

const applyTextCommand = (command: string) => {
  if (!editorRef.value) return
  editorRef.value.focus()
  restoreSelection()
  document.execCommand(command, false)
  saveSelection()
  updateContent()
}

const applyColor = (color: string) => {
  currentColor.value = color
  if (!editorRef.value) return
  editorRef.value.focus()
  restoreSelection()
  document.execCommand('foreColor', false, color)
  saveSelection()
  updateContent()
}

const updateContent = () => {
  const content: HeadingContent = {
    text: localContent.value,
    alignment: currentAlignment.value,
    color: currentColor.value,
    level: currentLevel.value
  }
  
  emit('update:content', { content })
}

const onDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  
  const currentContent: HeadingContent = {
    text: localContent.value,
    alignment: currentAlignment.value,
    color: currentColor.value,
    level: currentLevel.value
  }
    
  const blockData: BlockData = {
    type: 'Heading',
    index: props.index,
    originalIndex: props.index,
    parentId: props.parentId,
    source: 'editor',
    content: { content: currentContent },
    originalBlock: {
      type: 'Heading',
      content: { content: currentContent }
    }
  }

  try {
    const jsonData = JSON.stringify(blockData)
    event.dataTransfer.setData('application/json', jsonData)
    startDrag(event, blockData)
  } catch (error) {
    console.error('Error setting drag data:', error)
  }
}

const handleSelection = () => {
  saveSelection()
}

const updateHeadingLevel = (level: HeadingLevel) => {
  currentLevel.value = level
  updateContent()
}

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = localContent.value
    updateContent()
  }
})
</script>

<style lang="scss" scoped>
.heading {
  &-block {
    @apply relative bg-white rounded-lg p-4 shadow-sm;

    &:not(.is-inside-column) {
      :deep(.block-controls) {
        @apply opacity-0 translate-x-2.5 transition-all duration-200;
      }

      &:hover :deep(.block-controls) {
        @apply opacity-100 translate-x-0;
      }
    }

    &.is-dragging :deep(.heading-editor) {
      @apply border-blue-400;
    }
  }

  &-content {
    @apply w-full;
  }

  &-header {
    @apply flex items-center justify-between mb-2;
  }

  &-type {
    @apply text-sm text-gray-500;
  }

  &-editor {
    @apply w-full p-2 border rounded transition-colors duration-200 min-h-[60px] border-gray-300;

    &:empty:before {
      content: attr(placeholder);
      @apply text-gray-400;
    }

    &:focus {
      @apply border-blue-400 outline-none;
    }
  }
}

:deep(.delete-button) {
  @apply opacity-0 transition-opacity duration-200;
}

:deep(.block-controls-wrapper) {
  @apply z-[1000];
}

.heading-block:hover :deep(.delete-button) {
  @apply opacity-100;
}
</style>