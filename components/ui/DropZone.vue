<template>
  <div class="drop-zone" :class="{
    'drop-zone--active': isActive,
    'drop-zone--drag-over': isDragOver,
    'drop-zone--empty': !hasSlot,
    [orientation]: true
  }" @dragover.prevent="handleDragOver" @dragenter.prevent="handleDragEnter" @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop">
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
    },
    allowedTypes: {
      type: Array,
      default: () => []
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

      const dropZone = event.currentTarget
      const relatedTarget = event.relatedTarget

      if (dropZone.contains(relatedTarget)) {
        return
      }

      this.isDragOver = false
      this.$emit('dragleave', { event, zoneId: this.zoneId })
    },

    handleDrop(event) {
      if (!this.isActive) return
      this.isDragOver = false

      try {
        const data = JSON.parse(event.dataTransfer.getData('application/json'))
        if (this.allowedTypes.length && !this.allowedTypes.includes(data.type)) {
          console.warn('This type is not allowed in this drop zone')
          return
        }
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
  margin: 0.5rem 0;
}

.drop-zone--active {
  min-height: 100px;
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
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px dashed #E5E7EB;
  transition: all 0.2s ease;
}

.drop-zone--empty .drop-zone__content {
  background-color: #F9FAFB;
}

.drop-zone--active:hover .drop-zone__content {
  border-color: #9CA3AF;
  background-color: #F3F4F6;
}

.drop-zone--drag-over .drop-zone__content {
  background-color: rgba(79, 70, 229, 0.1);
  border-color: #4F46E5;
  border-style: dashed;
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.drop-zone__placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6B7280;
  padding: 1.5rem;
}

.drop-zone__icon {
  margin-bottom: 0.75rem;
  transition: transform 0.2s ease;
}

.drop-zone--drag-over .drop-zone__icon {
  transform: scale(1.1);
}

.drop-zone__text {
  font-size: 0.875rem;
  text-align: center;
  transition: color 0.2s ease;
}

.drop-zone--drag-over .drop-zone__text {
  color: #4F46E5;
}

.drop-zone__slot {
  height: 100%;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(1);
  }
}

.drop-zone--drag-over {
  animation: pulse 2s infinite;
}
</style>