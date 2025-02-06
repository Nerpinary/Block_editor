<template>
  <div class="specifications-preview">
    <h3 class="text-lg font-semibold mb-4">Основные характеристики</h3>
    
    <div class="specifications-table w-full">
      <div 
        v-for="(row, index) in rows" 
        :key="index"
        class="flex w-full"
        :class="{ 'bg-gray-50': index % 2 === 0 }"
      >
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

<script setup lang="ts">
import { computed } from 'vue'
import type { SpecificationsContent, SpecificationRow } from '@/types/content'

interface Props {
  content: SpecificationsContent | string
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    rows: []
  })
})

const rows = computed<SpecificationRow[]>(() => {
  if (typeof props.content === 'string') {
    try {
      return JSON.parse(props.content).rows
    } catch (e) {
      return []
    }
  }
  return props.content.rows || []
})
</script>

<script lang="ts">
export default {
  name: 'PreviewSpecificationsBlock'
}
</script>

<style lang="scss" scoped>
.specifications {
  &-preview {
    @apply w-full;
  }

  &-table {
    @apply border border-gray-200 rounded-lg overflow-hidden;

    > div:not(:last-child) {
      @apply border-b border-gray-200;
    }
  }
}

.table-cell {
  @apply min-w-0 break-words;
}

@media (max-width: 640px) {
  .specifications-table > div {
    @apply flex-col;
  }
  
  .table-cell {
    @apply w-full border-r-0;
    
    &:first-child {
      @apply border-b border-gray-200 bg-gray-50 font-medium;
    }
  }
}
</style> 