<template>
  <div class="list-block border rounded p-4 relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart" @dragend="onDragEnd">
    <DeleteBlockButton @delete="handleDelete" />
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="handleDuplicate" />

    <div class="block-content">
      <div class="block-header flex items-center justify-between mb-4">
        <div class="block-type text-sm text-gray-500">Список</div>
      </div>

      <div class="space-y-3">
        <div v-for="(item, idx) in localItems" :key="idx" class="flex items-center gap-2">
          <div class="flex-grow">
            <input
              type="text"
              v-model="item.text"
              class="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
              placeholder="Введите текст"
              @input="updateContent"
            >
          </div>
          <div class="flex items-center gap-2">
            <button 
              v-if="localItems.length > 2"
              @click="removeItem(idx)"
              class="p-1 text-red-500 hover:text-red-600 transition-colors"
              title="Удалить пункт"
            >
              <MinusIcon :size="5" />
            </button>
            <button 
              v-if="idx === localItems.length - 1"
              @click="addItem"
              class="p-1 text-green-500 hover:text-green-600 transition-colors"
              title="Добавить пункт"
            >
              <PlusIcon :size="5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useBlockActions } from '@/composables/useBlockActions'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import MinusIcon from '@/components/icons/MinusIcon.vue'
import type { ListContent, ListItem } from '@/types/content'
import type { BlockData } from '@/types/blocks'

interface Props {
  content: string | ListContent
  index: number
  isLast: boolean
  parentId: string
  isInsideColumn: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    items: [
      { text: '' },
      { text: '' }
    ]
  }),
  parentId: 'main-editor',
  isLast: false,
  isInsideColumn: false
})

const emit = defineEmits<{
  'update:content': [{ content: ListContent }]
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

const localItems = ref<ListItem[]>([])

const initializeItems = () => {
  const initialContent = typeof props.content === 'string' 
    ? { items: [{ text: '' }, { text: '' }] } 
    : props.content
  localItems.value = JSON.parse(JSON.stringify(initialContent.items || [{ text: '' }, { text: '' }]))
}

const updateContent = () => {
  const newItems = localItems.value.map(item => ({ ...item }))
  emit('update:content', { content: { items: newItems } })
}

const addItem = () => {
  localItems.value = [...localItems.value, { text: '' }]
  updateContent()
}

const removeItem = (index: number) => {
  if (localItems.value.length > 2) {
    localItems.value = localItems.value.filter((_, idx) => idx !== index)
    updateContent()
  }
}

const onDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  
  const blockData: BlockData = {
    type: 'List',
    index: props.index,
    originalIndex: props.index,
    parentId: props.parentId,
    source: 'editor',
    content: {
      items: localItems.value
    },
    originalBlock: {
      type: 'List',
      content: {
        items: localItems.value
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

watch(() => props.content, (newContent) => {
  const items = typeof newContent === 'string' 
    ? JSON.parse(newContent).items 
    : newContent.items
    
  if (items && JSON.stringify(items) !== JSON.stringify(localItems.value)) {
    localItems.value = JSON.parse(JSON.stringify(items))
  }
}, { deep: true })

initializeItems()
</script>

<style lang="scss" scoped>
.list-block {
  @apply bg-white rounded-xl shadow-sm;

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