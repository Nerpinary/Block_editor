<template>
  <div class="table-preview">
    <div class="table-responsive">
      <table class="w-full border-collapse border">
        <tbody>
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex" class="border-b">
            <td v-for="(cell, colIndex) in row" 
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

<script>
export default {
  name: 'PreviewTableBlock',

  props: {
    content: {
      type: Object,
      default: () => ({
        data: [
          ['', ''],
          ['', '']
        ]
      })
    }
  },

  computed: {
    tableData() {
      return this.content?.data || [['', ''], ['', '']]
    }
  }
}
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

table {
  border-color: #e2e8f0;
}

td {
  border-color: #e2e8f0;
}

td:empty::before {
  content: '\00a0';
}
</style> 