<template>
  <div class="columns-block mb-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="left-column">
        <component 
          v-for="(block, index) in parsedContent.left" 
          :key="`left-${index}`"
          :is="getPreviewComponent(block.type)"
          :content="block.content"
        />
      </div>

      <div class="right-column">
        <component 
          v-for="(block, index) in parsedContent.right" 
          :key="`right-${index}`"
          :is="getPreviewComponent(block.type)"
          :content="block.content"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ColumnsBlockContent, ColumnContent } from '@/types/content'
import type { ContentBlock } from '@/types/blocks'

interface Props {
  content: ColumnsBlockContent | string
}

const props = defineProps<Props>()

const getPreviewComponent = (type: string): string => {
  return `Preview${type}Block`
}

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