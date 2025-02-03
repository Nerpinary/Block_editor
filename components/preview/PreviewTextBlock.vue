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

<script>
export default {
  name: 'PreviewTextBlock',

  props: {
    content: {
      type: [String, Object],
      default: ''
    }
  },

  computed: {
    textContent() {
      if (typeof this.content === 'string') {
        return {
          text: this.content,
          alignment: 'left',
          color: 'inherit'
        }
      }
      return this.content
    }
  }
}
</script>