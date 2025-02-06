<template>
  <div class="pros-cons-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="emit('duplicate')" />

    <DeleteBlockButton @delete="emit('remove')" />

    <div class="block-content">
      <div class="block-header flex items-center justify-between mb-4">
        <div class="block-type text-sm text-gray-500">Плюсы и минусы</div>
      </div>

      <h3 class="text-lg font-semibold mb-4">Плюсы и минусы</h3>

      <div class="space-y-4">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-6 h-6 text-green-500 mt-1">
            <ThumbUpIcon :size="6" />
          </div>
          <input
            type="text"
            v-model="localContent.pros"
            class="flex-grow bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
            placeholder="Введите преимущества"
            @input="updateContent"
          >
        </div>

        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-6 h-6 text-red-500 mt-1">
            <ThumbDownIcon :size="6" />
          </div>
          <input
            type="text"
            v-model="localContent.cons"
            class="flex-grow bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
            placeholder="Введите недостатки"
            @input="updateContent"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import type { ProsConsContent } from '@/types/content'
import type { BlockData } from '@/types/blocks'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import ThumbUpIcon from '@/components/icons/ThumbUpIcon.vue'
import ThumbDownIcon from '@/components/icons/ThumbDownIcon.vue'

interface Props {
  content: string | ProsConsContent
  index: number
  isLast: boolean
  parentId: string
  isInsideColumn: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    pros: '',
    cons: ''
  }),
  parentId: 'main-editor',
  isLast: false,
  isInsideColumn: false
})

const emit = defineEmits<{
  'update:content': [content: ProsConsContent]
  'remove': []
  'duplicate': []
  'move': [payload: { direction: 'up' | 'down', index: number, parentId: string }]
}>()

const store = useEditorStore()
const { dragState, onDragStart: startDrag, onDragEnd } = useDragAndDrop()

const localContent = ref<ProsConsContent>({
  pros: '',
  cons: ''
})

const updateContent = () => {
  emit('update:content', { ...localContent.value })
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
    type: 'ProsCons',
    index: props.index,
    originalIndex: props.index,
    parentId: props.parentId,
    source: 'editor',
    content: localContent.value,
    originalBlock: {
      type: 'ProsCons',
      content: localContent.value
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

onMounted(() => {
  const content = typeof props.content === 'string' 
    ? JSON.parse(props.content) 
    : props.content
    
  localContent.value = {
    pros: content.pros || '',
    cons: content.cons || ''
  }
})

watch(() => props.content, (newContent) => {
  const content = typeof newContent === 'string' 
    ? JSON.parse(newContent) 
    : newContent
    
  if (JSON.stringify(content) !== JSON.stringify(localContent.value)) {
    localContent.value = {
      pros: content.pros || '',
      cons: content.cons || ''
    }
  }
}, { deep: true })
</script>

<style lang="scss" scoped>
.pros-cons-block {
  @apply bg-white rounded-lg shadow-sm p-4;

  :deep(.block-controls),
  :deep(.delete-button) {
    @apply opacity-0 transition-opacity duration-200;
  }

  &:hover {
    :deep(.block-controls),
    :deep(.delete-button) {
      @apply opacity-100;
    }
  }
}
</style> 