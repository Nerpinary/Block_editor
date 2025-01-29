import TextIcon from '@/components/icons/TextIcon.vue'
import HeadingIcon from '@/components/icons/HeadingIcon.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import ColumnsIcon from '@/components/icons/ColumnsIcon.vue'

export const BLOCK_TYPES = {
  TEXT: 'Text',
  HEADING: 'Heading',
  IMAGE: 'Image',
  TWO_COLUMNS: 'Columns'
}

const BLOCK_CONFIG = {
  [BLOCK_TYPES.TEXT]: {
    name: 'Текст',
    icon: TextIcon,
    defaultContent: ''
  },
  [BLOCK_TYPES.HEADING]: {
    name: 'Заголовок',
    icon: HeadingIcon,
    defaultContent: ''
  },
  [BLOCK_TYPES.IMAGE]: {
    name: 'Изображение',
    icon: ImageIcon,
    defaultContent: {
      url: '',
      caption: ''
    }
  },
  [BLOCK_TYPES.TWO_COLUMNS]: {
    name: 'Колонки',
    icon: ColumnsIcon,
    defaultContent: {
      columns: [[], []]
    }
  }
}

export function getBlockConfig(type) {
  return BLOCK_CONFIG[type]
} 