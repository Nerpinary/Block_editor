<template>
  <div class="flex gap-1">
    <button 
      v-for="format in formats" 
      :key="format.command"
      @click="handleFormat(format.command as TextFormatCommand)"
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

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'format', command: TextFormatCommand): void
}>()

const handleFormat = (command: TextFormatCommand) => {
  emit('format', command)
}
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