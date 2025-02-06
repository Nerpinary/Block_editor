<template>
  <button
    class="delete-button"
    @click="emit('delete')"
  >
    <DeleteIcon :size="4" />
  </button>
</template>

<script setup lang="ts">
import { DeleteIcon } from '@/components/icons'

const emit = defineEmits<{
  (e: 'delete'): void
}>()
</script>

<script lang="ts">
export default {
  name: 'DeleteBlockButton'
}
</script>

<style lang="scss" scoped>
.delete-button {
  @apply absolute top-2 right-2 p-1 rounded-full;
  @apply bg-red-500 text-white;
  @apply opacity-0 group-hover:opacity-100 transition-opacity;
  @apply shadow-sm;
  transform: translate(50%, -50%);
}
</style>