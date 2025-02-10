<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-[500px] shadow-xl relative">
      <h2 class="text-xl font-semibold mb-4">Сохранение страницы</h2>
      
      <div class="space-y-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Заголовок страницы
          </label>
          <input 
            v-model="title" 
            @input="generateSlug"
            class="form-input"
            placeholder="Например: 18 лучших мультиварок"
          />
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            URL страницы
          </label>
          <div class="flex items-center space-x-2">
            <span class="text-gray-500">/</span>
            <input 
              v-model="slug"
              class="form-input"
              placeholder="18-luchshih-multivarok"
            />
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button 
          @click="closeDialog"
          class="btn btn-secondary"
        >
          Отмена
        </button>
        <button 
          @click="handleSave"
          class="btn btn-primary"
        >
          Сохранить
        </button>
      </div>
    </div>

    <Notification 
      v-model:show="notification.show"
      :message="notification.message"
      :type="notification.type"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PageData } from '@/types/page'
import Notification from '@/components/shared/Notification.vue'
import type { NotificationType } from '@/types/notification'

const props = withDefaults(defineProps<{
  modelValue: boolean
  showNotification?: (message: string, type: 'success' | 'error') => void
}>(), {
  modelValue: false
})
const emit = defineEmits(['update:modelValue', 'save'])

const title = ref('')
const slug = ref('')

const notification = ref<NotificationType>({
  show: false,
  message: '',
  type: 'success'
})

const translitMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
  'е': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
  'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
  'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'ё': 'e'
}

const generateSlug = () => {
  slug.value = title.value
    .toLowerCase()
    .replace(/[^а-яёa-z0-9\s-]/g, '')
    .replace(/[а-яё]/g, char => translitMap[char] || char)
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const closeDialog = () => {
  emit('update:modelValue', false)
}

const handleSave = async () => {  
  if (!title.value.trim() || !slug.value.trim()) {
    props.showNotification?.('Пожалуйста, заполните все поля', 'error')
    return
  }

  try {
    const pageData: PageData = {
      id: Date.now(),
      title: title.value.trim(),
      slug: slug.value.trim()
    }

    emit('save', pageData)
    props.showNotification?.('Страница успешно сохранена', 'success')
    closeDialog()
  } catch (error) {
    console.error('Ошибка при сохранении:', error)
    props.showNotification?.('Ошибка при сохранении', 'error')
  }
}
</script>

<style lang="scss" scoped>
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}

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