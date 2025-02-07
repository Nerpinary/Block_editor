<template>
  <div class="min-h-screen flex">
    <BlockLibrary @add-block="addBlock" />

    <div class="flex-1 bg-gray-50">
      <EditorHeader 
        :current-page-id="currentPageId"
        :page-title="pageTitle"
        :page-slug="pageSlug"
        @preview="handlePreview"
        @saved="savePage"
      />

      <EditorContent 
        :blocks="blocks" 
        @update-content="updateBlockContent" 
        @remove-block="removeBlock" 
      />
    </div>

    <Notification 
      v-model:show="showNotification"
      :message="notificationMessage"
      type="success"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRaw, watch } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import BlockLibrary from '@/components/editor/BlockLibrary.vue'
import EditorHeader from '@/components/editor/EditorHeader.vue'
import EditorContent from '@/components/editor/EditorContent.vue'
import Notification from '@/components/shared/Notification.vue'
import type { Block, BlockType } from '@/types/blocks'
import type { Page, PageData } from '@/types/page'

const router = useRouter()
const route = useRoute()
const store = useEditorStore()
const showNotification = ref(false)
const notificationMessage = ref('')
const currentPageId = ref<string | null>(null)
const pageTitle = ref('')
const pageSlug = ref('')

const blocks = computed(() => store.blocks)

watch(
  () => route.query.edit,
  async (newId) => {
    if (newId) {
      await store.loadPage(newId as string)
      if (store.currentPage) {
        pageTitle.value = store.currentPage.title
        pageSlug.value = store.currentPage.slug
      }
    }
  },
  { immediate: true }
)

const addBlock = (block: { type: BlockType; content: any }) => {
  store.addBlock({
    id: Date.now(),
    type: block.type,
    content: block.content,
    parentId: 'main-editor'
  })
}

const updateBlockContent = ({ index, content }: { index: number; content: string | object }) => {
  const currentBlock = blocks.value[index]
  if (currentBlock) {
    store.updateBlock({ index, block: { ...currentBlock, content } as Block })
  }
}

const removeBlock = ({ index }: { index: number }) => {
  store.removeBlock(index)
}

const savePage = async (pageData: PageData) => {
  try {
    const pageToSave: Partial<Page> = {
      ...pageData,
      id: pageData.id ? String(pageData.id) : undefined
    }
    await store.savePage(pageToSave)
    router.push('/saved-pages')
  } catch (error) {
    console.error('Error saving page:', error)
  }
}

const handlePreview = () => {
  localStorage.setItem('temp_blocks', JSON.stringify(toRaw(store.blocks)))
  router.push('/preview')
}

onMounted(() => {
  if (route.query.from === 'preview') {
    const tempBlocks = localStorage.getItem('temp_blocks')
    if (tempBlocks) {
      try {
        store.setBlocks(JSON.parse(tempBlocks))
      } catch (error) {
        console.error('Error parsing blocks:', error)
      }
    }
  }
})

onBeforeRouteLeave((to) => {
  if (to.path === '/preview') {
    localStorage.setItem('temp_blocks', JSON.stringify(toRaw(store.blocks)))
  }
})
</script>

<style lang="scss" scoped>
.block {
  &-wrapper {
    @apply transition-all duration-300 ease-in-out mb-4;
    &:hover {
      transform: translateX(8px);
    }
  }

  &-library-item {
    @apply cursor-pointer p-2 rounded-md transition-colors duration-200;
    &:hover {
      @apply bg-gray-50;
    }
  }

  &-content {
    @apply flex items-center gap-2;
  }

  &-item {
    @apply cursor-grab;
    &:active {
      @apply cursor-grabbing;
    }
  }
}

.list {
  &-move {
    @apply transition-transform duration-300 ease-in-out;
  }
  &-enter-active,
  &-leave-active {
    @apply transition-all duration-300 ease-in-out;
  }
  &-enter-from,
  &-leave-to {
    @apply opacity-0;
    transform: translateX(30px);
  }
}

.drag-wrapper {
  @apply cursor-move relative;
  &[data-dragging="true"] {
    @apply opacity-50;
  }
  &::before {
    content: "⋮";
    @apply absolute -left-5 top-1/2 text-xl text-gray-600;
    transform: translateY(-50%);
  }
}

.sortable {
  &-ghost {
    @apply opacity-50 bg-blue-100;
  }
  &-drag {
    @apply opacity-50;
  }
}

.flip-list-move {
  @apply transition-transform duration-500;
}

.no-move {
  @apply transition-transform duration-0;
}
</style>