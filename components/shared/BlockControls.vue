<template>
  <div class="block-controls-wrapper absolute -left-12 top-0 h-full flex items-center">
    <div class="block-controls bg-white rounded-lg shadow-sm border p-1">
      <!-- Кнопка drag-n-drop -->
      <button 
        class="control-button"
        title="Перетащить блок"
      >
        <DragIcon :size="5" />
      </button>

      <div class="relative">
        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="control-button"
          title="Меню блока"
        >
          <DotsVerticalIcon :size="5" />
        </button>

        <div 
          v-if="isMenuOpen"
          class="absolute left-full ml-2 top-0 py-1 bg-white rounded-lg shadow-lg border z-50 min-w-[160px]"
          v-click-outside="closeMenu"
        >
          <button 
            v-if="index > 0"
            class="menu-item"
            @click="moveBlock('up')"
          >
            <ChevronUpIcon :size="4" class="mr-2" />
            Переместить вверх
          </button>

          <button 
            v-if="!isLast"
            class="menu-item"
            @click="moveBlock('down')"
          >
            <ChevronDownIcon :size="4" class="mr-2" />
            Переместить вниз
          </button>

          <button 
            class="menu-item"
            @click="$emit('duplicate')"
          >
            <DuplicateIcon :size="4" class="mr-2" />
            Дублировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  DragIcon,
  DotsVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DuplicateIcon
} from '@/components/icons'

export default {
  name: 'BlockControls',

  components: {
    DragIcon,
    DotsVerticalIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    DuplicateIcon
  },

  props: {
    index: {
      type: Number,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isMenuOpen: false
    }
  },

  methods: {
    closeMenu() {
      this.isMenuOpen = false
    },

    moveBlock(direction) {
      this.$emit('move', direction)
      this.closeMenu()
    }
  },

  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event)
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
.control-button {
  @apply p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors;
  display: block;
  width: 32px;
  height: 32px;
}

.menu-item {
  @apply w-full px-3 py-2 text-sm flex items-center hover:bg-gray-50 transition-colors;
}
</style> 