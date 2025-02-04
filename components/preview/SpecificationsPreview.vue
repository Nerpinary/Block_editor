<template>
  <div class="specifications-preview">
    <h3 class="text-lg font-semibold mb-4">Основные характеристики</h3>
    
    <div class="specifications-table w-full">
      <div v-for="(row, index) in rows" 
           :key="index"
           class="flex w-full"
           :class="{ 'bg-gray-50': index % 2 === 0 }">
        <div class="table-cell flex-1 p-4 border-r border-gray-200">
          {{ row.key || '—' }}
        </div>
        <div class="table-cell flex-1 p-4">
          {{ row.value || '—' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewSpecificationsBlock',

  props: {
    content: {
      type: [String, Object],
      default: () => ({
        rows: []
      })
    }
  },

  computed: {
    rows() {
      if (typeof this.content === 'string') {
        try {
          return JSON.parse(this.content).rows;
        } catch (e) {
          return [];
        }
      }
      return this.content.rows || [];
    }
  }
}
</script>

<style scoped>
.specifications-preview {
  width: 100%;
}

.specifications-table {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.specifications-table > div:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}

.table-cell {
  min-width: 0;
  word-wrap: break-word;
}

@media (max-width: 640px) {
  .specifications-table > div {
    flex-direction: column;
  }
  
  .table-cell {
    width: 100%;
    border-right: none;
  }
  
  .table-cell:first-child {
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
    font-weight: 500;
  }
}
</style> 