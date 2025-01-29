<template>
  <button 
    class="delete-button opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all"
    @click.stop="$emit('delete')"
    title="Удалить блок"
  >
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