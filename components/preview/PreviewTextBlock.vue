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
    try {
      const parsed = JSON.parse(props.content)
      if (typeof parsed === 'object') {
        return {
          text: parsed.text || '',
          alignment: parsed.alignment || 'left',
          color: parsed.color || 'inherit'
        }
      }
      return {
        text: props.content,
        alignment: 'left',
        color: 'inherit'
      }
    } catch {
      return {
        text: props.content,
        alignment: 'left',
        color: 'inherit'
      }
    }
  }
  
  return {
    text: props.content.text || '',
    alignment: props.content.alignment || 'left',
    color: props.content.color || 'inherit'
  }
})
</script>