import { defineNuxtPlugin } from 'nuxt/app'

import type { Component } from 'vue'

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

  Object.entries(blocks).forEach(([name, component]) => {
    nuxtApp.vueApp.component(name, component)
  })

  return {
    provide: {
      blocks
    }
  }
}) 