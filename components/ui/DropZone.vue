<template>
  <div
    class="drop-zone"
    :class="{
      'drop-zone--active': isActive,
      'drop-zone--drag-over': isDragOver,
      [orientation]: true
    }"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div class="drop-zone__content">
      <div v-if="hasSlot" class="drop-zone__slot">
        <slot></slot>
      </div>

      <div v-else class="drop-zone__placeholder">
        <div class="drop-zone__icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div class="drop-zone__text">
          {{ placeholder }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropZone',

  props: {
    zoneId: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Перетащите элемент сюда'
    },
    orientation: {
      type: String,
      default: 'vertical',
      validator: value => ['vertical', 'horizontal'].includes(value)
    },
    active: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isDragOver: false
    }
  },

  computed: {
    isActive() {
      return this.active
    },
    
    hasSlot() {
      return !!this.$slots.default
    }
  },

  methods: {
    handleDragOver(event) {
      if (!this.isActive) return
      event.preventDefault()
    },

    handleDragEnter(event) {
      if (!this.isActive) return
      this.isDragOver = true
      this.$emit('dragenter', { event, zoneId: this.zoneId })
    },

    handleDragLeave(event) {
      if (!this.isActive) return
      this.isDragOver = false
      this.$emit('dragleave', { event, zoneId: this.zoneId })
    },

    handleDrop(event) {
      if (!this.isActive) return
      this.isDragOver = false
      
      try {
        const data = JSON.parse(event.dataTransfer.getData('application/json'))
        this.$emit('drop', { 
          data,
          zoneId: this.zoneId,
          event
        })
      } catch (error) {
        console.error('Failed to parse drop data:', error)
      }
    }
  }
}
</script>

<style scoped>
.drop-zone {
  position: relative;
  transition: all 0.2s ease;
}

.drop-zone--active {
  min-height: 50px;
}

.drop-zone.vertical {
  width: 100%;
}

.drop-zone.horizontal {
  height: 100%;
  width: 20px;
}

.drop-zone__content {
  height: 100%;
  width: 100%;
  padding: 0.5rem;
}

.drop-zone--drag-over .drop-zone__content {
  background-color: rgba(79, 70, 229, 0.1);
  border: 2px dashed #4F46E5;
  border-radius: 0.375rem;
}

.drop-zone__placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6B7280;
}

.drop-zone__icon {
  margin-bottom: 0.5rem;
}

.drop-zone__text {
  font-size: 0.875rem;
  text-align: center;
}

.drop-zone__slot {
  height: 100%;
}
</style> 