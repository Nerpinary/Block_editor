<template>
  <div class="editor-content max-w-4xl mx-auto p-8" @dragover="onDragOver" @drop="onDrop">
    <div v-for="(block, index) in blocks" :key="block.id" :data-index="index" class="editor-block mb-4"
      @dragenter.prevent @dragleave="onDragLeave">
      <component :is="getComponentName(block.type)" :content="block.content" :index="index" :parent-id="'main-editor'"
        :is-last="index === blocks.length - 1" @update:content="updateBlockContent(index, $event)"
        @remove="$store.commit('REMOVE_BLOCK', index)" @duplicate="duplicateBlock(index)" />
    </div>

    <div v-if="blocks.length === 0" class="text-center py-12 text-gray-500">
      <slot name="empty-state">
        Нажмите на блок слева, чтобы добавить его
      </slot>
    </div>
  </div>
</template>

<script>
import dragdrop from '@/mixins/dragdrop'
import { BLOCK_TYPES } from '@/constants/blocks'
import TextBlock from '@/components/content/TextBlock.vue'
import HeadingBlock from '@/components/content/HeadingBlock.vue'
import ImageBlock from '@/components/content/ImageBlock.vue'
import ColumnsBlock from '@/components/layout/ColumnsBlock.vue'
import SpecificationsBlock from '@/components/content/SpecificationsBlock.vue'
import ProsConsBlock from '@/components/content/ProsConsBlock.vue'
import ListBlock from '@/components/content/ListBlock.vue'
import TableBlock from '@/components/content/TableBlock.vue'
import BlockMenu from '@/components/shared/BlockMenu.vue'

export default {
  name: 'EditorContent',

  components: {
    TextBlock,
    HeadingBlock,
    ImageBlock,
    ColumnsBlock,
    SpecificationsBlock,
    ProsConsBlock,
    ListBlock,
    TableBlock,
    BlockMenu
  },

  mixins: [dragdrop],

  computed: {
    blocks() {
      return this.$store.state.blocks
    }
  },

  methods: {
    getComponentName(type) {
      return `${type}Block`
    },

    updateBlockContent(index, content) {
      console.log('Updating content:', index, content)
      const updatedBlock = {
        ...this.blocks[index],
        content: typeof content === 'object' ? { ...content } : content
      }
      
      this.$store.commit('UPDATE_BLOCK', {
        index,
        block: updatedBlock
      })

      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },

    duplicateBlock(index) {
      const block = { ...this.blocks[index] }
      if (typeof block.content === 'object') {
        block.content = { ...block.content }
      }
      this.$store.commit('ADD_BLOCK', {
        ...block,
        id: Date.now()
      })
    },

    handleMoveFromEditor({ index }) {
      this.$store.commit('REMOVE_BLOCK', index)
    },

    getDefaultContent(type) {
      switch (type) {
        case BLOCK_TYPES.TEXT:
          return ''
        case BLOCK_TYPES.HEADING:
          return {
            text: '',
            level: 1
          }
        case BLOCK_TYPES.IMAGE:
          return {
            url: '',
            caption: ''
          }
        case BLOCK_TYPES.TWO_COLUMNS:
          return {
            columns: [[], []]
          }
        case BLOCK_TYPES.SPECIFICATIONS:
          return {
            rows: [
              { key: '', value: '' },
              { key: '', value: '' }
            ]
          }
        case BLOCK_TYPES.PROS_CONS:
          return {
            pros: '',
            cons: ''
          }
        case BLOCK_TYPES.LIST:
          return {
            items: [
              { text: '' },
              { text: '' }
            ]
          }
        case BLOCK_TYPES.TABLE:
          return {
            data: [
              ['', ''],
              ['', '']
            ]
          }
        default:
          return ''
      }
    }
  }
}
</script>

<style>
.editor-content {
  isolation: isolate;
}

.editor-block {
  position: relative;
  z-index: 1;
}

.editor-block:hover {
  z-index: 2;
}

.editor-block:hover .menu-trigger {
  opacity: 1;
}

.editor-block.drop-before::before,
.editor-block.drop-after::after {
  content: '';
  position: absolute;
  left: -1rem;
  right: -1rem;
  height: 2px;
  background-color: #3B82F6;
  pointer-events: none;
}

.editor-block.drop-before::before {
  top: -2px;
}

.editor-block.drop-after::after {
  bottom: -2px;
}

.dragging {
  opacity: 0.5;
}
</style>