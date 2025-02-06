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

console.log('PreviewTextBlock received content:', props.content)

const textContent = computed<TextContent>(() => {
  console.log('Processing content in textContent computed:', props.content)
  
  if (typeof props.content === 'string') {
    try {
      // Пробуем распарсить JSON если это строка
      const parsed = JSON.parse(props.content)
      console.log('Parsed content:', parsed)
      if (typeof parsed === 'object') {
        return {
          text: parsed.text || '',
          alignment: parsed.alignment || 'left',
          color: parsed.color || 'inherit'
        }
      }
      // Если это просто строка, используем её как текст
      return {
        text: props.content,
        alignment: 'left',
        color: 'inherit'
      }
    } catch {
      // Если не удалось распарсить JSON, используем как обычный текст
      return {
        text: props.content,
        alignment: 'left',
        color: 'inherit'
      }
    }
  }
  
  // Если это уже объект, убедимся что все поля присутствуют
  return {
    text: props.content.text || '',
    alignment: props.content.alignment || 'left',
    color: props.content.color || 'inherit'
  }
})
</script>