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
  </div>
</template>

<script>
import BlockLibraryItem from '@/components/editor/BlockLibraryItem.vue';
import { BLOCK_TYPES, getBlockConfig } from '@/constants/blocks'

export default {
  name: 'BlockLibrary',

  data() {
    return {
      BLOCK_TYPES,
      primitiveBlockTypes: [BLOCK_TYPES.TWO_COLUMNS],
      contentBlockTypes: [BLOCK_TYPES.TEXT, BLOCK_TYPES.HEADING, BLOCK_TYPES.IMAGE]
    }
  },

  methods: {
    getBlockConfig(type) {
      const configs = {
        [BLOCK_TYPES.TEXT]: { icon: 'TextIcon', name: 'Текст' },
        [BLOCK_TYPES.HEADING]: { icon: 'HeadingIcon', name: 'Заголовок' },
        [BLOCK_TYPES.IMAGE]: { icon: 'ImageIcon', name: 'Изображение' },
        [BLOCK_TYPES.TWO_COLUMNS]: { icon: 'ColumnsIcon', name: 'Колонки' },
      };
      return configs[type] || { icon: 'DefaultIcon', name: 'Неизвестный блок' };
    },
    addBlock(type) {
      console.log('Adding block of type:', type)

      const block = {
        type,
        content: type === BLOCK_TYPES.TWO_COLUMNS ? { columns: [[], []] } : ''
      }

      this.$store.commit('ADD_BLOCK', block)
    },
    handleDragStart(event, type) {
      const data = this.createDragData(type)
      event.dataTransfer.setData('application/json', JSON.stringify(data))
    },
    createDragData(type) {
      return {
        type,
        content: type === BLOCK_TYPES.TWO_COLUMNS ? { columns: [[], []] } : '',
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