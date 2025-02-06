import type { Component } from 'vue'

import PreviewBlock from './PreviewBlock.vue'
import PreviewColumnsBlock from './PreviewColumnsBlock.vue'
import PreviewHeadingBlock from './PreviewHeadingBlock.vue'
import PreviewImageBlock from './PreviewImageBlock.vue'
import PreviewTextBlock from './PreviewTextBlock.vue'
import PreviewSpecificationsBlock from './SpecificationsPreview.vue'
import PreviewProsConsBlock from './ProsConsPreview.vue'
import PreviewListBlock from './ListPreview.vue'
import PreviewTableBlock from './TablePreview.vue'

export const PreviewComponents = {
  PreviewBlock,
  PreviewColumnsBlock,
  PreviewHeadingBlock,
  PreviewImageBlock,
  PreviewTextBlock,
  PreviewSpecificationsBlock,
  PreviewProsConsBlock,
  PreviewListBlock,
  PreviewTableBlock
} as const

export {
  PreviewBlock,
  PreviewColumnsBlock,
  PreviewHeadingBlock,
  PreviewImageBlock,
  PreviewTextBlock,
  PreviewSpecificationsBlock,
  PreviewProsConsBlock,
  PreviewListBlock,
  PreviewTableBlock
}

export type PreviewComponent = Component

export default PreviewComponents 