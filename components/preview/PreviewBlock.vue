<template>
  <div class="preview-block mb-4">
    <component 
      :is="getPreviewComponent(block.type)" 
      :content="parseContent(block.content)" 
      :type="block.type" 
    />
  </div>
</template>

<script setup lang="ts">
import PreviewTextBlock from './PreviewTextBlock.vue'
import PreviewHeadingBlock from './PreviewHeadingBlock.vue'
import PreviewImageBlock from './PreviewImageBlock.vue'
import PreviewColumnsBlock from './PreviewColumnsBlock.vue'
import type { ContentBlock } from '@/types/blocks'

interface Props {
  block: ContentBlock
}

defineProps<Props>()

type PreviewComponentType = 'text' | 'heading' | 'image' | 'two-columns'

const previewComponents: Record<PreviewComponentType, string> = {
  text: 'PreviewTextBlock',
  heading: 'PreviewHeadingBlock',
  image: 'PreviewImageBlock',
  'two-columns': 'PreviewColumnsBlock'
}

const getPreviewComponent = (type: string): string => {
  return previewComponents[type as PreviewComponentType] || 'PreviewTextBlock'
}

const parseContent = (content: string | object): unknown => {
  if (typeof content !== 'string') {
    return content
  }

  try {
    return JSON.parse(content)
  } catch {
    return content
  }
}
</script>

<script lang="ts">
export default {
  name: 'PreviewBlock',
  components: {
    PreviewTextBlock,
    PreviewHeadingBlock,
    PreviewImageBlock,
    PreviewColumnsBlock
  }
}
</script>