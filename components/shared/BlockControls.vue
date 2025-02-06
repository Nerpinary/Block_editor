<template>
  <div class="block-controls-wrapper">
    <div class="block-controls">
      <button class="control-button" title="Перетащить блок">
        <DragIcon :size="5" />
      </button>

      <div class="relative">
        <button 
          @click="toggleMenu" 
          class="control-button" 
          title="Меню блока"
        >
          <DotsVerticalIcon :size="5" />
        </button>

        <div 
          v-if="isMenuOpen"
          class="block-menu"
          v-click-outside="closeMenu"
        >
          <button 
            v-if="index > 0" 
            class="menu-item" 
            @click="handleMove('up')"
          >
            <ChevronUpIcon :size="4" class="mr-2" />
            Переместить вверх
          </button>

          <button 
            v-if="!isLast" 
            class="menu-item" 
            @click="handleMove('down')"
          >
            <ChevronDownIcon :size="4" class="mr-2" />
            Переместить вниз
          </button>

          <button 
            class="menu-item" 
            @click="handleDuplicate"
          >
            <DuplicateIcon :size="4" class="mr-2" />
            Дублировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DirectiveBinding } from 'vue'
import {
  DragIcon,
  DotsVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DuplicateIcon
} from '@/components/icons'

interface CustomHTMLElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void
}

type MoveDirection = 'up' | 'down'

interface Props {
  index: number
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLast: false
})

const emit = defineEmits<{
  (e: 'move', direction: MoveDirection): void
  (e: 'duplicate'): void
}>()

const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleMove = (direction: MoveDirection) => {
  emit('move', direction)
  closeMenu()
}

const handleDuplicate = () => {
  emit('duplicate')
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

<style lang="scss" scoped>
.block-controls {
  &-wrapper {
    @apply absolute -left-12 top-0 h-full flex items-center z-[1000];
  }

  @apply relative bg-white rounded-lg shadow-sm border border-gray-100 p-1;
}

.control-button {
  @apply p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors;
  @apply block w-8 h-8;
}

.block-menu {
  @apply absolute left-full top-0 ml-2 py-1 bg-white rounded-lg shadow-xl border min-w-[160px] z-[1001];
  animation: menuAppear 0.15s ease-out;
  transform-origin: left center;
}

.menu-item {
  @apply w-full px-3 py-2 text-sm flex items-center text-gray-700;
  @apply relative bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors;
  
  & + & {
    @apply border-t border-gray-100;
  }
}

@keyframes menuAppear {
  from {
    @apply opacity-0;
    transform: scale(0.95) translateX(-5px);
  }
  to {
    @apply opacity-100;
    transform: scale(1) translateX(0);
  }
}
</style>