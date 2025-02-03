<template>
  <div class="preview-block mb-4">
    <component :is="getPreviewComponent(block.type)" :content="parseContent(block.content)" :type="block.type" />
  </div>
</template>

<script>
import PreviewTextBlock from './PreviewTextBlock.vue'
import PreviewHeadingBlock from './PreviewHeadingBlock.vue'
import PreviewImageBlock from './PreviewImageBlock.vue'
import PreviewColumnsBlock from './PreviewColumnsBlock.vue'

export default {
  name: 'PreviewBlock',

  components: {
    PreviewTextBlock,
    PreviewHeadingBlock,
    PreviewImageBlock,
    PreviewColumnsBlock
  },

  props: {
    block: {
      type: Object,
      required: true
    }
  },

  methods: {
    getPreviewComponent(type) {
      const components = {
        text: 'PreviewTextBlock',
        heading: 'PreviewHeadingBlock',
        image: 'PreviewImageBlock',
        'two-columns': 'PreviewColumnsBlock'
      }
      return components[type] || 'PreviewTextBlock'
    },

    parseContent(content) {
      try {
        return JSON.parse(content)
      } catch {
        return content
      }
    }
  }
}
</script>