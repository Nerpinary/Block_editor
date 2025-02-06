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
          :content="block.content"
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
import type { Block } from '@/types'

const store = useEditorStore()
const route = useRoute()
const router = useRouter()

const blocks = computed<Block[]>(() => store.blocks)

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

const getPreviewComponent = (type: string): string => {
  const componentName = `Preview${type}Block`
  if (componentName in previewComponents) {
    return componentName
  }
  console.warn(`Preview component not found for type: ${type}`)
  return 'div'
}

const goBack = () => {
  if (route.params.slug) {
    router.push('/saved-pages')
  } else {
    router.push('/?from=preview')
  }
}

onMounted(() => {
  // Проверяем, пришли ли мы с редактора
  const fromEditor = !route.params.slug && !route.query.from
  if (fromEditor) {
    // Сохраняем текущие блоки перед предпросмотром
    localStorage.setItem('temp_blocks', JSON.stringify(blocks.value))
  }
})

onBeforeRouteLeave((to) => {
  if (to.path === '/') {
    localStorage.setItem('temp_blocks', JSON.stringify(blocks.value))
  }
})
</script>

<script lang="ts">
// Для поддержки имени компонента в DevTools
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