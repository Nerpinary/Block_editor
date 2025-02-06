<template>
  <div class="heading-level-selector">
    <button 
      class="selector-button"
      @click.stop="toggleDropdown"
      :title="`Уровень ${modelValue}`"
    >
      h{{ modelValue }}
    </button>
    
    <div 
      v-if="isOpen" 
      class="selector-dropdown"
      v-click-outside="close"
    >
      <button 
        v-for="level in headingLevels" 
        :key="level"
        class="level-option"
        :class="{ 'active': level === modelValue }"
        @click.stop="selectLevel(level as HeadingLevel)"
      >
        <span class="level-label">h{{ level }}</span>
        <span 
          class="level-preview" 
          :style="{ fontSize: previewSize(level as HeadingLevel) }"
        >
          Заголовок
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { vClickOutside } from '@/directives/clickOutside'
import type { HeadingLevel } from '@/types/content'

interface Props {
  modelValue: HeadingLevel
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1
})

const emit = defineEmits<{
  (e: 'update:modelValue', level: HeadingLevel): void
}>()

const isOpen = ref(false)

const headingLevels: number[] = [1, 2, 3, 4, 5, 6]

const previewSizes: Record<HeadingLevel, string> = {
  1: '1.5em',
  2: '1.3em',
  3: '1.17em',
  4: '1em',
  5: '0.83em',
  6: '0.67em'
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const selectLevel = (level: HeadingLevel) => {
  emit('update:modelValue', level)
  close()
}

const previewSize = (level: HeadingLevel): string => {
  return previewSizes[level]
}
</script>

<style lang="scss" scoped>
.heading-level-selector {
  @apply relative inline-block;
}

.selector-button {
  @apply px-2 py-1 border rounded bg-white hover:bg-gray-50 text-sm font-medium;
  min-width: 2.5rem;
}

.selector-dropdown {
  @apply absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border min-w-[200px] z-[1000];
  animation: menuAppear 0.15s ease-out;
}

.level-option {
  @apply w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between;

  &.active {
    @apply bg-blue-50 text-blue-600;
  }
}

.level {
  &-label {
    @apply font-medium mr-4;
  }

  &-preview {
    @apply text-gray-500;
  }
}

@keyframes menuAppear {
  from {
    @apply opacity-0;
    transform: scale(0.95) translateY(-5px);
  }
  to {
    @apply opacity-100;
    transform: scale(1) translateY(0);
  }
}
</style> 