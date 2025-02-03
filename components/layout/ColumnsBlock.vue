<template>
  <div class="columns-block border rounded p-4 relative group">
    <DeleteBlockButton @delete="$emit('remove')" />

    <BlockControls :index="index" :is-last="isLast" @move="handleMove" @duplicate="$emit('duplicate')" />

    <div class="flex gap-4">
      <div v-for="(column, columnIndex) in localColumns" :key="`column-${index}-${columnIndex}`" class="flex-1">
        <div class="space-y-4">
          <component v-for="(block, blockIndex) in column"
            :key="`block-${index}-${columnIndex}-${block.id || blockIndex}`" :is="getBlockComponent(block.type)"
            :content="block.content" :index="blockIndex" :parent-id="`column-${columnIndex}`" :is-inside-column="true"
            @update:content="updateBlockContent(columnIndex, blockIndex, $event)"
            @remove="removeBlockFromColumn(columnIndex, blockIndex)" />

          <DropZone :key="`dropzone-${index}-${columnIndex}`" :zone-id="`column-${columnIndex}`"
            :placeholder="'Перетащите сюда блок'" class="min-h-[100px]"
            @drop="handleDropIntoColumn($event, columnIndex)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BLOCK_TYPES } from '@/constants/blocks'
import TextBlock from '@/components/content/TextBlock.vue'
import HeadingBlock from '@/components/content/HeadingBlock.vue'
import ImageBlock from '@/components/content/ImageBlock.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import DropZone from '@/components/ui/DropZone.vue'

export default {
  name: 'ColumnsBlock',

  components: {
    'TextBlock': TextBlock,
    'HeadingBlock': HeadingBlock,
    'ImageBlock': ImageBlock,
    BlockControls,
    DeleteBlockButton,
    DropZone
  },

  computed: {
    processedColumns() {
      return this.content?.columns || [[], []];
    }
  },

  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        columns: [[], []]
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
    }
  },

  data() {
    return {
      localColumns: [[], []]
    }
  },

  created() {
    this.localColumns = JSON.parse(JSON.stringify(this.content.columns || [[], []]));
  },

  mounted() {
    console.log('ColumnsBlock mounted:', {
      content: this.content,
      columns: this.content.columns,
      rawProps: this.$props
    })
  },

  updated() {
    console.log('ColumnsBlock updated:', {
      content: this.content,
      columns: this.content.columns
    })
  },

  watch: {
    'content.columns': {
      immediate: true,
      handler(newColumns) {
        this.localColumns = JSON.parse(JSON.stringify(newColumns || [[], []]));
      }
    }
  },

  methods: {
    getBlockComponent(type) {
      return `${type}Block`
    },

    handleDropIntoColumn({ data }, columnIndex) {
      if (!data) return;

      const blockToAdd = {
        id: Date.now(),
        type: data.type,
        content: data.originalBlock?.content || data.content
      };

      const newColumns = this.localColumns.map(column => [...column]);

      newColumns[columnIndex] = [...newColumns[columnIndex], blockToAdd];

      this.localColumns = newColumns;

      this.updateStore();

      if (data.source === 'editor' && typeof data.index === 'number') {
        this.$nextTick(() => {
          this.$store.commit('REMOVE_BLOCK', data.index);
        });
      }
    },

    handleDropBetweenColumns({ data }, position) {
      const newColumns = [...this.content.columns]
      newColumns.splice(position, 0, [])

      this.$store.commit('UPDATE_BLOCK', {
        index: this.index,
        block: {
          ...this.content,
          columns: newColumns
        }
      })
    },

    parseColumnSource(source) {
      const match = source.match(/column-(\d+)-block-(\d+)/)
      return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 0]
    },

    moveBlock(fromColumn, fromBlock, toColumn) {
      const newColumns = [...this.content.columns]
      const block = newColumns[fromColumn][fromBlock]

      newColumns[fromColumn] = newColumns[fromColumn].filter((_, index) => index !== fromBlock)
      newColumns[toColumn] = [...newColumns[toColumn], block]

      this.$store.commit('UPDATE_BLOCK', {
        index: this.index,
        block: {
          ...this.content,
          columns: newColumns
        }
      })
    },

    updateBlockContent(columnIndex, blockIndex, newContent) {
      const newColumns = this.localColumns.map(column => [...column]);

      if (newColumns[columnIndex][blockIndex]) {
        newColumns[columnIndex][blockIndex] = {
          ...newColumns[columnIndex][blockIndex],
          content: newContent
        };

        this.localColumns = newColumns;

        this.updateStore();
      }
    },

    removeBlockFromColumn(columnIndex, blockIndex) {
      console.log('Removing block:', { columnIndex, blockIndex });

      const newColumns = this.localColumns.map(column => [...column]);

      newColumns[columnIndex] = newColumns[columnIndex].filter((_, index) => index !== blockIndex);

      this.localColumns = newColumns;

      this.updateStore();
    },

    removeBlock(columnIndex, blockIndex) {
      this.removeBlockFromColumn(columnIndex, blockIndex);
    },

    handleMove(direction) {
      const fromIndex = this.index
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
      this.$store.commit('MOVE_BLOCK', { fromIndex, toIndex })
    },

    onDragStart(event) {
      const data = {
        type: BLOCK_TYPES.TWO_COLUMNS,
        index: this.index,
        parentId: this.parentId,
        source: 'editor',
        originalContent: this.content
      }
      event.dataTransfer.setData('application/json', JSON.stringify(data))
    },

    logState() {
      console.log('Current component state:', {
        content: this.content,
        columns: this.content.columns,
        index: this.index
      });
    },

    updateStore() {
      const updatedBlock = {
        type: 'Columns',
        content: {
          columns: JSON.parse(JSON.stringify(this.localColumns))
        }
      };

      this.$store.commit('UPDATE_BLOCK', {
        index: this.index,
        block: updatedBlock
      });
    }
  }
}
</script>

<style scoped>
.columns-block {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.columns-block :deep(.block-controls),
.columns-block :deep(.delete-button) {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.columns-block:hover :deep(.block-controls),
.columns-block:hover :deep(.delete-button) {
  opacity: 1;
}

.column {
  flex: 1;
  min-height: 200px;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.block-wrapper {
  margin-bottom: 1rem;
}

:deep(.drop-zone) {
  margin: 0.5rem 0;
  transition: all 0.2s ease;
}

:deep(.drop-zone--empty) {
  min-height: 100px;
}

:deep(.drop-zone__content) {
  border: 2px dashed #e2e8f0;
  border-radius: 0.5rem;
  background: #f8fafc;
  transition: all 0.2s ease;
}

:deep(.drop-zone--drag-over .drop-zone__content) {
  border-color: #4F46E5;
  background: rgba(79, 70, 229, 0.1);
  transform: scale(1.02);
}

.block-enter-active,
.block-leave-active {
  transition: all 0.3s ease;
}

.block-enter-from,
.block-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>