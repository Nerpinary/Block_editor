<template>
  <div class="block-menu">
    <button @click="isOpen = !isOpen"
      class="menu-trigger absolute left-2 top-2 p-1.5 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
      title="Меню блока">
      <DotsVerticalIcon :size="4" />
    </button>

    <div v-if="isOpen"
      class="menu-dropdown absolute left-12 top-0 py-1 bg-white rounded-lg shadow-lg border z-50 min-w-[160px]"
      v-click-outside="closeMenu">
      <button v-if="!isFirst" class="menu-item" @click="moveBlock('up')">
        <ChevronUpIcon :size="4" class="mr-2" />
        Переместить вверх
      </button>

      <button v-if="!isLast" class="menu-item" @click="moveBlock('down')">
        <ChevronDownIcon :size="4" class="mr-2" />
        Переместить вниз
      </button>

      <button class="menu-item" @click="duplicateBlock">
        <DuplicateIcon :size="4" class="mr-2" />
        Дублировать
      </button>

      <div class="border-t my-1"></div>

      <button class="menu-item text-red-600 hover:bg-red-50" @click="removeBlock">
        <DeleteIcon :size="4" class="mr-2" />
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DirectiveBinding } from 'vue'
import { useEditorStore } from '@/stores/editor'
import {
  DotsVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DuplicateIcon,
  DeleteIcon
} from '@/components/icons'

interface CustomHTMLElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void
}

type MoveDirection = 'up' | 'down'

interface Props {
  index: number
  isFirst?: boolean
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isFirst: false,
  isLast: false
})

const emit = defineEmits<{
  (e: 'duplicate'): void
  (e: 'remove'): void
}>()

const store = useEditorStore()
const isOpen = ref(false)

const closeMenu = () => {
  isOpen.value = false
}

const moveBlock = (direction: MoveDirection) => {
  const fromIndex = props.index
  const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
  store.moveBlock(fromIndex, toIndex)
  closeMenu()
}

const duplicateBlock = () => {
  emit('duplicate')
  closeMenu()
}

const removeBlock = () => {
  emit('remove')
  closeMenu()
}

const vClickOutside = {
  mounted(el: CustomHTMLElement, binding: DirectiveBinding) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: CustomHTMLElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}
</script>

<style scoped>
.menu-trigger {
  opacity: 0;
  z-index: 10;
}

.editor-block:hover .menu-trigger {
  opacity: 1;
}

.menu-item {
  @apply w-full px-3 py-2 text-sm flex items-center hover:bg-gray-50 transition-colors;
}

.menu-dropdown {
  z-index: 20;
}
</style>