<template>
  <div
    class="column-drop-zone"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div 
      class="drop-zone-content"
      :class="{ 'is-drag-over': isDragOver }"
    >
      <!-- Если есть контент - показываем его -->
      <div v-if="$slots.default" class="content-wrapper">
        <slot></slot>
      </div>
      
      <!-- Если контента нет - показываем плейсхолдер -->
      <div v-else class="empty-placeholder">
        <div class="placeholder-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div class="placeholder-text">
          Перетащите сюда текст, изображение или заголовок
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColumnDropZone',
  
  props: {
    columnIndex: {
      type: Number,
      required: true
    },
    parentId: {
      type: String,
      required: true
    }
  },
  
  data() {
    return {
      isDragOver: false
    }
  },
  
  methods: {
    handleDragOver(event) {
      event.preventDefault()
    },

    handleDragEnter(event) {
      this.isDragOver = true
    },

    handleDragLeave(event) {
      this.isDragOver = false
    },
    
    handleDrop(event) {
      this.isDragOver = false
      const data = JSON.parse(event.dataTransfer.getData('application/json'))
      this.$emit('drop', {
        data,
        columnIndex: this.columnIndex,
        parentId: this.parentId
      })
    }
  }
}
</script>

<style scoped>
.column-drop-zone {
  min-height: 100px;
  border: 2px dashed transparent;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.drop-zone-content {
  height: 100%;
  padding: 0.5rem;
}

.drop-zone-content.is-drag-over {
  border-color: #4F46E5;
  background-color: rgba(79, 70, 229, 0.1);
}

.empty-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6B7280;
}

.placeholder-icon {
  margin-bottom: 0.5rem;
}

.placeholder-text {
  font-size: 0.875rem;
}

.content-wrapper {
  min-height: 100px;
}
</style> 