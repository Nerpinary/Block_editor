<template>
  <div class="preview-image-block">
    <figure v-if="imageContent.url">
      <img 
        :src="imageContent.url" 
        class="max-w-full" 
        :alt="imageContent.caption || ''"
      >
      <figcaption 
        v-if="imageContent.caption" 
        class="text-center text-gray-600 mt-2"
      >
        {{ imageContent.caption }}
      </figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ImageContent } from '@/types/content'

interface Props {
  content: ImageContent | string
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    url: '',
    caption: ''
  })
})

const imageContent = computed<ImageContent>(() => {
  return typeof props.content === 'string'
    ? { url: '', caption: '' }
    : props.content
})
</script>

<script lang="ts">
export default {
  name: 'PreviewImageBlock'
}
</script>

<style lang="scss" scoped>
.preview-image-block {
  img {
    @apply max-h-[600px] object-contain;
  }
}
</style>