<template>
  <div class="w-64 border-r bg-white p-4">
    <!-- Примитивы -->
    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 mb-3">Примитивы</h3>
      <div class="space-y-2">
        <!-- Блок с колонками -->
        <div
          class="block-library-item"
          draggable="true"
          @dragstart="handleDragStart($event, 'Columns')"
          @click="addBlock('Columns')"
        >
          <div class="block-content">
            <component :is="getBlockConfig('Columns').icon" class="icon" />
            <span class="name">Колонки</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Контент -->
    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 mb-3">Контент</h3>
      <div class="space-y-2">
        <!-- Текстовый блок -->
        <div
          class="block-library-item"
          draggable="true"
          @dragstart="handleDragStart($event, 'Text')"
          @click="addBlock('Text')"
        >
          <div class="block-content">
            <component :is="getBlockConfig('Text').icon" class="icon" />
            <span class="name">Текст</span>
          </div>
        </div>

        <!-- Заголовок -->
        <div
          class="block-library-item"
          draggable="true"
          @dragstart="handleDragStart($event, 'Heading')"
          @click="addBlock('Heading')"
        >
          <div class="block-content">
            <component :is="getBlockConfig('Heading').icon" class="icon" />
            <span class="name">Заголовок</span>
          </div>
        </div>

        <!-- Изображение -->
        <div
          class="block-library-item"
          draggable="true"
          @dragstart="handleDragStart($event, 'Image')"
          @click="addBlock('Image')"
        >
          <div class="block-content">
            <component :is="getBlockConfig('Image').icon" class="icon" />
            <span class="name">Изображение</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BLOCK_TYPES } from '@/constants/blocks'

export default {
  name: 'BlockLibrary',

  data() {
    return {
      BLOCK_TYPES
    }
  },

  methods: {
    getBlockConfig(type) {
      return this.$store.getters.getBlockConfig(type)
    },
    addBlock(type) {
      console.log('Adding block of type:', type)
      
      const block = {
        type,
        content: type === 'Columns' ? { columns: [[], []] } : ''
      }
      
      this.$store.commit('ADD_BLOCK', block)
    },
    handleDragStart(event, type) {
      const data = {
        type,
        content: type === 'Columns' ? { columns: [[], []] } : '',
        source: 'sidebar'
      }
      event.dataTransfer.setData('application/json', JSON.stringify(data))
    }
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