<template>
  <div class="flex gap-1">
    <button 
      v-for="align in alignments" 
      :key="align.value"
      @click="$emit('set-alignment', align.value)"
      class="toolbar-btn"
      :class="{ 'active': currentAlignment === align.value }"
      :title="align.title"
    >
      <svg 
        class="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        stroke-width="2"
        v-html="align.icon"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TextAlign } from '@/types/content'
import type { Alignment } from '@/types/toolbar'

interface Props {
  alignments: Alignment[]
  currentAlignment: TextAlign
}

defineProps<Props>()

defineEmits<{
  (e: 'set-alignment', value: TextAlign): void
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