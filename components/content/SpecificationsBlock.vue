<template>
  <div class="specifications-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="handleDuplicate" />

    <DeleteBlockButton @delete="handleDelete" />

    <div class="block-content">
      <div class="block-header flex items-center justify-between mb-4">
        <div class="block-type text-sm text-gray-500">Характеристики</div>
        <div class="controls flex items-center gap-2">
          <button class="control-button" @click="addRow" title="Добавить строку">
            <PlusIcon :size="5" />
          </button>
          <button v-if="localRows.length > 1" class="control-button" @click="removeLastRow"
            title="Удалить последнюю строку">
            <MinusIcon :size="5" />
          </button>
        </div>
      </div>

      <h3 class="text-lg font-semibold mb-4">Основные характеристики</h3>

      <div class="specifications-table">
        <div v-for="(row, index) in localRows" :key="index" class="table-row"
          :class="{ 'bg-gray-50': index % 2 === 0 }">
          <div class="table-cell">
            <input type="text" :value="row.key" class="cell-input" placeholder="Параметр"
              @input="updateRowKey(index, ($event.target as HTMLInputElement).value)">
          </div>
          <div class="table-cell">
            <input type="text" :value="row.value" class="cell-input" placeholder="Значение"
              @input="updateRowValue(index, ($event.target as HTMLInputElement).value)">
          </div>
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
import type { SpecificationsContent, SpecificationRow } from '@/types/content'
import type { BlockData } from '@/types/blocks'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import MinusIcon from '@/components/icons/MinusIcon.vue'

interface Props {
  content: string | SpecificationsContent
  index: number
  isLast: boolean
  parentId: string
  isInsideColumn: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    rows: [
      { key: '', value: '' },
      { key: '', value: '' }
    ]
  }),
  parentId: 'main-editor',
  isLast: false,
  isInsideColumn: false
})

const emit = defineEmits<{
  'update:content': [{ content: SpecificationsContent }]
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

const localRows = ref<SpecificationRow[]>([])

const initializeContent = (content: string | SpecificationsContent): SpecificationsContent => {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content) as SpecificationsContent
    } catch (e) {
      return {
        rows: [
          { key: '', value: '' },
          { key: '', value: '' }
        ]
      }
    }
  }
  return content
}

const updateContent = () => {
  emit('update:content', { content: { rows: localRows.value } })
}

const addRow = () => {
  localRows.value = [...localRows.value, { key: '', value: '' }]
  updateContent()
}

const removeLastRow = () => {
  if (localRows.value.length > 1) {
    localRows.value = localRows.value.slice(0, -1)
    updateContent()
  }
}

const updateRowKey = (index: number, newKey: string) => {
  localRows.value = localRows.value.map((row, i) =>
    i === index ? { ...row, key: newKey } : row
  )
  updateContent()
}

const updateRowValue = (index: number, newValue: string) => {
  localRows.value = localRows.value.map((row, i) =>
    i === index ? { ...row, value: newValue } : row
  )
  updateContent()
}

const onDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return

  const blockData: BlockData = {
    type: 'Specifications',
    index: props.index,
    originalIndex: props.index,
    parentId: props.parentId,
    source: 'editor',
    content: { rows: [...localRows.value] },
    originalBlock: {
      type: 'Specifications',
      content: { rows: [...localRows.value] }
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
  const content = initializeContent(props.content)
  localRows.value = content.rows.map(row => ({ ...row }))
})

watch(() => props.content, (newContent) => {
  const content = initializeContent(newContent)

  if (JSON.stringify(content.rows) !== JSON.stringify(localRows.value)) {
    localRows.value = content.rows.map(row => ({ ...row }))
  }
}, { deep: true })
</script>

<style lang="scss" scoped>
.specifications-block {
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

.control-button {
  @apply p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors;
}

.specifications-table {
  @apply border border-gray-200 rounded-lg overflow-hidden;

  .table-row {
    @apply flex border-b last:border-b-0;
  }

  .table-cell {
    @apply flex-1 p-2 border-r last:border-r-0;
  }

  .cell-input {
    @apply w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1;
  }
}
</style>