<template>
  <div class="h-14 border-b bg-white px-4 flex items-center justify-between">
    <h1 class="text-lg font-medium text-gray-900">{{ title }}</h1>
    <div class="flex gap-2">
      <button 
        v-for="action in actions" 
        :key="action.name" 
        @click="handleAction(action.event)"
        class="btn btn-primary"
      >
        {{ action.name }}
      </button>
      <button 
        @click="handleSave"
        class="btn btn-primary"
      >
        Сохранить
      </button>
      <button 
        @click="router.push('/saved-pages')"
        class="btn btn-secondary"
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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { PageData } from '@/types/page'
import type { EditorAction } from '@/types/editor'
import SavePageDialog from './SavePageDialog.vue'

interface Props {
  title?: string
  actions?: EditorAction[]
  currentPageId?: string | number | null
  pageTitle?: string
  pageSlug?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Редактор',
  actions: () => [
    { name: 'Предпросмотр', event: 'preview' }
  ],
  currentPageId: null,
  pageTitle: '',
  pageSlug: ''
})

const emit = defineEmits<{
  preview: []
  saved: [data: PageData]
  [key: string]: any[]
}>()

const router = useRouter()
const showSaveDialog = ref(false)

const handleAction = (event: string) => {
  try {
    emit(event)
  } catch (error) {
    console.error(`Error handling action ${event}:`, error)
  }
}

const handleSave = () => {
  try {
    if (props.currentPageId) {
      emit('saved', {
        title: props.pageTitle,
        slug: props.pageSlug
      })
    } else {
      showSaveDialog.value = true
    }
  } catch (error) {
    console.error('Error handling save:', error)
  }
}

const onPageSaved = (data: PageData) => {
  try {
    emit('saved', data)
    showSaveDialog.value = false
  } catch (error) {
    console.error('Error handling page save:', error)
  }
}
</script>

<style lang="scss" scoped>
.btn {
  @apply px-4 py-2 rounded-lg transition-colors;

  &-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600;
  }

  &-secondary {
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  }
}
</style>