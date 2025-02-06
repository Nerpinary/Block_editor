import { defineNuxtPlugin } from '#app'
import type { Component } from 'vue'

// Импорты блоков контента
import TextBlock from '@/components/content/TextBlock.vue'
import HeadingBlock from '@/components/content/HeadingBlock.vue'
import ImageBlock from '@/components/content/ImageBlock.vue'
import ColumnsBlock from '@/components/layout/ColumnsBlock.vue'

interface BlockComponents {
  [key: string]: Component
}

export default defineNuxtPlugin((nuxtApp) => {
  const blocks: BlockComponents = {
    TextBlock,
    HeadingBlock,
    ImageBlock,
    ColumnsBlock
  }

  // Регистрируем компоненты глобально
  Object.entries(blocks).forEach(([name, component]) => {
    nuxtApp.vueApp.component(name, component)
  })

  // Предоставляем доступ к компонентам через provide
  return {
    provide: {
      blocks
    }
  }
}) 