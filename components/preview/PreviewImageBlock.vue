<template>
  <div class="preview-image-block">
    <figure v-if="imageContent.url">
      <img 
        :src="imageContent.url" 
        class="max-w-full"
        alt=""
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

<script>
export default {
  name: 'PreviewImageBlock',
  
  props: {
    content: {
      type: [String, Object],
      default: () => ({
        url: '',
        caption: ''
      })
    }
  },

  computed: {
    imageContent() {
      return typeof this.content === 'string' 
        ? { url: '', caption: '' }
        : this.content
    }
  }
}
</script>

<style scoped>
.image-block img {
  max-height: 600px;
  object-fit: contain;
}
</style> 