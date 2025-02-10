<template>
  <div class="editor-content max-w-4xl mx-auto p-8" @dragover="onDragOver" @drop="onDrop">
    <div v-for="(block, index) in blocks" :key="block.id" :data-index="index" class="editor-block mb-4"
      @dragenter.prevent @dragleave="onDragLeave">
      <component :is="componentMap[block.type]" v-bind="getComponentProps(block, index)" />
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
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import type { Block, BlockContent } from '@/types/blocks'
import { componentMap } from '@/constants/blocks'

const store = useEditorStore()
const { onDragOver, onDragLeave, onDrop } = useDragAndDrop()

const blocks = computed(() => store.blocks)

const updateBlockContent = async (index: number, content: BlockContent) => {  
  const updatedBlock: Block = {
    ...blocks.value[index],
    content: typeof content === 'object' ? structuredClone(content) : content
  }
  
  store.updateBlock({ index, block: updatedBlock })
  await nextTick()
}

const duplicateBlock = (index: number) => {
  const block = structuredClone(blocks.value[index])
  block.id = Date.now()
  store.addBlock(block)
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