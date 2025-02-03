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

<script>
import {
  DotsVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DuplicateIcon,
  DeleteIcon
} from '@/components/icons'

export default {
  name: 'BlockMenu',

  components: {
    DotsVerticalIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    DuplicateIcon,
    DeleteIcon
  },

  props: {
    index: {
      type: Number,
      required: true
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isOpen: false
    }
  },

  methods: {
    closeMenu() {
      this.isOpen = false
    },

    moveBlock(direction) {
      const fromIndex = this.index
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
      this.$store.commit('MOVE_BLOCK', { fromIndex, toIndex })
      this.closeMenu()
    },

    duplicateBlock() {
      this.$emit('duplicate')
      this.closeMenu()
    },

    removeBlock() {
      this.$emit('remove')
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