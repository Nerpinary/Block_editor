<template>
  <div class="image-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="handleDuplicate" />

    <DeleteBlockButton @delete="handleDelete" />

    <div class="block-content">
      <div class="block-header flex items-center mb-2">
        <div class="block-type text-sm text-gray-500">Изображение</div>
      </div>

      <div class="image-container relative">
        <div class="min-h-[200px] flex items-center justify-center border-2 border-dashed rounded cursor-pointer"
          :class="{
            'border-gray-300': !imageContent.url,
            'border-blue-400': imageContent.url
          }" @click="triggerFileInput">
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange">
          <template v-if="imageContent.url">
            <img :src="imageContent.url" class="max-w-full max-h-[400px] object-contain" alt="">
          </template>
          <template v-else>
            <div class="text-gray-500">
              Нажмите или перетащите изображение сюда
            </div>
          </template>
        </div>
      </div>

      <input v-if="imageContent.url" :value="imageContent.caption" class="mt-2 w-full border-none bg-transparent"
        placeholder="Подпись к изображению..." @input="updateCaption">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useBlockActions } from '@/composables/useBlockActions'
import type { ImageContent } from '@/types/content'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import type { BlockData } from '@/types/blocks'

interface Props {
  content: string | ImageContent
  index: number
  isLast: boolean
  parentId: string
  isInsideColumn: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    url: '',
    caption: ''
  }),
  parentId: 'main-editor',
  isLast: false,
  isInsideColumn: false
})

const emit = defineEmits<{
  'update:content': [{ content: ImageContent }]
  'remove': []
  'duplicate': []
  'move': [payload: { direction: 'up' | 'down', index: number, parentId: string }]
  'error': [message: string]
}>()

const { handleDelete, handleDuplicate, handleMove } = useBlockActions({
  index: props.index,
  parentId: props.parentId,
  emit
})

const store = useEditorStore()
const fileInput = ref<HTMLInputElement | null>(null)
const { dragState, onDragStart: startDrag, onDragEnd } = useDragAndDrop()

const imageContent = computed<ImageContent>(() => {
  if (typeof props.content === 'string') {
    try {
      return JSON.parse(props.content)
    } catch {
      return { url: '', caption: '' }
    }
  }
  return props.content || { url: '', caption: '' }
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newContent: ImageContent = {
        url: e.target?.result as string,
        caption: imageContent.value.caption || ''
      }

      emit('update:content', { content: newContent })

      if (input) input.value = ''
    }
    reader.onerror = () => {
      console.error('Error reading file:', file)
      emit('error', 'Ошибка при загрузке изображения')
    }
    reader.readAsDataURL(file)
  } else {
    emit('error', 'Пожалуйста, загрузите изображение')
  }
}

const updateCaption = (event: Event) => {
  const input = event.target as HTMLInputElement
  const updatedContent: ImageContent = {
    url: imageContent.value.url,
    caption: input.value
  }
  emit('update:content', { content: updatedContent })
}

const onDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return

  const blockData: BlockData = {
    type: 'Image',
    index: props.index,
    originalIndex: props.index,
    parentId: props.parentId,
    source: 'editor',
    content: imageContent.value,
    originalBlock: {
      type: 'Image',
      content: imageContent.value
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
</script>

<style lang="scss" scoped>
.image-block {
  @apply relative bg-white rounded-lg p-4 shadow-sm;

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

.upload-placeholder {
  @apply cursor-pointer min-h-[200px] flex items-center justify-center;

  &:hover {
    @apply bg-gray-50;
  }
}
</style>