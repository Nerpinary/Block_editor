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
import EyeIcon from './EyeIcon.vue'
import SaveIcon from './SaveIcon.vue'
import ListIcon from './ListIcon.vue'
import ReturnIcon from './ReturnIcon.vue'
export type IconComponent = typeof BaseIcon

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
  ThumbDownIcon,
  EyeIcon,
  SaveIcon,
  ListIcon,
  ReturnIcon
} as const

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
  ThumbDownIcon,
  EyeIcon,
  SaveIcon,
  ListIcon,
  ReturnIcon
}

export default Icons 