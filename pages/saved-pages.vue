<template>
  <div class="min-h-screen bg-gray-50">
    <div class="h-14 border-b bg-white px-4 flex items-center justify-between sticky top-0 z-10">
      <h1 class="text-lg font-medium text-gray-900">Сохраненные страницы</h1>
      <button
        @click="$router.push('/')"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Создать новую
      </button>
    </div>

    <div class="max-w-4xl mx-auto p-8">
      <div v-if="savedPages.length" class="space-y-4">
        <div 
          v-for="page in savedPages" 
          :key="page.id"
          class="bg-white rounded-lg shadow p-4 flex items-center justify-between relative group"
        >
          <div>
            <h2 class="text-xl font-medium">{{ page.title }}</h2>
            <p class="text-gray-500 text-sm mt-1">
              /{{ page.slug }}
            </p>
            <p class="text-gray-400 text-sm mt-1">
              Создано: {{ new Date(page.createdAt).toLocaleDateString() }}
            </p>
          </div>
          
          <div class="flex gap-2">
            <button
              @click="editPage(page)"
              class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Редактировать
            </button>
            <button
              @click="previewPage(page)"
              class="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
        class="text-center py-12 text-gray-500"
      >
        Нет сохраненных страниц
      </div>

      <!-- Модальное окно подтверждения удаления -->
      <div 
        v-if="showDeleteConfirm" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-[400px] shadow-xl">
          <h3 class="text-lg font-medium mb-4">Подтверждение удаления</h3>
          <p class="text-gray-600 mb-6">
            Вы уверены, что хотите удалить страницу "{{ pageToDelete?.title }}"?
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              @click="deletePage"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'

export default {
  name: 'SavedPages',

  components: {
    DeleteBlockButton
  },

  data() {
    return {
      showDeleteConfirm: false,
      pageToDelete: null
    }
  },

  computed: {
    savedPages() {
      return this.$store.state.savedPages
    }
  },

  mounted() {
    this.$store.dispatch('loadSavedPages')
  },

  methods: {
    async editPage(page) {
      await this.$store.dispatch('loadPage', page.id)
      this.$router.push(`/?edit=${page.id}`)
    },

    previewPage(page) {
      this.$store.dispatch('loadPage', page.id)
      this.$router.push(`/preview/${page.slug}`)
    },

    confirmDelete(page) {
      this.pageToDelete = page
      this.showDeleteConfirm = true
    },

    async deletePage() {
      if (!this.pageToDelete) return

      try {
        await this.$store.dispatch('deletePage', this.pageToDelete.id)
        this.showDeleteConfirm = false
        this.pageToDelete = null
      } catch (error) {
        alert('Ошибка при удалении страницы')
      }
    }
  }
}
</script>

<style scoped>
.group:hover :deep(.delete-button) {
  opacity: 1;
}

:deep(.delete-button) {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}
</style> 