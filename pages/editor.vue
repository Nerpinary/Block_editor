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
import { ref, computed, onMounted, toRaw, watch } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useRoute, useRouter } from 'vue-router'
import BlockLibrary from '@/components/editor/BlockLibrary.vue'
import EditorHeader from '@/components/editor/EditorHeader.vue'
import EditorContent from '@/components/editor/EditorContent.vue'
import Notification from '@/components/shared/Notification.vue'
import type { Block, BlockType } from '@/types/blocks'
import type { Page } from '@/types/page'
import type { PageData } from '@/types/page'

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

interface AddBlockParams {
  type: BlockType
  content: any
}

const addBlock = (block: AddBlockParams) => {
  console.log('Adding block:', block)
  const newBlock: Block = {
    id: Date.now(),
    type: block.type,
    content: block.content,
    parentId: 'main-editor'
  }
  store.addBlock(newBlock)
}

const updateBlockContent = ({ index, content }: { index: number; content: string | object }) => {
  const currentBlock = blocks.value[index]
  
  console.log('Current block:', currentBlock)
  console.log('Incoming content:', content)
  
  const updatedBlock = {
    ...currentBlock,
    content
  }
  
  console.log('Updated block before store:', updatedBlock)
  store.updateBlock({ index, block: updatedBlock as Block })
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
    router.push('/saved-pages')
  } catch (error) {
    console.error('Error saving page:', error)
  }
}

const onPageSaved = async (pageData: PageData) => {
  await handleSave(pageData)
}

const handlePreview = () => {
  const rawBlocks = toRaw(store.blocks).map(block => ({
    id: block.id,
    type: block.type,
    content: toRaw(block.content)
  }))
  
  console.log('Raw blocks for preview:', rawBlocks)
  localStorage.setItem('temp_blocks', JSON.stringify(rawBlocks))
  router.push('/preview')
}

onMounted(() => {
  if (route.query.from === 'preview') {
    const tempBlocks = localStorage.getItem('temp_blocks')
    console.log('Loading blocks from preview:', tempBlocks)
    if (tempBlocks) {
      try {
        const blocks = JSON.parse(tempBlocks)
        store.setBlocks(blocks)
      } catch (error) {
        console.error('Error parsing blocks:', error)
      }
    }
  }
})

onBeforeRouteLeave((to) => {
  if (to.path === '/preview') {
    const rawBlocks = toRaw(store.blocks).map(block => ({
      id: block.id,
      type: block.type,
      content: toRaw(block.content)
    }))
    localStorage.setItem('temp_blocks', JSON.stringify(rawBlocks))
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
