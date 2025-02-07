<template>
  <div class="saved-pages min-h-screen bg-gray-50">
    <header class="saved-pages__header">
      <h1 class="text-lg font-medium text-gray-900">
        Сохраненные страницы
      </h1>
      <div class="flex gap-3">
        <button
          v-if="hasUnsavedChanges"
          @click="returnToEdit"
          class="btn btn-icon"
          title="Вернуться к редактированию"
        >
          <ReturnIcon :size="6" />
        </button>
        
        <button
          @click="createNewPage"
          class="create-button"
        >
          Создать новую
        </button>
      </div>
    </header>

    <main class="max-w-4xl mx-auto p-8">
      <div v-if="savedPages.length" class="space-y-4">
        <div 
          v-for="page in savedPages" 
          :key="page.id"
          class="page-card group"
        >
          <div>
            <h2 class="text-xl font-medium">{{ page.title }}</h2>
            <p class="text-gray-500 text-sm mt-1">
              /{{ page.slug }}
            </p>
            <p class="text-gray-400 text-sm mt-1">
              Создано: {{ formatDate(page.createdAt) }}
            </p>
          </div>
          
          <div class="flex gap-2">
            <button
              @click="editPage(page)"
              class="action-button action-button--gray"
            >
              Редактировать
            </button>
            <button
              @click="previewPage(page)"
              class="action-button action-button--blue"
            >
              Просмотр
            </button>
          </div>

          <DeleteBlockButton 
            @delete="confirmDelete(page)" 
            class="absolute top-2 right-2"
          />
        </div>
      </div>

      <div 
        v-else 
        class="empty-state"
      >
        Нет сохраненных страниц
      </div>

      <DeleteConfirmModal
        v-if="showDeleteConfirm"
        :page="pageToDelete"
        @confirm="deletePage"
        @cancel="closeDeleteModal"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useRouter } from 'vue-router'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal.vue'
import type { Page } from '@/types/page'
import ReturnIcon from '@/components/icons/ReturnIcon.vue'

const store = useEditorStore()
const router = useRouter()

const showDeleteConfirm = ref(false)
const pageToDelete = ref<Page | null>(null)

const savedPages = computed<Page[]>(() => store.savedPages)
const hasUnsavedChanges = computed(() => store.blocks.length > 0)

const formatDate = (date: string | number): string => {
  return new Date(date).toLocaleDateString()
}

const editPage = async (page: Page) => {
  await store.loadPage(page.id)
  router.push(`/?edit=${page.id}`)
}

const previewPage = (page: Page) => {
  store.loadPage(page.id)
  router.push(`/preview/${page.slug}`)
}

const confirmDelete = (page: Page) => {
  pageToDelete.value = page
  showDeleteConfirm.value = true
}

const closeDeleteModal = () => {
  showDeleteConfirm.value = false
  pageToDelete.value = null
}

const deletePage = async () => {
  if (!pageToDelete.value) return

  try {
    await store.deletePage(pageToDelete.value.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting page:', error)
    alert('Ошибка при удалении страницы')
  }
}

const createNewPage = () => {
  store.clearEditor()
  router.push('/')
}

const returnToEdit = () => {
  router.push('/')
}

onMounted(() => {
  store.loadSavedPages()
})
</script>

<script lang="ts">
export default {
  name: 'SavedPages'
}
</script>

<style lang="scss" scoped>
.saved-pages {
  &__header {
    @apply h-14 border-b bg-white px-4;
    @apply flex items-center justify-between;
    @apply sticky top-0 z-10;
  }
}

.create-button {
  @apply px-4 py-2 rounded-lg;
  @apply bg-blue-500 text-white;
  @apply hover:bg-blue-600;
  @apply transition-colors duration-200;
}

.page-card {
  @apply bg-white rounded-lg shadow p-4;
  @apply flex items-center justify-between;
  @apply relative;

  :deep(.delete-button) {
    @apply opacity-0 transition-opacity duration-200;
  }

  &:hover {
    :deep(.delete-button) {
      @apply opacity-100;
    }
  }
}

.action-button {
  @apply px-3 py-1.5 rounded;
  @apply transition-colors duration-200;

  &--gray {
    @apply bg-gray-100 text-gray-700;
    @apply hover:bg-gray-200;
  }

  &--blue {
    @apply bg-blue-500 text-white;
    @apply hover:bg-blue-600;
  }
}

.empty-state {
  @apply text-center py-12 text-gray-500;
}

.btn-icon {
  @apply w-11 h-11;
  @apply rounded-lg;
  @apply text-gray-700 hover:bg-gray-100;
  @apply flex items-center justify-center;
  @apply transition-all duration-200;
    
  svg {
    @apply transition-transform duration-200;
  }
    
  &:hover {
    @apply bg-gray-100 text-blue-500;
      
    svg {
      @apply scale-110;
      transform-origin: center;
    }
  }
}
</style> 