<template>
  <div class="block-library-item" draggable="true" @dragstart="$emit('dragstart')" @click="$emit('click', type)">
    <div class="block-content">
      <component :is="icon" class="icon" />
      <span class="name">{{ name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockLibraryItem',
  
  props: {
    type: {
      type: String,
      required: true
    },
    icon: {
      type: [String, Object],
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.block-library-item {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.block-library-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.block-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  color: #6B7280;
}

.name {
  font-size: 0.875rem;
  color: #374151;
}
</style>
