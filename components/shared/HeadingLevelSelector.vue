<template>
  <div class="heading-level-selector">
    <button 
      class="selector-button"
      @click="isOpen = !isOpen"
      :title="'Уровень ' + currentLevel">
      h{{ currentLevel }}
    </button>
    
    <div v-if="isOpen" 
      class="selector-dropdown"
      v-click-outside="close">
      <button 
        v-for="level in 6" 
        :key="level"
        class="level-option"
        :class="{ 'active': level === currentLevel }"
        @click="selectLevel(level)">
        <span class="level-label">h{{ level }}</span>
        <span class="level-preview" :style="{ fontSize: previewSize(level) }">
          Заголовок
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeadingLevelSelector',
  
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  
  data() {
    return {
      isOpen: false,
      currentLevel: this.value
    }
  },
  
  methods: {
    close() {
      this.isOpen = false
    },
    
    selectLevel(level) {
      this.currentLevel = level
      this.$emit('input', level)
      this.close()
    },
    
    previewSize(level) {
      const sizes = {
        1: '1.5em',
        2: '1.3em',
        3: '1.17em',
        4: '1em',
        5: '0.83em',
        6: '0.67em'
      }
      return sizes[level]
    }
  },
  
  watch: {
    value(newValue) {
      this.currentLevel = newValue
    }
  }
}
</script>

<style scoped>
.heading-level-selector {
  position: relative;
  display: inline-block;
}

.selector-button {
  @apply px-2 py-1 border rounded bg-white hover:bg-gray-50 text-sm font-medium;
  min-width: 2.5rem;
}

.selector-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  animation: menuAppear 0.15s ease-out;
}

.level-option {
  @apply w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between;
}

.level-option.active {
  @apply bg-blue-50 text-blue-600;
}

.level-label {
  @apply font-medium mr-4;
}

.level-preview {
  @apply text-gray-500;
}

@keyframes menuAppear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style> 