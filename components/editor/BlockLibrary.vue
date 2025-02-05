<template>
  <div class="w-64 border-r bg-white p-4">
    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 mb-3">Примитивы</h3>
      <div class="space-y-2">
        <BlockLibraryItem v-for="blockType in primitiveBlockTypes" :key="blockType" :type="blockType"
          :icon="getBlockConfig(blockType).icon" :name="getBlockConfig(blockType).name"
          @dragstart="handleDragStart($event, blockType)" @click="addBlock(blockType)" />
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 mb-3">Контент</h3>
      <div class="space-y-2">
        <BlockLibraryItem v-for="blockType in contentBlockTypes" :key="blockType" :type="blockType"
          :icon="getBlockConfig(blockType).icon" :name="getBlockConfig(blockType).name"
          @dragstart="handleDragStart($event, blockType)" @click="addBlock(blockType)" />
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 mb-3">Кастомные блоки</h3>
      <div class="space-y-2">
        <BlockLibraryItem v-for="blockType in customBlockTypes" :key="blockType" :type="blockType"
          :icon="getBlockConfig(blockType).icon" :name="getBlockConfig(blockType).name"
          @dragstart="handleDragStart($event, blockType)" @click="addBlock(blockType)" />
      </div>
    </div>
  </div>
</template>

<script>
import BlockLibraryItem from '@/components/editor/BlockLibraryItem.vue';
import { BLOCK_TYPES, BLOCK_CATEGORIES, getBlockConfig } from '@/constants/blocks'

export default {
  name: 'BlockLibrary',

  data() {
    return {
      BLOCK_TYPES,
      primitiveBlockTypes: [BLOCK_TYPES.TWO_COLUMNS],
      contentBlockTypes: [BLOCK_TYPES.HEADING, BLOCK_TYPES.TEXT, BLOCK_TYPES.IMAGE, BLOCK_TYPES.LIST, BLOCK_TYPES.TABLE],
      customBlockTypes: [BLOCK_TYPES.SPECIFICATIONS, BLOCK_TYPES.PROS_CONS]
    }
  },

  methods: {
    getBlockConfig(type) {
      return getBlockConfig(type) || { icon: 'DefaultIcon', name: 'Неизвестный блок' };
    },

    addBlock(type) {
      console.log('Adding block of type:', type)

      const block = {
        type,
        content: this.getDefaultContent(type)
      }

      this.$store.commit('ADD_BLOCK', block)
    },

    getDefaultContent(type) {
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
        default:
          return ''
      }
    },

    handleDragStart(event, type) {
      const data = this.createDragData(type)
      event.dataTransfer.setData('application/json', JSON.stringify(data))
    },

    createDragData(type) {
      return {
        type,
        content: this.getDefaultContent(type),
        source: 'sidebar'
      }
    }
  },

  components: {
    BlockLibraryItem
  }
}
</script>

<style scoped>
.block-library-item {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.block-library-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.block-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  color: #6B7280;
}

.name {
  font-size: 0.875rem;
  color: #374151;
}
</style>