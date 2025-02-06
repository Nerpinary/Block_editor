import type { Component } from 'vue'
import TextIcon from '@/components/icons/TextIcon.vue'
import HeadingIcon from '@/components/icons/HeadingIcon.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import ColumnsIcon from '@/components/icons/ColumnsIcon.vue'
import TableIcon from '@/components/icons/TableIcon.vue'
import ThumbUpIcon from '@/components/icons/ThumbUpIcon.vue'
import ListIcon from '@/components/icons/ListIcon.vue'

export const BLOCK_CATEGORIES = {
  BASIC: 'basic',
  CUSTOM: 'custom'
} as const

export type BlockCategory = typeof BLOCK_CATEGORIES[keyof typeof BLOCK_CATEGORIES]

export const BLOCK_TYPES = {
  TEXT: 'Text',
  HEADING: 'Heading',
  IMAGE: 'Image',
  TWO_COLUMNS: 'Columns',
  SPECIFICATIONS: 'Specifications',
  PROS_CONS: 'ProsCons',
  LIST: 'List',
  TABLE: 'Table'
} as const

export type BlockType = typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES]

interface BlockContentTypes {
  [BLOCK_TYPES.TEXT]: string
  [BLOCK_TYPES.HEADING]: string
  [BLOCK_TYPES.IMAGE]: {
    url: string
    caption: string
  }
  [BLOCK_TYPES.TWO_COLUMNS]: {
    columns: Array<Array<any>>
  }
  [BLOCK_TYPES.SPECIFICATIONS]: {
    rows: Array<{ key: string; value: string }>
  }
  [BLOCK_TYPES.PROS_CONS]: {
    pros: string
    cons: string
  }
  [BLOCK_TYPES.LIST]: {
    items: Array<{ text: string }>
  }
  [BLOCK_TYPES.TABLE]: {
    data: Array<Array<string>>
  }
}

interface BlockConfig<T extends BlockType> {
  name: string
  icon: Component
  category: BlockCategory
  defaultContent: BlockContentTypes[T]
}

type BlockConfigMap = {
  [T in BlockType]: BlockConfig<T>
}

const BLOCK_CONFIG: BlockConfigMap = {
  [BLOCK_TYPES.TEXT]: {
    name: 'Текст',
    icon: TextIcon,
    category: BLOCK_CATEGORIES.BASIC,
    defaultContent: ''
  },
  [BLOCK_TYPES.HEADING]: {
    name: 'Заголовок',
    icon: HeadingIcon,
    category: BLOCK_CATEGORIES.BASIC,
    defaultContent: ''
  },
  [BLOCK_TYPES.IMAGE]: {
    name: 'Изображение',
    icon: ImageIcon,
    category: BLOCK_CATEGORIES.BASIC,
    defaultContent: {
      url: '',
      caption: ''
    }
  },
  [BLOCK_TYPES.TWO_COLUMNS]: {
    name: 'Колонки',
    icon: ColumnsIcon,
    category: BLOCK_CATEGORIES.BASIC,
    defaultContent: {
      columns: [[], []]
    }
  },
  [BLOCK_TYPES.SPECIFICATIONS]: {
    name: 'Характеристики',
    icon: TableIcon,
    category: BLOCK_CATEGORIES.CUSTOM,
    defaultContent: {
      rows: [
        { key: '', value: '' },
        { key: '', value: '' }
      ]
    }
  },
  [BLOCK_TYPES.PROS_CONS]: {
    name: 'Плюсы и минусы',
    icon: ThumbUpIcon,
    category: BLOCK_CATEGORIES.CUSTOM,
    defaultContent: {
      pros: '',
      cons: ''
    }
  },
  [BLOCK_TYPES.LIST]: {
    name: 'Список',
    icon: ListIcon,
    category: BLOCK_CATEGORIES.CUSTOM,
    defaultContent: {
      items: [
        { text: '' },
        { text: '' }
      ]
    }
  },
  [BLOCK_TYPES.TABLE]: {
    name: 'Таблица',
    icon: TableIcon,
    category: BLOCK_CATEGORIES.CUSTOM,
    defaultContent: {
      data: [
        ['', ''],
        ['', '']
      ]
    }
  }
} as const

export function getBlockConfig<T extends BlockType>(type: T): BlockConfig<T> {
  return BLOCK_CONFIG[type]
}

export function isBlockType(type: string): type is BlockType {
  return type in BLOCK_TYPES
} 