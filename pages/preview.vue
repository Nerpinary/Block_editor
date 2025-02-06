<template>
  <div class="preview-page min-h-screen bg-white">
    <header class="preview-header">
      <h1 class="text-lg font-medium text-gray-900">
        Предпросмотр
      </h1>
      <button
        @click="goBack"
        class="preview-button"
      >
        Вернуться к редактированию
      </button>
    </header>

    <main class="max-w-4xl mx-auto p-8">
      <div 
        v-for="block in blocks" 
        :key="block.id"
        class="mb-4"
      >
        <component
          :is="getPreviewComponent(block.type)"
          :content="transformContentForPreview(block.content)"
          @mounted="(comp) => console.log('Preview component mounted:', comp)"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import {
  PreviewTextBlock,
  PreviewHeadingBlock,
  PreviewImageBlock,
  PreviewColumnsBlock,
  PreviewSpecificationsBlock,
  PreviewProsConsBlock,
  PreviewListBlock,
  PreviewTableBlock
} from '@/components/preview'
import type { Block, BlockContent } from '@/types/blocks'

const store = useEditorStore()
const route = useRoute()
const router = useRouter()

const blocks = computed<Block[]>(() => {
  console.log('Preview blocks computed:', store.blocks)
  return store.blocks
})

const previewComponents = {
  PreviewTextBlock,
  PreviewHeadingBlock,
  PreviewImageBlock,
  PreviewColumnsBlock,
  PreviewSpecificationsBlock,
  PreviewProsConsBlock,
  PreviewListBlock,
  PreviewTableBlock
}

const transformContentForPreview = (content: BlockContent): any => {
  if (content && typeof content === 'object' && 'columns' in content) {
    return {
      columns: content.columns.map((column: any[]) => 
        column.map((block: { id: any; type: any; content: any }) => ({
          id: block.id || Date.now().toString(),
          type: block.type,
          content: block.content
        }))
      )
    }
  }
  return content
}

const getPreviewComponent = (type: string) => {
  const componentName = `Preview${type}Block`
  return previewComponents[componentName as keyof typeof previewComponents] || 'div'
}

const goBack = () => {
  if (route.params.slug) {
    router.push('/saved-pages')
  } else {
    router.push('/?from=preview')
  }
}

onMounted(() => {
  const tempBlocks = localStorage.getItem('temp_blocks')
  console.log('Loaded blocks in preview:', tempBlocks)
  if (tempBlocks) {
    try {
      const blocks = JSON.parse(tempBlocks)
      console.log('Parsed blocks:', blocks)
      const validBlocks = blocks.map((block: Block) => {
        if (block.type === 'Heading' && !block.content) {
          block.content = {
            text: '',
            level: 1,
            alignment: 'left',
            color: '#1F2937'
          }
        }
        return block
      })
      store.setBlocks(validBlocks)
    } catch (error) {
      console.error('Error parsing blocks:', error)
    }
  }
})

onBeforeRouteLeave((to) => {
  if (to.path === '/') {
    localStorage.setItem('temp_blocks', JSON.stringify(blocks.value))
  }
})
</script>

<script lang="ts">
export default {
  name: 'PreviewPage'
}
</script>

<style lang="scss" scoped>
.preview {
  &-page {
    @apply min-h-screen bg-white;
  }

  &-header {
    @apply h-14 border-b bg-white px-4;
    @apply flex items-center justify-between;
    @apply sticky top-0 z-10;
  }

  &-button {
    @apply px-4 py-2 rounded-lg;
    @apply bg-blue-500 text-white;
    @apply hover:bg-blue-600;
    @apply transition-colors duration-200;
  }
}
</style>