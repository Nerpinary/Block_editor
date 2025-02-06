<template>
  <div class="min-h-screen flex">
    <BlockLibrary @add-block="addBlock" />

    <div class="flex-1 bg-gray-50">
      <EditorHeader 
        :current-page-id="currentPageId"
        :page-title="pageTitle"
        :page-slug="pageSlug"
        @preview="handlePreview"
        @saved="onPageSaved"
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
import { ref, computed, onMounted } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useRoute, useRouter } from 'vue-router'
import BlockLibrary from '@/components/editor/BlockLibrary.vue'
import EditorHeader from '@/components/editor/EditorHeader.vue'
import EditorContent from '@/components/editor/EditorContent.vue'
import Notification from '@/components/shared/Notification.vue'
import type { Block, Page, PageData } from '@/types'

const router = useRouter()
const route = useRoute()
const store = useEditorStore()
const showSaveDialog = ref(false)

const showNotification = ref(false)
const notificationMessage = ref('')
const currentPageId = ref<string | null>(null)
const pageTitle = ref('')
const pageSlug = ref('')

const blocks = computed(() => store.blocks)

const addBlock = (block: { type: string; content: any }) => {
  console.log('Adding block:', block)
  const newBlock: Block = {
    id: Date.now(),
    type: block.type,
    content: block.content,
    parentId: 'main-editor'
  }
  store.addBlock(newBlock)
}

const updateBlockContent = ({ index, content }: { index: number; content: string }) => {
  const block = { ...blocks.value[index] }
  block.content = content
  store.updateBlock({ index, block })
}

const removeBlock = ({ index }: { index: number }) => {
  store.removeBlock(index)
}

const handleSave = async (pageData: PageData) => {
  try {
    await store.savePage({
      title: pageData.title,
      slug: pageData.slug,
      blocks: store.blocks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    showSaveDialog.value = false
    // Можно добавить уведомление об успешном сохранении
    router.push('/saved-pages') // или другой редирект после сохранения
  } catch (error) {
    console.error('Error saving page:', error)
    // Можно добавить уведомление об ошибке
  }
}

const onPageSaved = async (pageData: PageData) => {
  await handleSave(pageData)
}

const handlePreview = () => {
  // Сохраняем текущие блоки в localStorage перед переходом
  localStorage.setItem('temp_blocks', JSON.stringify(store.blocks))
  // Переходим на страницу предпросмотра
  router.push('/preview')
}

onMounted(async () => {
  const fromPreview = route.query.from === 'preview'
  const editPageId = route.query.edit as string | undefined
  
  if (editPageId) {
    currentPageId.value = editPageId
    const page = await store.loadPage(currentPageId.value) as Page
    if (page) {
      pageTitle.value = page.title
      pageSlug.value = page.slug
    }
  } else if (fromPreview) {
    // Восстанавливаем блоки из временного хранилища
    const tempBlocks = localStorage.getItem('temp_blocks')
    if (tempBlocks) {
      store.setBlocks(JSON.parse(tempBlocks))
      localStorage.removeItem('temp_blocks') // Очищаем после восстановления
    }
  } else {
    store.setBlocks([])
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
