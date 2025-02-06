<template>
  <div class="table-block border rounded p-4 relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart" @dragend="onDragEnd">
    <DeleteBlockButton @delete="emit('remove')" />
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="emit('duplicate')" />

    <div class="block-content">
      <div class="block-header flex items-center justify-between mb-4">
        <div class="block-type text-sm text-gray-500">Таблица</div>
        <div class="flex items-center gap-2">
          <button 
            @click="addColumn"
            class="p-1 text-green-500 hover:text-green-600 transition-colors"
            title="Добавить столбец"
          >
            <PlusIcon :size="5" />
          </button>
          <button 
            v-if="localData && localData[0] && localData[0].length > 2"
            @click="removeColumn"
            class="p-1 text-red-500 hover:text-red-600 transition-colors"
            title="Удалить столбец"
          >
            <MinusIcon :size="5" />
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="w-full border-collapse">
          <tbody>
            <tr v-for="(row, rowIndex) in localData" :key="rowIndex" class="border-b last:border-b-0">
              <td v-for="(cell, colIndex) in row" :key="colIndex" 
                class="p-2 border-r last:border-r-0">
                <input
                  type="text"
                  v-model="localData[rowIndex][colIndex]"
                  class="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
                  placeholder="Введите текст"
                  @input="updateContent"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end mt-4 gap-2">
        <button 
          @click="addRow"
          class="p-1 text-green-500 hover:text-green-600 transition-colors"
          title="Добавить строку"
        >
          <PlusIcon :size="5" />
        </button>
        <button 
          v-if="localData.length > 2"
          @click="removeRow"
          class="p-1 text-red-500 hover:text-red-600 transition-colors"
          title="Удалить строку"
        >
          <MinusIcon :size="5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import type { TableContent } from '@/types/content'
import type { BlockData } from '@/types/blocks'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import MinusIcon from '@/components/icons/MinusIcon.vue'

interface Props {
  content: string | TableContent
  index: number
  isLast: boolean
  parentId: string
  isInsideColumn: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    data: [
      ['', ''],
      ['', '']
    ]
  }),
  parentId: 'main-editor',
  isLast: false,
  isInsideColumn: false
})

const emit = defineEmits<{
  'update:content': [content: TableContent]
  'remove': []
  'duplicate': []
  'move': [payload: { direction: 'up' | 'down', index: number, parentId: string }]
}>()

const store = useEditorStore()
const { dragState, onDragStart: startDrag, onDragEnd } = useDragAndDrop()

const localData = ref<string[][]>([['', ''], ['', '']])

const updateContent = () => {
  emit('update:content', {
    data: localData.value.map(row => [...row])
  })
}

const addRow = () => {
  const newRow = new Array(localData.value[0].length).fill('')
  localData.value = [...localData.value, newRow]
  updateContent()
}

const removeRow = () => {
  if (localData.value.length > 2) {
    localData.value = localData.value.slice(0, -1)
    updateContent()
  }
}

const addColumn = () => {
  localData.value = localData.value.map(row => [...row, ''])
  updateContent()
}

const removeColumn = () => {
  if (localData.value[0].length > 2) {
    localData.value = localData.value.map(row => row.slice(0, -1))
    updateContent()
  }
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
    type: 'Table',
    index: props.index,
    originalIndex: props.index,
    parentId: props.parentId,
    source: 'editor',
    content: { data: localData.value.map(row => [...row]) },
    originalBlock: {
      type: 'Table',
      content: { data: localData.value.map(row => [...row]) }
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
  initializeData()
})

const initializeData = () => {
  const initialContent = typeof props.content === 'string' 
    ? JSON.parse(props.content) as TableContent
    : props.content
    
  localData.value = JSON.parse(JSON.stringify(initialContent.data || [['', ''], ['', '']]))
}

watch(() => props.content, () => {
  initializeData()
}, { deep: true })
</script>

<style lang="scss" scoped>
.table-block {
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

.table-responsive {
  @apply overflow-x-auto;

  table {
    @apply border border-gray-200;
  }

  td {
    @apply border-gray-200;
  }
}
</style> 