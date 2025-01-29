<template>
  <div class="preview-block mb-4">
    <component 
      :is="getPreviewComponent(block.type)"
      :content="parseContent(block.content)"
      :type="block.type"
    />
  </div>
</template>

<script>
export default {
  name: 'PreviewBlock',

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