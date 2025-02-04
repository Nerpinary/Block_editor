<template>
  <div class="block-controls-wrapper">
    <div class="block-controls">
      <button class="control-button" title="Перетащить блок">
        <DragIcon :size="5" />
      </button>

      <div class="relative">
        <button @click="isMenuOpen = !isMenuOpen" class="control-button" title="Меню блока">
          <DotsVerticalIcon :size="5" />
        </button>

        <div v-if="isMenuOpen"
          class="block-menu absolute left-full ml-2 top-0 py-1 bg-white rounded-lg shadow-xl border min-w-[160px]"
          v-click-outside="closeMenu">
          <button v-if="index > 0" class="menu-item" @click="moveBlock('up')">
            <ChevronUpIcon :size="4" class="mr-2" />
            Переместить вверх
          </button>

          <button v-if="!isLast" class="menu-item" @click="moveBlock('down')">
            <ChevronDownIcon :size="4" class="mr-2" />
            Переместить вниз
          </button>

          <button class="menu-item" @click="$emit('duplicate')">
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
        el.clickOutsideEvent = function (event) {
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
  },

  mounted() {
    if (this.$refs.menu) {
      const button = this.$refs.menu.previousElementSibling;
      const rect = button.getBoundingClientRect();
      this.$refs.menu.style.left = `${rect.right + 8}px`;
      this.$refs.menu.style.top = `${rect.top}px`;
    }
  }
}
</script>

<style scoped>
.block-controls-wrapper {
  position: absolute;
  left: -3rem;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 1000;
}

.block-controls {
  position: relative;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.25rem;
}

.control-button {
  @apply p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors;
  display: block;
  width: 32px;
  height: 32px;
}

.menu-item {
  @apply w-full px-3 py-2 text-sm flex items-center hover:bg-gray-50 transition-colors text-gray-700;
}

.block-menu {
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 0.5rem;
  padding: 0.25rem 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 1001;
  animation: menuAppear 0.15s ease-out;
  transform-origin: left center;
}

@keyframes menuAppear {
  from {
    opacity: 0;
    transform: scale(0.95) translateX(-5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

.menu-item {
  position: relative;
  background: white;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item:active {
  background: #e5e7eb;
}

.menu-item + .menu-item {
  border-top: 1px solid #f3f4f6;
}
</style>