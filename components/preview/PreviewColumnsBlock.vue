<template>
  <div class="columns-block mb-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="left-column">
        <component 
          v-for="(block, index) in parsedContent.left" 
          :key="`left-${index}`"
          :is="getPreviewComponent(block.type)"
          :content="block.content"
        />
      </div>

      <div class="right-column">
        <component 
          v-for="(block, index) in parsedContent.right" 
          :key="`right-${index}`"
          :is="getPreviewComponent(block.type)"
          :content="block.content"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewColumnsBlock',

  props: {
    content: {
      type: [String, Object],
      required: true
    }
  },

  methods: {
    getPreviewComponent(type) {
      return `Preview${type}Block`
    }
  },

  computed: {
    parsedContent() {
      if (typeof this.content === 'string') {
        try {
          return JSON.parse(this.content)
        } catch {
          return { left: [], right: [] }
        }
      }
      
      // Преобразуем структуру columns в left/right для совместимости
      if (this.content.columns) {
        return {
          left: this.content.columns[0] || [],
          right: this.content.columns[1] || []
        }
      }
      
      return this.content
    }
  }
}
</script>