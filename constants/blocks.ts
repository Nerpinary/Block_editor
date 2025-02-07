// constants/blocks.ts
import type { Component } from 'vue'
import { BLOCK_TYPES, type BlockType } from '@/constants/blockTypes'
import { BLOCK_CONFIG } from '@/constants/blockConfig'

import TextBlock from '@/components/content/TextBlock.vue'
import HeadingBlock from '@/components/content/HeadingBlock.vue'
import ImageBlock from '@/components/content/ImageBlock.vue'
import ColumnsBlock from '@/components/layout/ColumnsBlock.vue'
import SpecificationsBlock from '@/components/content/SpecificationsBlock.vue'
import type { BlockContent } from '@/types/blocks'
import ProsConsBlock from '@/components/content/ProsConsBlock.vue'
import ListBlock from '@/components/content/ListBlock.vue'
import TableBlock from '@/components/content/TableBlock.vue'

export const componentMap: Record<BlockType, Component> = {
  [BLOCK_TYPES.TEXT]: TextBlock,
  [BLOCK_TYPES.HEADING]: HeadingBlock,
  [BLOCK_TYPES.IMAGE]: ImageBlock,
  [BLOCK_TYPES.TWO_COLUMNS]: ColumnsBlock,
  [BLOCK_TYPES.LIST]: ListBlock,
  [BLOCK_TYPES.TABLE]: TableBlock,
  [BLOCK_TYPES.SPECIFICATIONS]: SpecificationsBlock,
  [BLOCK_TYPES.PROS_CONS]: ProsConsBlock
}

export function getBlockConfig<T extends BlockType>(type: T) {
  return BLOCK_CONFIG[type]
}

export function getBlockComponent(type: BlockType): Component | null {
  return componentMap[type] || null
}

export function isBlockType(type: string): type is BlockType {
  return Object.values(BLOCK_TYPES).includes(type as BlockType)
}

export function getDefaultContent(type: BlockType): BlockContent {
  return structuredClone(BLOCK_CONFIG[type].defaultContent)
}
