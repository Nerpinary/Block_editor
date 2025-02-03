<template>
  <div class="columns-block border rounded p-4">
    <pre>{{ JSON.stringify(content.columns, null, 2) }}</pre>
    <div class="flex gap-4">
      <template v-for="(column, columnIndex) in content.columns">
        <div :key="`column-${columnIndex}`" class="flex-1 min-h-[200px]">
          <DropZone :zone-id="`column-${columnIndex}`" :placeholder="'Перетащите сюда текст, изображение или заголовок'"
            class="h-full" @drop="handleDropIntoColumn($event, columnIndex)">
            <div class="space-y-4">
              <pre class="text-xs">{{ JSON.stringify(column, null, 2) }}</pre>

              <component v-for="(block, blockIndex) in processedColumns[columnIndex]" 
              :key="block.id || blockIndex"
                :is="getBlockComponent(block.type)" 
                :content="block.content" :index="blockIndex"
                :parent-id="`column-${columnIndex}`"
                @update:content="updateBlockContent(columnIndex, blockIndex, $event)"
                @remove="removeBlock(columnIndex, blockIndex)" />
            </div>
          </DropZone>
        </div>
      </template>
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
      return JSON.parse(JSON.stringify(this.content.columns));
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

  created() {
    console.log('ColumnsBlock created with content:', this.content)
    if (!this.content?.columns) {
      this.$emit('update:content', {
        columns: [[], []]
      })
    }
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
    content: {
      handler(newContent) {
        console.log('Content changed:', {
          newContent,
          columns: newContent.columns
        })
      },
      deep: true
    }
  },

  methods: {
    getBlockComponent(type) {
      return `${type}Block`
    },

    handleDropIntoColumn({ data }, columnIndex) {
      if (!data) return;

      const blockToMove = {
        id: data.id || `${Date.now()}`,
        type: data.type,
        content: data.content || ''
      };

      const newColumns = [...this.content.columns];
      newColumns[columnIndex] = [...newColumns[columnIndex], blockToMove];

      this.$store.commit('UPDATE_BLOCK', {
        index: this.index,
        block: {
          ...this.content,
          columns: newColumns
        }
      });

      if (typeof data.index === 'number') {
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
      const newColumns = this.content.columns.map((column, colIdx) =>
        colIdx === columnIndex
          ? column.map((block, blkIdx) =>
            blkIdx === blockIndex
              ? { ...block, content: newContent }
              : block
          )
          : column
      )

      this.$store.commit('UPDATE_BLOCK', {
        index: this.index,
        block: {
          ...this.content,
          columns: newColumns
        }
      })
    },

    removeBlock(columnIndex, blockIndex) {
      const newColumns = this.content.columns.map((column, colIdx) =>
        colIdx === columnIndex
          ? column.filter((_, blkIdx) => blkIdx !== blockIndex)
          : column
      )

      this.$store.commit('UPDATE_BLOCK', {
        index: this.index,
        block: {
          ...this.content,
          columns: newColumns
        }
      })
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

.columns-wrapper {
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1.25rem;
}

.columns-header {
  padding: 0 0.5rem;
}

.columns-block :deep(.block-controls) {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease-in-out;
}

.columns-block:hover :deep(.block-controls) {
  opacity: 1;
  transform: translateX(0);
}

.columns-block :deep(.column-drop-zone) {
  transition: all 0.2s ease;
}

.columns-block :deep(.drop-zone-content) {
  border: 2px dashed #e2e8f0;
  min-height: 120px;
}

.columns-block :deep(.drop-zone-content:hover) {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.columns-block :deep(.is-drag-over) {
  border-color: #60a5fa;
  background: #eff6ff;
}

.empty-column-message {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
}
</style>