<template>
  <div class="text-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="emit('duplicate')" />

    <DeleteBlockButton @delete="emit('remove')" />

    <div class="block-content">
      <div class="block-header flex items-center mb-2">
        <div class="block-type text-sm text-gray-500">Текстовый блок</div>
      </div>

      <FormatToolbar 
        :current-alignment="currentAlignment" 
        :current-color="currentColor" 
        @format-text="formatText"
        @set-alignment="setAlignment" 
        @apply-color="applyColor" />

      <div ref="editorRef" contenteditable="true"
        class="editor-content w-full p-2 border rounded transition-colors duration-200"
        :class="{ 'border-blue-400': dragState.isDragging }"
        :style="editorStyles"
        @input="handleInput"
        @keyup="handleSelection"
        @mouseup="handleSelection"
        placeholder="Введите текст...">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import type { TextContent, TextAlign } from '@/types/content'
import type { BlockData } from '@/types/blocks'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import FormatToolbar from '@/components/shared/toolbar/FormatToolbar.vue'
import type { CSSProperties } from 'vue'

interface Props {
  content: string | TextContent
  index: number
  isLast: boolean
  parentId: string
  isInsideColumn: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    text: '',
    alignment: 'left' as TextAlign,
    color: '#1F2937'
  }),
  parentId: 'main-editor',
  isLast: false,
  isInsideColumn: false
})

const emit = defineEmits<{
  'update:content': [content: TextContent]
  'remove': []
  'duplicate': []
  'move': [payload: { direction: 'up' | 'down', index: number, parentId: string }]
}>()

const store = useEditorStore()
const { dragState, onDragStart: startDrag, onDragEnd } = useDragAndDrop()

const editorRef = ref<HTMLDivElement>()

const currentAlignment = ref<TextAlign>('left')
const currentColor = ref('#1F2937')
const savedSelection = ref<Range | null>(null)

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
  if (savedSelection.value && editorRef.value) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(savedSelection.value)
    }
  }
}

const handleInput = (event: Event) => {
  if (!editorRef.value) return
  
  const target = event.target as HTMLDivElement
  const selection = window.getSelection()
  if (!selection) return

  const range = selection.getRangeAt(0)
  const start = range.startOffset
  const end = range.endOffset

  const updatedContent: TextContent = {
    text: target.innerHTML,
    alignment: currentAlignment.value,
    color: currentColor.value
  }
  
  emit('update:content', updatedContent)

  nextTick(() => {
    if (!selection.anchorNode) return
    const newRange = document.createRange()
    newRange.setStart(selection.anchorNode, start)
    newRange.setEnd(selection.anchorNode, end)
    selection.removeAllRanges()
    selection.addRange(newRange)
  })
}

const formatText = (command: string) => {
  applyTextCommand(command)
}

const setAlignment = (align: string) => {
  currentAlignment.value = align as TextAlign
  applyTextCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`)
}

const applyColor = (color: string) => {
  currentColor.value = color
  applyTextCommand('foreColor', color)
}

const applyTextCommand = (command: string, value?: string) => {
  if (!editorRef.value) return
  
  editorRef.value.focus()
  restoreSelection()
  document.execCommand(command, false, value)
  saveSelection()
}

const handleMove = (direction: 'up' | 'down') => {
  emit('move', {
    direction,
    index: props.index,
    parentId: props.parentId
  })
}

const onDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  
  const blockData: BlockData = {
    type: 'Text',
    index: props.index,
    originalIndex: props.index,
    parentId: props.parentId,
    source: 'editor',
    content: {
      text: editorRef.value?.innerHTML || '',
      alignment: currentAlignment.value,
      color: currentColor.value
    },
    originalBlock: {
      type: 'Text',
      content: {
        text: editorRef.value?.innerHTML || '',
        alignment: currentAlignment.value,
        color: currentColor.value
      }
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

onMounted(() => {
  if (!editorRef.value) return
  
  if (typeof props.content === 'string') {
    editorRef.value.innerHTML = props.content
  } else {
    editorRef.value.innerHTML = props.content.text || ''
    currentAlignment.value = props.content.alignment || 'left'
    currentColor.value = props.content.color || '#1F2937'
  }
})

watch(() => props.content, (newContent) => {
  if (!editorRef.value || editorRef.value.matches(':focus')) return
  
  if (typeof newContent === 'string') {
    editorRef.value.innerHTML = newContent
  } else {
    editorRef.value.innerHTML = newContent.text || ''
    currentAlignment.value = newContent.alignment || 'left'
    currentColor.value = newContent.color || '#1F2937'
  }
}, { deep: true })
</script>

<style lang="scss" scoped>
.text-block {
  @apply bg-white rounded-lg shadow-sm p-4;

  &:not(.is-inside-column) {
    :deep(.block-controls) {
      @apply opacity-0 translate-x-2.5 transition-all duration-200;
    }

    &:hover :deep(.block-controls) {
      @apply opacity-100 translate-x-0;
    }
  }

  :deep(.delete-button) {
    @apply opacity-0 transition-opacity duration-200;
  }

  &:hover :deep(.delete-button) {
    @apply opacity-100;
  }
}

.editor-content {
  @apply min-h-[60px];

  &:empty:before {
    content: attr(placeholder);
    @apply text-gray-400;
  }

  &:focus {
    @apply border-blue-400 outline-none;
  }
}
</style>