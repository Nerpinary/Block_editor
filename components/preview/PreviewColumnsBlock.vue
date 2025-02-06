<template>
  <div class="columns-block mb-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="left-column">
        <template v-for="(block, index) in parsedContent.left" :key="`left-${index}`">
          <component 
            :is="getPreviewComponent(block.type)"
            v-bind="getComponentProps(block)"
          />
        </template>
      </div>

      <div class="right-column">
        <template v-for="(block, index) in parsedContent.right" :key="`right-${index}`">
          <component 
            :is="getPreviewComponent(block.type)"
            v-bind="getComponentProps(block)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import type { ColumnsBlockContent, ColumnContent } from '@/types/content'
import type { ContentBlock } from '@/types/blocks'
import {
  PreviewTextBlock,
  PreviewHeadingBlock,
  PreviewImageBlock,
  PreviewListBlock,
  PreviewTableBlock,
  PreviewProsConsBlock,
  PreviewSpecificationsBlock
} from '@/components/preview'

interface Props {
  content: ColumnsBlockContent | string
}

const props = defineProps<Props>()

// Явно типизируем компоненты
const previewComponents: Record<string, Component> = {
  Text: PreviewTextBlock,
  Heading: PreviewHeadingBlock,
  Image: PreviewImageBlock,
  List: PreviewListBlock,
  Table: PreviewTableBlock,
  ProsCons: PreviewProsConsBlock,
  Specifications: PreviewSpecificationsBlock
}

const getPreviewComponent = (type: string): Component => {
  return previewComponents[type] || 'div'
}

const getComponentProps = (block: ContentBlock) => ({
  content: block.content
})

const parsedContent = computed<ColumnContent>(() => {
  if (typeof props.content === 'string') {
    try {
      return JSON.parse(props.content)
    } catch {
      return { left: [], right: [] }
    }
  }
  
  if ('columns' in props.content) {
    return {
      left: props.content.columns[0] || [],
      right: props.content.columns[1] || []
    }
  }
  
  return props.content as ColumnContent
})
</script>

<script lang="ts">
export default {
  name: 'PreviewColumnsBlock'
}
</script>