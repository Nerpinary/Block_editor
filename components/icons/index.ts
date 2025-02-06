// Импорты всех иконок
import BaseIcon from './BaseIcon.vue'
import TextIcon from './TextIcon.vue'
import HeadingIcon from './HeadingIcon.vue'
import ImageIcon from './ImageIcon.vue'
import ColumnsIcon from './ColumnsIcon.vue'
import CustomIcon from './CustomIcon.vue'
import DeleteIcon from './DeleteIcon.vue'
import DragIcon from './DragIcon.vue'
import ChevronUpIcon from './ChevronUpIcon.vue'
import ChevronDownIcon from './ChevronDownIcon.vue'
import DuplicateIcon from './DuplicateIcon.vue'
import DotsVerticalIcon from './DotsVerticalIcon.vue'
import ThumbUpIcon from './ThumbUpIcon.vue'
import ThumbDownIcon from './ThumbDownIcon.vue'

// Типы для иконок
export type IconComponent = typeof BaseIcon

// Объект со всеми иконками для удобного импорта
export const Icons = {
  BaseIcon,
  TextIcon,
  HeadingIcon,
  ImageIcon,
  ColumnsIcon,
  CustomIcon,
  DeleteIcon,
  DragIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DuplicateIcon,
  DotsVerticalIcon,
  ThumbUpIcon,
  ThumbDownIcon
} as const

// Именованные экспорты для отдельного импорта
export {
  BaseIcon,
  TextIcon,
  HeadingIcon,
  ImageIcon,
  ColumnsIcon,
  CustomIcon,
  DeleteIcon,
  DragIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DuplicateIcon,
  DotsVerticalIcon,
  ThumbUpIcon,
  ThumbDownIcon
}

// Экспорт по умолчанию
export default Icons 