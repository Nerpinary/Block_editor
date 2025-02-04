<template>
  <div class="pros-cons-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart($event)" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="$emit('duplicate')" />

    <DeleteBlockButton @delete="$emit('remove')" />

    <div class="block-content">
      <div class="block-header flex items-center justify-between mb-4">
        <div class="block-type text-sm text-gray-500">Плюсы и минусы</div>
      </div>

      <h3 class="text-lg font-semibold mb-4">Плюсы и минусы</h3>

      <div class="space-y-4">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-6 h-6 text-green-500 mt-1">
            <ThumbUpIcon :size="6" />
          </div>
          <input
            type="text"
            v-model="localContent.pros"
            class="flex-grow bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
            placeholder="Введите преимущества"
            @input="updateContent"
          >
        </div>

        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-6 h-6 text-red-500 mt-1">
            <ThumbDownIcon :size="6" />
          </div>
          <input
            type="text"
            v-model="localContent.cons"
            class="flex-grow bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
            placeholder="Введите недостатки"
            @input="updateContent"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dragdrop from '@/mixins/dragdrop'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'
import ThumbUpIcon from '@/components/icons/ThumbUpIcon.vue'
import ThumbDownIcon from '@/components/icons/ThumbDownIcon.vue'

export default {
  name: 'ProsConsBlock',

  components: {
    DeleteBlockButton,
    BlockControls,
    ThumbUpIcon,
    ThumbDownIcon
  },

  mixins: [dragdrop],

  props: {
    content: {
      type: [String, Object],
      default: () => ({
        pros: '',
        cons: ''
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
      localContent: {
        pros: '',
        cons: ''
      },
      dragState: {
        isDragging: false
      }
    }
  },

  mounted() {
    this.localContent = {
      pros: this.content.pros || '',
      cons: this.content.cons || ''
    }
  },

  methods: {
    updateContent() {
      this.$emit('update:content', { ...this.localContent })
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
    content: {
      handler(newContent) {
        if (JSON.stringify(newContent) !== JSON.stringify(this.localContent)) {
          this.localContent = {
            pros: newContent.pros || '',
            cons: newContent.cons || ''
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.pros-cons-block {
  @apply bg-white rounded-lg shadow-sm p-4;
}
</style> 