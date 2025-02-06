<template>
  <div class="table-preview">
    <div class="table-responsive">
      <table class="w-full border-collapse border">
        <tbody>
          <tr 
            v-for="(row, rowIndex) in tableData" 
            :key="rowIndex" 
            class="border-b"
          >
            <td 
              v-for="(cell, colIndex) in row" 
              :key="colIndex" 
              class="border-r p-2 last:border-r-0"
            >
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TableContent } from '@/types/content'

const defaultTable = [
  ['', ''],
  ['', '']
]

interface Props {
  content: {
    data: string[][]
  }
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    data: [['', ''], ['', '']]
  })
})

const tableData = computed(() => props.content?.data || defaultTable)
</script>

<script lang="ts">
export default {
  name: 'PreviewTableBlock'
}
</script>

<style lang="scss" scoped>
.table-responsive {
  @apply overflow-x-auto;
}

table {
  @apply border-gray-200;
}

td {
  @apply border-gray-200;

  &:empty::before {
    content: '\00a0';
  }
}
</style> 