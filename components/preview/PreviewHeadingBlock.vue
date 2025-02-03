<template>
  <div class="preview-heading-block">
    <component
      :is="'h' + (headingContent.level || 1)"
      :style="{
        color: headingContent.color || 'inherit',
        textAlign: headingContent.alignment || 'left'
      }"
      class="font-bold"
      :class="{
        'text-4xl': headingContent.level === 1,
        'text-3xl': headingContent.level === 2,
        'text-2xl': headingContent.level === 3,
        'text-xl': headingContent.level === 4,
        'text-lg': headingContent.level === 5,
        'text-base': headingContent.level === 6
      }"
    >
      {{ headingContent.text || content }}
    </component>
  </div>
</template>

<script>
export default {
  name: 'PreviewHeadingBlock',
  
  props: {
    content: {
      type: [String, Object],
      default: () => ({
        text: '',
        level: 1,
        alignment: 'left',
        color: 'inherit'
      })
    }
  },

  computed: {
    headingContent() {
      if (typeof this.content === 'string') {
        try {
          const parsed = JSON.parse(this.content)
          if (typeof parsed === 'object') {
            return {
              text: parsed.text || '',
              level: parsed.level || 1,
              alignment: parsed.alignment || 'left',
              color: parsed.color || 'inherit'
            }
          }
        } catch (e) {
          return {
            text: this.content,
            level: 1,
            alignment: 'left',
            color: 'inherit'
          }
        }
      }
      return this.content
    }
  }
}
</script> 