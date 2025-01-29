<template>
  <div class="min-h-screen flex">
    <BlockLibrary @add-block="addBlock" />

    <!-- Основная область редактирования -->
    <div class="flex-1 bg-gray-50">
      <EditorHeader @preview="$router.push('/preview')" />
      
      <EditorContent 
        :blocks="blocks"
        @update-content="updateBlockContent"
        @remove-block="removeBlock"
      />
    </div>
  </div>
</template>

<script>
import BlockLibrary from '@/components/editor/BlockLibrary.vue'
import EditorHeader from '@/components/editor/EditorHeader.vue'
import EditorContent from '@/components/editor/EditorContent.vue'

export default {
  name: 'EditorPage',

  components: {
    BlockLibrary,
    EditorHeader,
    EditorContent
  },

  computed: {
    blocks() {
      return this.$store.state.blocks
    }
  },

  methods: {
    addBlock(block) {
      console.log('Adding block:', block.type)
      const newBlock = {
        id: Date.now(),
        type: block.type,
        content: block.type === 'two-columns' ? JSON.stringify({ left: [], right: [] }) : '',
        parentId: 'main-editor'
      }
      this.$store.commit('ADD_BLOCK', newBlock)
    },

    updateBlockContent({ index, content }) {
      const block = { ...this.blocks[index] }
      block.content = content
      this.$store.commit('UPDATE_BLOCK', { index, block })
    },

    removeBlock({ index }) {
      this.$store.commit('REMOVE_BLOCK', index)
    }
  }
}
</script>

<style scoped>
.block-wrapper {
  transition: all 0.3s ease;
  margin-bottom: 1rem; /* 16px */
}

.block-wrapper:hover {
  transform: translateX(8px);
}

/* Анимации для TransitionGroup */
.list-move {
  transition: transform 0.3s ease;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Трансформации для блоков */
.transform {
  transition: transform 0.3s ease;
}

.scale-98 {
  transform: scale(0.98);
}

/* Стили для места вставки */
.drop-indicator {
  height: 2px;
  background-color: #3b82f6;
  margin: 8px 0;
  transition: opacity 0.2s ease;
}

/* Добавим немного стилей для сайдбара */
.bg-gray-800 {
  background-color: #2d3748;
}
.sidebar__button {
  height: 100%;
}

/* Уточним отступы для индикатора вставки */
[v-if="isDragging && dropIndex === index"] {
  margin: 0.75rem 0; /* 12px сверху и снизу */
}

/* Добавим стили для иконок */
.w-4 {
  width: 1rem;
}
.h-4 {
  height: 1rem;
}

.block-item {
  cursor: grab;
}

.block-item:active {
  cursor: grabbing;
}

.dragging {
  cursor: grabbing !important;
}

.drag-wrapper {
  cursor: move;
  position: relative;
}

.drag-wrapper[data-dragging="true"] {
  opacity: 0.5;
}

/* Добавляем иконку перетаскивания */
.drag-wrapper::before {
  content: "⋮";
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #666;
}

.block-library-item {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.block-library-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.block-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  color: #6B7280;
}

.name {
  font-size: 0.875rem;
  color: #374151;
}

.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.sortable-drag {
  opacity: 0.5;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}
</style>
