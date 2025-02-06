<template>
  <div class="preview-heading-block">
    <component 
      :is="`h${parsedContent.level}`"
      :style="{
        color: parsedContent.color || 'inherit',
        textAlign: parsedContent.alignment || 'left'
      }" 
      class="font-bold" 
      :class="headingClasses"
    >
      {{ parsedContent.text }}
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HeadingContent, HeadingLevel, TextAlign } from '@/types/content'

interface Props {
  content: HeadingContent | string
}

const props = defineProps<Props>()

const isValidHeadingLevel = (level: number): level is HeadingLevel => {
  return level >= 1 && level <= 6
}

const normalizeHeadingLevel = (level: number | undefined): HeadingLevel => {
  if (level === undefined || !isValidHeadingLevel(level)) {
    return 1
  }
  return level
}

const parseContent = (content: string | HeadingContent): HeadingContent => {
  const defaultContent: HeadingContent = {
    text: '',
    level: 1 as HeadingLevel,
    alignment: 'left' as TextAlign,
    color: 'inherit'
  }

  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content)
      if (typeof parsed === 'object') {
        const level = normalizeHeadingLevel(Number(parsed.level))
        return {
          text: String(parsed.text || ''),
          level,
          alignment: (parsed.alignment || 'left') as TextAlign,
          color: String(parsed.color || 'inherit')
        }
      }
      return {
        ...defaultContent,
        text: content
      }
    } catch (e) {
      return {
        ...defaultContent,
        text: content
      }
    }
  }
  return {
    text: content.text || '',
    level: normalizeHeadingLevel(content.level),
    alignment: content.alignment || 'left' as TextAlign,
    color: content.color || 'inherit'
  }
}

const parsedContent = computed(() => parseContent(props.content))

const headingClasses = computed(() => ({
  'text-4xl': parsedContent.value.level === 1,
  'text-3xl': parsedContent.value.level === 2,
  'text-2xl': parsedContent.value.level === 3,
  'text-xl': parsedContent.value.level === 4,
  'text-lg': parsedContent.value.level === 5,
  'text-base': parsedContent.value.level === 6
}))
</script>

<script lang="ts">
export default {
  name: 'PreviewHeadingBlock'
}
</script>