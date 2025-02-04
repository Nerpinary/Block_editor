<template>
  <div class="h-14 border-b bg-white px-4 flex items-center justify-between">
    <h1 class="text-lg font-medium text-gray-900">{{ title }}</h1>
    <div class="flex gap-2">
      <button v-for="action in actions" :key="action.name" @click="$emit(action.event)"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        {{ action.name }}
      </button>
      <button 
        @click="handleSave"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Сохранить
      </button>
      <button 
        @click="$router.push('/saved-pages')"
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Все страницы
      </button>
      
      <SavePageDialog
        v-if="showSaveDialog"
        @close="showSaveDialog = false"
        @saved="onPageSaved"
      />
    </div>
  </div>
</template>

<script>
import SavePageDialog from './SavePageDialog.vue'

export default {
  name: 'EditorHeader',
  
  components: {
    SavePageDialog
  },

  props: {
    title: {
      type: String,
      default: 'Редактор'
    },
    actions: {
      type: Array,
      default: () => [
        { name: 'Предпросмотр', event: 'preview' }
      ]
    },
    currentPageId: {
      type: [String, Number],
      default: null
    },
    pageTitle: {
      type: String,
      default: ''
    },
    pageSlug: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      showSaveDialog: false
    }
  },

  methods: {
    handleSave() {
      if (this.currentPageId) {
        this.$emit('saved', {
          title: this.pageTitle,
          slug: this.pageSlug
        })
      } else {
        this.showSaveDialog = true
      }
    },

    onPageSaved(pageData) {
      this.$emit('saved', pageData)
      this.showSaveDialog = false
    }
  }
}
</script>