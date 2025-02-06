<template>
  <div class="columns-block border rounded p-4 relative group">
    <DeleteBlockButton @delete="emit('remove')" />

    <BlockControls :index="index" :is-last="isLast" @move="handleMove" @duplicate="emit('duplicate')" />

    <div class="flex gap-4">
      <div v-for="(column, columnIndex) in localColumns" :key="`column-${index}-${columnIndex}`" class="flex-1">
        <div class="space-y-4">
          <component 
            v-for="(block, blockIndex) in column"
            :key="`block-${index}-${columnIndex}-${block.id || blockIndex}`" 
            :is="getBlockComponent(block.type)"
            :content="block.content" 
            :index="blockIndex" 
            :parent-id="`column-${columnIndex}`" 
            :is-inside-column="true"
            :is-last="blockIndex === column.length - 1"
            @update:content="updateBlockContent(columnIndex, blockIndex, $event)"
            @remove="removeBlockFromColumn(columnIndex, blockIndex)" 
          />

          <DropZone 
            :key="`dropzone-${index}-${columnIndex}`" 
            :zone-id="`column-${columnIndex}`"
            :placeholder="'Перетащите сюда блок'" 
            class="min-h-[100px]"
            @drop="handleDropIntoColumn($event, columnIndex)" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { BLOCK_TYPES } from '@/constants/blocks'
import type { ColumnsContent } from '@/types/content'
import type { Block, BlockType } from '@/types/blocks'
import type { DropEvent, DropData } from '@/types/drop'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import DropZone from '@/components/ui/DropZone.vue'

interface Props {
  content: ColumnsContent
  index: number
  isLast: boolean
  parentId: string
}

const props = withDefaults(defineProps<Props>(), {
  parentId: 'main-editor',
  isLast: false
})

const emit = defineEmits<{
  'remove': []
  'duplicate': []
  'move': [payload: { direction: 'up' | 'down', index: number }]
}>()

const store = useEditorStore()
const localColumns = ref<Block[][]>([[], []])

const getBlockComponent = (type: string): string => `${type}Block`

const handleDropIntoColumn = (event: DropEvent, columnIndex: number) => {
  const dropData = event.data
  if (!dropData) return
  
  if (dropData.parentId?.startsWith('column-')) {
    const [sourceColumnIndex, sourceBlockIndex] = parseColumnSource(dropData.parentId)
    
    const blockToMove = { ...localColumns.value[sourceColumnIndex][sourceBlockIndex] }
    
    const newColumns = localColumns.value.map(column => [...column])
    newColumns[sourceColumnIndex] = newColumns[sourceColumnIndex]
      .filter((_, index) => index !== sourceBlockIndex)
    
    newColumns[columnIndex] = [...newColumns[columnIndex], blockToMove]
    
    localColumns.value = newColumns
    updateStore()
  } else {
    if (!isValidBlockType(dropData.type)) return

    const blockToAdd: Block = {
      id: dropData.id || Date.now().toString(),
      type: dropData.type as BlockType,
      content: dropData.originalBlock?.content || dropData.content
    }

    const newColumns = localColumns.value.map(column => [...column])
    newColumns[columnIndex] = [...newColumns[columnIndex], blockToAdd]
    
    localColumns.value = newColumns
    updateStore()

    if (dropData.source === 'editor' && dropData.index !== undefined) {
      nextTick(() => {
        store.removeBlock(dropData.index!)
      })
    }
  }
}

const parseColumnSource = (source: string): [number, number] => {
  const match = source.match(/column-(\d+)-block-(\d+)/)
  return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 0]
}

const updateBlockContent = (columnIndex: number, blockIndex: number, newContent: any) => {
  const newColumns = localColumns.value.map(column => [...column])

  if (newColumns[columnIndex][blockIndex]) {
    newColumns[columnIndex][blockIndex] = {
      ...newColumns[columnIndex][blockIndex],
      content: newContent
    }

    localColumns.value = newColumns
    updateStore()
  }
}

const removeBlockFromColumn = (columnIndex: number, blockIndex: number) => {
  const newColumns = localColumns.value.map(column => [...column])
  newColumns[columnIndex] = newColumns[columnIndex].filter((_, index) => index !== blockIndex)
  localColumns.value = newColumns
  updateStore()
}

const handleMove = (direction: 'up' | 'down') => {
  emit('move', {
    direction,
    index: props.index
  })
}

const updateStore = () => {
  const updatedBlock: Block = {
    type: 'Columns',
    content: {
      columns: JSON.parse(JSON.stringify(localColumns.value))
    }
  }

  store.updateBlock({
    index: props.index,
    block: updatedBlock
  })
}

const isValidBlockType = (type: string): type is BlockType => {
  return ['Text', 'Heading', 'Image', 'List', 'Table', 'ProsCons', 'Specifications', 'Column'].includes(type)
}

onMounted(() => {
  localColumns.value = JSON.parse(JSON.stringify(props.content.columns || [[], []]))
})

watch(() => props.content.columns, (newColumns) => {
  localColumns.value = JSON.parse(JSON.stringify(newColumns || [[], []]))
}, { deep: true })
</script>

<style lang="scss" scoped>
.columns-block {
  @apply bg-white rounded-xl p-6 shadow-sm;

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

.column {
  @apply flex-1 min-h-[200px] p-4 bg-gray-50 rounded-lg;
}

.drop-zone {
  :deep(&) {
    @apply my-2 transition-all duration-200;
  }
}

.drop-zone--empty {
  :deep(&) {
    @apply min-h-[100px];
  }
}

.drop-zone__content {
  :deep(&) {
    @apply border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 transition-all duration-200;
  }
}

.drop-zone--drag-over {
  :deep(&) {
    .drop-zone__content {
      @apply border-indigo-600 bg-indigo-50/10 scale-[1.02];
    }
  }
}

.block-enter-active,
.block-leave-active {
  @apply transition-all duration-300;
}

.block-enter-from,
.block-leave-to {
  @apply opacity-0 translate-y-5;
}
</style>