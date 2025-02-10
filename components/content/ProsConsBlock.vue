<template>
  <div class="pros-cons-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="handleDuplicate" />

    <DeleteBlockButton @delete="handleDelete" />

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
import { useBlockActions } from '@/composables/useBlockActions'
import type { ProsConsContent } from '@/types/content'
import type { BlockData } from '@/types/blocks'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import ThumbUpIcon from '@/components/icons/ThumbUpIcon.vue'
import ThumbDownIcon from '@/components/icons/ThumbDownIcon.vue'

interface Props {
  content?: string | ProsConsContent
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
  'update:content': [{ content: ProsConsContent }]
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
const { dragState, onDragStart: startDrag, onDragEnd } = useDragAndDrop()

const localContent = ref<ProsConsContent>({
  pros: '',
  cons: ''
})

const updateContent = () => {
  const safeContent = {
    pros: String(localContent.value.pros),
    cons: String(localContent.value.cons)
  };
  
  emit('update:content', { 
    content: safeContent 
  });
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
  if (!props.content) {
    localContent.value = {
      pros: '',
      cons: ''
    }
    return
  }

  try {
    const content = typeof props.content === 'string' 
      ? JSON.parse(props.content) 
      : props.content
      
    localContent.value = {
      pros: content?.pros || '',
      cons: content?.cons || ''
    }
  } catch (error) {
    console.warn('Failed to parse content:', error)
    localContent.value = {
      pros: '',
      cons: ''
    }
  }
})

watch(() => props.content, (newContent) => {
  if (!newContent) {
    localContent.value = {
      pros: '',
      cons: ''
    }
    return
  }

  try {
    const content = typeof newContent === 'string' 
      ? JSON.parse(newContent) 
      : newContent
      
    if (JSON.stringify(content) !== JSON.stringify(localContent.value)) {
      localContent.value = {
        pros: content?.pros || '',
        cons: content?.cons || ''
      }
    }
  } catch (error) {
    console.warn('Failed to parse content in watcher:', error)
    localContent.value = {
      pros: '',
      cons: ''
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