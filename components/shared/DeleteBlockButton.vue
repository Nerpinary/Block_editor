<template>
  <button
    class="delete-button absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
    @click="$emit('delete')">
    <DeleteIcon :size="4" />
  </button>
</template>

<script>
import { DeleteIcon } from '@/components/icons'

export default {
  name: 'DeleteBlockButton',

  components: {
    DeleteIcon
  }
}
</script>

<style scoped>
.delete-button {
  transform: translate(50%, -50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>