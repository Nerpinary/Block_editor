<template>
  <div class="editor-content max-w-4xl mx-auto p-8" @dragover="onDragOver" @drop="onDrop">
    <div v-for="(block, index) in blocks" :key="block.id" :data-index="index" class="editor-block mb-4"
      @dragenter.prevent @dragleave="onDragLeave">
      <component :is="getComponentName(block.type)" v-bind="getComponentProps(block, index)" />
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
import type { Component } from 'vue'

const store = useEditorStore()
const { onDragOver, onDragLeave, onDrop } = useDragAndDrop()

const blocks = computed(() => store.blocks)

const componentMap: Record<BlockType, Component> = {
  'Text': TextBlock,
  'Heading': HeadingBlock,
  'Image': ImageBlock,
  'Columns': ColumnsBlock,
  'List': ListBlock,
  'Table': TableBlock,
  'Specifications': SpecificationsBlock,
  'ProsCons': ProsConsBlock
}

const getComponentName = (type: BlockType): Component => {
  return componentMap[type] || null
}

const updateBlockContent = async (index: number, content: BlockContent) => {
  console.log('EditorContent updating block:', { index, content })
  
  const updatedBlock: Block = {
    ...blocks.value[index],
    content: typeof content === 'object' ? { ...content } : content
  }
  
  console.log('EditorContent sending to store:', updatedBlock)
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

const getComponentProps = (block: Block, index: number) => ({
  content: block.content,
  index,
  parentId: 'main-editor',
  isLast: index === blocks.value.length - 1,
  isInsideColumn: false,
  'onUpdate:content': (event: { content: any }) => updateBlockContent(index, event.content),
  onRemove: () => store.removeBlock(index),
  onDuplicate: () => duplicateBlock(index)
})
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