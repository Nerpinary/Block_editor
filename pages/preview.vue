<template>
  <div class="preview-page min-h-screen bg-white">
    <div class="h-14 border-b bg-white px-4 flex items-center justify-between sticky top-0 z-10">
      <h1 class="text-lg font-medium text-gray-900">Предпросмотр</h1>
      <button
        @click="goBack"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Вернуться к редактированию
      </button>
    </div>

    <div class="max-w-4xl mx-auto p-8">
      <div 
        v-for="block in blocks" 
        :key="block.id"
        class="mb-4"
      >
        <component
          :is="getPreviewComponent(block.type)"
          :content="block.content"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  PreviewTextBlock,
  PreviewHeadingBlock,
  PreviewImageBlock,
  PreviewColumnsBlock,
  PreviewSpecificationsBlock,
  PreviewProsConsBlock
} from '@/components/preview'

export default {
  name: 'PreviewPage',

  components: {
    PreviewTextBlock,
    PreviewHeadingBlock,
    PreviewImageBlock,
    PreviewColumnsBlock,
    PreviewSpecificationsBlock,
    PreviewProsConsBlock
  },

  computed: {
    blocks() {
      return this.$store.state.blocks
    }
  },

  methods: {
    getPreviewComponent(type) {
      return `Preview${type}Block`
    },

    goBack() {
      if (this.$route.params.slug) {
        this.$router.push('/saved-pages')
      } else {
        this.$router.push('/?from=preview')
      }
    }
  },

  beforeRouteLeave(to, from, next) {
    if (to.path === '/') {
      localStorage.setItem('temp_blocks', JSON.stringify(this.blocks))
    }
    next()
  }
}
</script>