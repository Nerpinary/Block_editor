<template>
  <div class="table-block border rounded p-4 relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart($event)" @dragend="onDragEnd">
    <DeleteBlockButton @delete="$emit('remove')" />
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="$emit('duplicate')" />

    <div class="block-content">
      <div class="block-header flex items-center justify-between mb-4">
        <div class="block-type text-sm text-gray-500">Таблица</div>
        <div class="flex items-center gap-2">
          <button 
            @click="addColumn"
            class="p-1 text-green-500 hover:text-green-600 transition-colors"
            title="Добавить столбец"
          >
            <PlusIcon :size="5" />
          </button>
          <button 
            v-if="localData[0].length > 2"
            @click="removeColumn"
            class="p-1 text-red-500 hover:text-red-600 transition-colors"
            title="Удалить столбец"
          >
            <MinusIcon :size="5" />
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="w-full border-collapse">
          <tbody>
            <tr v-for="(row, rowIndex) in localData" :key="rowIndex" class="border-b last:border-b-0">
              <td v-for="(cell, colIndex) in row" :key="colIndex" 
                class="p-2 border-r last:border-r-0">
                <input
                  type="text"
                  v-model="localData[rowIndex][colIndex]"
                  class="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
                  placeholder="Введите текст"
                  @input="updateContent"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end mt-4 gap-2">
        <button 
          @click="addRow"
          class="p-1 text-green-500 hover:text-green-600 transition-colors"
          title="Добавить строку"
        >
          <PlusIcon :size="5" />
        </button>
        <button 
          v-if="localData.length > 2"
          @click="removeRow"
          class="p-1 text-red-500 hover:text-red-600 transition-colors"
          title="Удалить строку"
        >
          <MinusIcon :size="5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import dragdrop from '@/mixins/dragdrop'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import MinusIcon from '@/components/icons/MinusIcon.vue'

export default {
  name: 'TableBlock',

  components: {
    DeleteBlockButton,
    BlockControls,
    PlusIcon,
    MinusIcon
  },

  mixins: [dragdrop],

  props: {
    content: {
      type: [Object, String],
      default: () => ({
        data: [
          ['', ''],
          ['', '']
        ]
      })
    },
    index: {
      type: Number,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: null
    },
    isInsideColumn: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      localData: [],
      dragState: {
        isDragging: false
      }
    }
  },

  created() {
    const initialContent = typeof this.content === 'string' ? { data: [['', ''], ['', '']] } : this.content
    this.localData = JSON.parse(JSON.stringify(initialContent.data || [['', ''], ['', '']]))
  },

  methods: {
    updateContent() {
      const newData = this.localData.map(row => [...row])
      this.$emit('update:content', {
        data: newData
      })
    },

    addRow() {
      const newRow = new Array(this.localData[0].length).fill('')
      const newData = [...this.localData, newRow]
      this.localData = newData
      this.updateContent()
    },

    removeRow() {
      if (this.localData.length > 2) {
        const newData = this.localData.slice(0, -1)
        this.localData = newData
        this.updateContent()
      }
    },

    addColumn() {
      const newData = this.localData.map(row => [...row, ''])
      this.localData = newData
      this.updateContent()
    },

    removeColumn() {
      if (this.localData[0].length > 2) {
        const newData = this.localData.map(row => row.slice(0, -1))
        this.localData = newData
        this.updateContent()
      }
    },

    handleMove(direction) {
      this.$emit('move', {
        direction,
        index: this.index,
        parentId: this.parentId
      })
    }
  },

  watch: {
    'content.data': {
      handler(newData) {
        if (newData && JSON.stringify(newData) !== JSON.stringify(this.localData)) {
          this.localData = JSON.parse(JSON.stringify(newData))
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.table-block {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.table-block :deep(.block-controls),
.table-block :deep(.delete-button) {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.table-block:hover :deep(.block-controls),
.table-block:hover :deep(.delete-button) {
  opacity: 1;
}

.table-responsive {
  overflow-x: auto;
}

table {
  border: 1px solid #e2e8f0;
}

td {
  border-color: #e2e8f0;
}
</style> 