import type { Component } from 'vue';
import { BLOCK_TYPES, type BlockType, BLOCK_CATEGORIES, type BlockCategory } from '@/constants/blockTypes';
import TextBlock from '@/components/content/TextBlock.vue';
import HeadingBlock from '@/components/content/HeadingBlock.vue';
import ImageBlock from '@/components/content/ImageBlock.vue';
import ColumnsBlock from '@/components/layout/ColumnsBlock.vue';
import SpecificationsBlock from '@/components/content/SpecificationsBlock.vue';
import ProsConsBlock from '@/components/content/ProsConsBlock.vue';
import ListBlock from '@/components/content/ListBlock.vue';
import TableBlock from '@/components/content/TableBlock.vue';
import TextIcon from '@/components/icons/TextIcon.vue';
import HeadingIcon from '@/components/icons/HeadingIcon.vue';
import ImageIcon from '@/components/icons/ImageIcon.vue';
import ColumnsIcon from '@/components/icons/ColumnsIcon.vue';
import TableIcon from '@/components/icons/TableIcon.vue';
import ThumbUpIcon from '@/components/icons/ThumbUpIcon.vue';
import ListIcon from '@/components/icons/ListIcon.vue';

export interface BlockContentTypes {
  [BLOCK_TYPES.TEXT]: string;
  [BLOCK_TYPES.HEADING]: string;
  [BLOCK_TYPES.IMAGE]: { url: string; caption: string };
  [BLOCK_TYPES.TWO_COLUMNS]: { columns: Array<Array<any>> };
  [BLOCK_TYPES.SPECIFICATIONS]: { rows: Array<{ key: string; value: string }> };
  [BLOCK_TYPES.PROS_CONS]: { pros: string; cons: string };
  [BLOCK_TYPES.LIST]: { items: Array<{ text: string }> };
  [BLOCK_TYPES.TABLE]: { data: Array<Array<string>> };
}

interface BlockConfig<T extends BlockType> {
  name: string;
  icon: Component;
  category: BlockCategory;
  defaultContent: BlockContentTypes[T];
}

type BlockConfigMap = {
  [T in BlockType]: BlockConfig<T>;
};

export const BLOCK_CONFIG: BlockConfigMap = {
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
    defaultContent: { url: '', caption: '' }
  },
  [BLOCK_TYPES.TWO_COLUMNS]: {
    name: 'Колонки',
    icon: ColumnsIcon,
    category: BLOCK_CATEGORIES.BASIC,
    defaultContent: { columns: [[], []] }
  },
  [BLOCK_TYPES.SPECIFICATIONS]: {
    name: 'Характеристики',
    icon: TableIcon,
    category: BLOCK_CATEGORIES.CUSTOM,
    defaultContent: { rows: [{ key: '', value: '' }, { key: '', value: '' }] }
  },
  [BLOCK_TYPES.PROS_CONS]: {
    name: 'Плюсы и минусы',
    icon: ThumbUpIcon,
    category: BLOCK_CATEGORIES.CUSTOM,
    defaultContent: { pros: '', cons: '' }
  },
  [BLOCK_TYPES.LIST]: {
    name: 'Список',
    icon: ListIcon,
    category: BLOCK_CATEGORIES.CUSTOM,
    defaultContent: { items: [{ text: '' }, { text: '' }] }
  },
  [BLOCK_TYPES.TABLE]: {
    name: 'Таблица',
    icon: TableIcon,
    category: BLOCK_CATEGORIES.CUSTOM,
    defaultContent: { data: [['', ''], ['', '']] }
  }
} as const;

export const componentMap: Record<BlockType, Component> = {
  [BLOCK_TYPES.TEXT]: TextBlock,
  [BLOCK_TYPES.HEADING]: HeadingBlock,
  [BLOCK_TYPES.IMAGE]: ImageBlock,
  [BLOCK_TYPES.TWO_COLUMNS]: ColumnsBlock,
  [BLOCK_TYPES.SPECIFICATIONS]: SpecificationsBlock,
  [BLOCK_TYPES.PROS_CONS]: ProsConsBlock,
  [BLOCK_TYPES.LIST]: ListBlock,
  [BLOCK_TYPES.TABLE]: TableBlock
};

export function getBlockConfig<T extends BlockType>(type: T): BlockConfig<T> {
  return BLOCK_CONFIG[type];
}

export function getDefaultContent<T extends BlockType>(type: T): BlockContentTypes[T] {
  return structuredClone(BLOCK_CONFIG[type].defaultContent);
}

export function isBlockType(type: string): type is BlockType {
  return Object.values(BLOCK_TYPES).includes(type as BlockType);
}