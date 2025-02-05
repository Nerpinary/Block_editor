<template>
  <div class="list-block border rounded p-4 relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart($event)" @dragend="onDragEnd">
    <DeleteBlockButton @delete="$emit('remove')" />
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="$emit('duplicate')" />

    <div class="block-content">
      <div class="block-header flex items-center justify-between mb-4">
        <div class="block-type text-sm text-gray-500">Список</div>
      </div>

      <div class="space-y-3">
        <div v-for="(item, idx) in localItems" :key="idx" class="flex items-center gap-2">
          <div class="flex-grow">
            <input
              type="text"
              v-model="item.text"
              class="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
              placeholder="Введите текст"
              @input="updateContent"
            >
          </div>
          <div class="flex items-center gap-2">
            <button 
              v-if="localItems.length > 2"
              @click="removeItem(idx)"
              class="p-1 text-red-500 hover:text-red-600 transition-colors"
              title="Удалить пункт"
            >
              <MinusIcon :size="5" />
            </button>
            <button 
              v-if="idx === localItems.length - 1"
              @click="addItem"
              class="p-1 text-green-500 hover:text-green-600 transition-colors"
              title="Добавить пункт"
            >
              <PlusIcon :size="5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dragdrop from '@/mixins/dragdrop'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import MinusIcon from '@/components/icons/MinusIcon.vue'

export default {
  name: 'ListBlock',

  components: {
    DeleteBlockButton,
    BlockControls,
    PlusIcon,
    MinusIcon
  },

  mixins: [dragdrop],

  props: {
    content: {
      type: [Object, String],
      default: () => ({
        items: [
          { text: '' },
          { text: '' }
        ]
      })
    },
    index: {
      type: Number,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: null
    },
    isInsideColumn: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      localItems: [],
      dragState: {
        isDragging: false
      }
    }
  },

  created() {
    const initialContent = typeof this.content === 'string' ? { items: [{ text: '' }, { text: '' }] } : this.content
    this.localItems = JSON.parse(JSON.stringify(initialContent.items || [{ text: '' }, { text: '' }]))
  },

  methods: {
    updateContent() {
      const newItems = this.localItems.map(item => ({ ...item }))
      this.$emit('update:content', {
        items: newItems
      })
    },

    addItem() {
      const newItems = [...this.localItems, { text: '' }]
      this.localItems = newItems
      this.updateContent()
    },

    removeItem(index) {
      if (this.localItems.length > 2) {
        const newItems = [...this.localItems]
        newItems.splice(index, 1)
        this.localItems = newItems
        this.updateContent()
      }
    },

    handleMove(direction) {
      this.$emit('move', {
        direction,
        index: this.index,
        parentId: this.parentId
      })
    }
  },

  watch: {
    'content.items': {
      handler(newItems) {
        if (newItems && JSON.stringify(newItems) !== JSON.stringify(this.localItems)) {
          this.localItems = JSON.parse(JSON.stringify(newItems))
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.list-block {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.list-block :deep(.block-controls),
.list-block :deep(.delete-button) {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.list-block:hover :deep(.block-controls),
.list-block:hover :deep(.delete-button) {
  opacity: 1;
}
</style> 