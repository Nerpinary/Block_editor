<template>
  <div class="columns-block mb-4">
    <div class="grid grid-cols-2 gap-4">
      <!-- Левая колонка -->
      <div class="left-column">
        <PreviewBlock
          v-for="(block, index) in parsedContent.left"
          :key="`left-${index}`"
          :block="block"
        />
      </div>

      <!-- Правая колонка -->
      <div class="right-column">
        <PreviewBlock
          v-for="(block, index) in parsedContent.right"
          :key="`right-${index}`"
          :block="block"
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

  computed: {
    parsedContent() {
      if (typeof this.content === 'string') {
        try {
          return JSON.parse(this.content)
        } catch {
          return { left: [], right: [] }
        }
      }
      return this.content
    }
  }
}
</script> 