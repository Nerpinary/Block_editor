<template>
  <div class="preview-text-block">
    <div class="prose max-w-none" :style="{
      color: textContent.color || 'inherit',
      textAlign: textContent.alignment || 'left'
    }">
      {{ textContent.text || content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TextContent } from '@/types/content'

interface Props {
  content: TextContent | string
}

const props = withDefaults(defineProps<Props>(), {
  content: ''
})

const textContent = computed<TextContent>(() => {
  if (typeof props.content === 'string') {
    return {
      text: props.content,
      alignment: 'left',
      color: 'inherit'
    }
  }
  return props.content
})
</script>

<script lang="ts">
export default {
  name: 'PreviewTextBlock'
}
</script>