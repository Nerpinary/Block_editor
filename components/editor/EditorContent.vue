<template>
  <div class="editor-content max-w-4xl mx-auto p-8" @dragover="onDragOver" @drop="onDrop">
    <div v-for="(block, index) in blocks" :key="block.id" :data-index="index" class="editor-block mb-4"
      @dragenter.prevent @dragleave="onDragLeave">
      <component :is="getComponentName(block.type)" :content="block.content" :index="index" :parent-id="'main-editor'"
        :is-last="index === blocks.length - 1" :is-inside-column="false" @update:content="updateBlockContent(index, $event)"
        @remove="store.removeBlock(index)" @duplicate="duplicateBlock(index)" />
    </div>

    <div v-if="blocks.length === 0" class="text-center py-12 text-gray-500">
      <slot name="empty-state">
        Нажмите на блок слева, чтобы добавить его
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { BLOCK_TYPES } from '@/constants/blocks'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import type { Block, BlockType, BlockContent } from '@/types/blocks'
import TextBlock from '@/components/content/TextBlock.vue'
import HeadingBlock from '@/components/content/HeadingBlock.vue'
import ImageBlock from '@/components/content/ImageBlock.vue'
import ColumnsBlock from '@/components/layout/ColumnsBlock.vue'
import SpecificationsBlock from '@/components/content/SpecificationsBlock.vue'
import ProsConsBlock from '@/components/content/ProsConsBlock.vue'
import ListBlock from '@/components/content/ListBlock.vue'
import TableBlock from '@/components/content/TableBlock.vue'
import BlockMenu from '@/components/shared/BlockMenu.vue'

const store = useEditorStore()
const { onDragOver, onDragLeave, onDrop } = useDragAndDrop()

const blocks = computed(() => store.blocks)

const componentMap = {
  'Text': TextBlock,
  'Heading': HeadingBlock,
  'Image': ImageBlock,
  'Columns': ColumnsBlock,
  'List': ListBlock,
  'Table': TableBlock,
  'Specifications': SpecificationsBlock,
  'ProsCons': ProsConsBlock
}

const getComponentName = (type: BlockType) => {
  return componentMap[type] || null
}

const updateBlockContent = async (index: number, content: BlockContent) => {
  const updatedBlock: Block = {
    ...blocks.value[index],
    content: typeof content === 'object' ? { ...content } : content
  }
  
  store.updateBlock({ index, block: updatedBlock })
  await nextTick()
}

const duplicateBlock = (index: number) => {
  const block = { ...blocks.value[index] }
  if (typeof block.content === 'object') {
    block.content = { ...block.content }
  }
  
  store.addBlock({
    ...block,
    id: Date.now()
  })
}

const getDefaultContent = (type: BlockType): BlockContent => {
  switch (type) {
    case BLOCK_TYPES.TEXT:
      return ''
    case BLOCK_TYPES.HEADING:
      return {
        text: '',
        alignment: 'left',
        color: '#1F2937',
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
</script>

<style lang="scss" scoped>
.editor-content {
  @apply isolate;

  .editor-block {
    @apply relative z-[1];

    &:hover {
      @apply z-[2];

      .menu-trigger {
        @apply opacity-100;
      }
    }

    &.drop-before,
    &.drop-after {
      &::before,
      &::after {
        content: '';
        @apply absolute -left-4 -right-4 h-0.5 bg-blue-500 pointer-events-none;
      }
    }

    &.drop-before::before {
      @apply -top-0.5;
    }

    &.drop-after::after {
      @apply -bottom-0.5;
    }
  }
}

.dragging {
  @apply opacity-50;
}
</style>