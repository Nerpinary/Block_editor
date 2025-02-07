<template>
  <div class="w-64 border-r bg-white p-4">
    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 mb-3">Примитивы</h3>
      <div class="space-y-2">
        <BlockLibraryItem 
          v-for="blockType in primitiveBlockTypes" 
          :key="blockType" 
          :type="blockType"
          :icon="getBlockConfig(blockType).icon" 
          :name="getBlockConfig(blockType).name"
          @dragstart="handleDragStart($event, blockType)" 
          @click="addBlock(blockType)" 
        />
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 mb-3">Контент</h3>
      <div class="space-y-2">
        <BlockLibraryItem 
          v-for="blockType in contentBlockTypes" 
          :key="blockType" 
          :type="blockType"
          :icon="getBlockConfig(blockType).icon" 
          :name="getBlockConfig(blockType).name"
          @dragstart="handleDragStart($event, blockType)" 
          @click="addBlock(blockType)" 
        />
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 mb-3">Кастомные блоки</h3>
      <div class="space-y-2">
        <BlockLibraryItem 
          v-for="blockType in customBlockTypes" 
          :key="blockType" 
          :type="blockType"
          :icon="getBlockConfig(blockType).icon" 
          :name="getBlockConfig(blockType).name"
          @dragstart="handleDragStart($event, blockType)" 
          @click="addBlock(blockType)" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { getBlockConfig } from '@/constants/blocks'
import { BLOCK_TYPES } from '@/constants/blockTypes'
import BlockLibraryItem from './BlockLibraryItem.vue'
import type { BlockType, Block } from '@/types/blocks'

const store = useEditorStore()

const primitiveBlockTypes = ref<BlockType[]>([BLOCK_TYPES.TWO_COLUMNS])
const contentBlockTypes = ref<BlockType[]>([
  BLOCK_TYPES.HEADING, 
  BLOCK_TYPES.TEXT, 
  BLOCK_TYPES.IMAGE, 
  BLOCK_TYPES.LIST, 
  BLOCK_TYPES.TABLE
])
const customBlockTypes = ref<BlockType[]>([
  BLOCK_TYPES.SPECIFICATIONS, 
  BLOCK_TYPES.PROS_CONS
])

const getDefaultContent = (type: BlockType): any => {
  switch (type) {
    case BLOCK_TYPES.TWO_COLUMNS:
      return { columns: [[], []] }
    case BLOCK_TYPES.SPECIFICATIONS:
      return {
        rows: [
          { key: '', value: '' },
          { key: '', value: '' }
        ]
      }
    case BLOCK_TYPES.LIST:
      return {
        items: [
          { text: '' },
          { text: '' }
        ]
      }
    case BLOCK_TYPES.TABLE:
      return {
        data: [
          ['', ''],
          ['', '']
        ]
      }
    default:
      return ''
  }
}

const addBlock = (type: BlockType) => {
  const block: Block = {
    type,
    content: getDefaultContent(type),
    parentId: '',
    id: Date.now()
  }
  store.addBlock(block)
}

const handleDragStart = (event: DragEvent, type: BlockType) => {
  if (!event.dataTransfer) return

  const data = {
    type,
    content: getDefaultContent(type),
    source: 'sidebar'
  }
  
  event.dataTransfer.setData('application/json', JSON.stringify(data))
}
</script>

<style lang="scss" scoped>
.block-library-item {
  @apply cursor-pointer p-2 rounded-md transition-colors duration-200;

  &:hover {
    @apply bg-gray-50;
  }
}

.block-content {
  @apply flex items-center gap-2;
}

.icon {
  @apply text-gray-500;
}

.name {
  @apply text-sm text-gray-700;
}
</style>