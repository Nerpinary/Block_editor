<template>
  <div class="flex gap-1">
    <button 
      v-for="format in formats" 
      :key="format.command"
      @click="$emit('format', format.command as TextFormatCommand)"
      class="toolbar-btn"
      :class="{ 'active': activeStates[format.command as keyof ActiveStates] }"
      :title="format.title"
    >
      <svg 
        class="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        stroke-width="2"
        v-html="format.icon"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TextFormat, TextFormatCommand, ActiveStates } from '@/types/toolbar'

interface Props {
  formats: TextFormat[]
  activeStates: ActiveStates
  currentColor?: string
}

defineProps<Props>()

defineEmits<{
  (e: 'format', command: TextFormatCommand): void
}>()
</script>

<style lang="scss" scoped>
.toolbar-btn {
  @apply p-2 rounded hover:bg-gray-100 transition-colors duration-200;
  @apply text-gray-600;

  &.active {
    @apply bg-blue-50 text-blue-600;
  }
}
</style> 