<template>
  <div class="pros-cons-preview">
    <h3 class="text-lg font-semibold mb-4">Плюсы и минусы</h3>

    <div class="space-y-4">
      <div v-if="parsedContent.pros" class="flex items-start gap-3">
        <div class="flex-shrink-0 w-6 h-6 text-green-500 mt-1">
          <ThumbUpIcon :size="6" />
        </div>
        <div class="flex-grow">{{ parsedContent.pros }}</div>
      </div>

      <div v-if="parsedContent.cons" class="flex items-start gap-3">
        <div class="flex-shrink-0 w-6 h-6 text-red-500 mt-1">
          <ThumbDownIcon :size="6" />
        </div>
        <div class="flex-grow">{{ parsedContent.cons }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ThumbUpIcon, ThumbDownIcon } from '@/components/icons'
import type { ProsConsContent } from '@/types/content'

interface Props {
  content: ProsConsContent | string
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    pros: '',
    cons: ''
  } as ProsConsContent)
})

const parsedContent = computed(() => {
  if (typeof props.content === 'string') {
    try {
      return JSON.parse(props.content) as ProsConsContent
    } catch (e) {
      return {
        pros: '',
        cons: ''
      } as ProsConsContent
    }
  }
  return props.content as ProsConsContent
})
</script>

<script lang="ts">
export default {
  name: 'PreviewProsConsBlock'
}
</script> 