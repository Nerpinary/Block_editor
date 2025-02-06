<template>
  <div 
    class="block-library-item" 
    draggable="true" 
    @dragstart="emit('dragstart', $event)" 
    @click="emit('click', type)"
  >
    <div class="block-content">
      <component :is="icon" class="icon" />
      <span class="name">{{ name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlockType } from '@/types/blocks'
import type { Component } from 'vue'

interface Props {
  type: BlockType
  icon: string | Component
  name: string
}

defineProps<Props>()

const emit = defineEmits<{
  dragstart: [event: DragEvent]
  click: [type: BlockType]
}>()
</script>

<style lang="scss" scoped>
.block-library-item {
  @apply cursor-pointer p-2 rounded-md transition-colors duration-200;

  &:hover {
    @apply bg-gray-50;
  }

  .block-content {
    @apply flex items-center gap-2;

    .icon {
      @apply text-gray-500;
    }

    .name {
      @apply text-sm text-gray-700;
    }
  }
}
</style>
