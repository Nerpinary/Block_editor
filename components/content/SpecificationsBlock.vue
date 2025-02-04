<template>
  <div class="specifications-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart($event)" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="$emit('duplicate')" />

    <DeleteBlockButton @delete="$emit('remove')" />

    <div class="block-content">
      <div class="block-header flex items-center justify-between mb-4">
        <div class="block-type text-sm text-gray-500">Характеристики</div>
        <div class="controls flex items-center gap-2">
          <button 
            class="control-button" 
            @click="addRow"
            title="Добавить строку">
            <PlusIcon :size="5" />
          </button>
          <button 
            v-if="localRows.length > 1"
            class="control-button" 
            @click="removeLastRow"
            title="Удалить последнюю строку">
            <MinusIcon :size="5" />
          </button>
        </div>
      </div>

      <h3 class="text-lg font-semibold mb-4">Основные характеристики</h3>

      <div class="specifications-table">
        <div 
          v-for="(row, index) in localRows" 
          :key="index"
          class="table-row"
          :class="{ 'bg-gray-50': index % 2 === 0 }">
          <div class="table-cell">
            <input
              type="text"
              :value="row.key"
              class="cell-input"
              placeholder="Параметр"
              @input="updateRowKey(index, $event.target.value)"
            >
          </div>
          <div class="table-cell">
            <input
              type="text"
              :value="row.value"
              class="cell-input"
              placeholder="Значение"
              @input="updateRowValue(index, $event.target.value)"
            >
          </div>
        </div>
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
  name: 'SpecificationsBlock',

  components: {
    DeleteBlockButton,
    BlockControls,
    PlusIcon,
    MinusIcon
  },

  mixins: [dragdrop],

  props: {
    content: {
      type: [String, Object],
      default: () => ({
        rows: [
          { key: '', value: '' },
          { key: '', value: '' }
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
      default: 'main-editor'
    },
    isInsideColumn: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      localRows: [],
      dragState: {
        isDragging: false
      }
    }
  },

  mounted() {
    let content = this.content;
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        content = {
          rows: [
            { key: '', value: '' },
            { key: '', value: '' }
          ]
        };
      }
    }
    this.localRows = content.rows.map(row => ({ ...row }));
  },

  methods: {
    handleMove(direction) {
      const fromIndex = this.index
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
      this.$store.commit('MOVE_BLOCK', { fromIndex, toIndex })
    },

    addRow() {
      const newRows = [...this.localRows, { key: '', value: '' }];
      this.localRows = newRows;
      this.updateContent();
    },

    removeLastRow() {
      if (this.localRows.length > 1) {
        const newRows = [...this.localRows.slice(0, -1)];
        this.localRows = newRows;
        this.updateContent();
      }
    },

    updateRowKey(index, newKey) {
      const newRows = this.localRows.map((row, i) => 
        i === index ? { ...row, key: newKey } : { ...row }
      );
      this.localRows = newRows;
      this.updateContent();
    },

    updateRowValue(index, newValue) {
      const newRows = this.localRows.map((row, i) => 
        i === index ? { ...row, value: newValue } : { ...row }
      );
      this.localRows = newRows;
      this.updateContent();
    },

    updateContent() {
      this.$emit('update:content', {
        rows: this.localRows
      });
    },

    onDragStart(event) {
      const blockData = {
        type: 'Specifications',
        index: this.index,
        parentId: this.parentId,
        source: 'editor',
        content: { rows: [...this.localRows] },
        originalBlock: {
          type: 'Specifications',
          content: { rows: [...this.localRows] }
        }
      }
      event.dataTransfer.setData('application/json', JSON.stringify(blockData))
    }
  },

  watch: {
    'content.rows': {
      handler(newRows) {
        if (JSON.stringify(newRows) !== JSON.stringify(this.localRows)) {
          this.localRows = newRows.map(row => ({ ...row }));
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.specifications-block {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.control-button {
  @apply p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors;
}

.specifications-table {
  @apply border border-gray-200 rounded-lg overflow-hidden;
}

.table-row {
  @apply flex border-b last:border-b-0;
}

.table-cell {
  @apply flex-1 p-2 border-r last:border-r-0;
}

.cell-input {
  @apply w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1;
}

:deep(.block-controls-wrapper) {
  z-index: 1000 !important;
}
</style> 