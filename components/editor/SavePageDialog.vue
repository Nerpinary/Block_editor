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
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="18-luchshih-multivarok"
            />
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Отмена
        </button>
        <button 
          @click="save"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SavePageDialog',
  
  data() {
    return {
      title: '',
      slug: ''
    }
  },

  methods: {
    generateSlug() {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^а-яёa-z0-9\s-]/g, '')
        .replace(/[ё]/g, 'e')
        .replace(/[а-я]/g, char => {
          const translitMap = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
            'е': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
            'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
            'щ': 'sch', 'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya'
          }
          return translitMap[char] || char
        })
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
    },

    async save() {
      if (!this.title.trim() || !this.slug.trim()) {
        alert('Пожалуйста, заполните все поля')
        return
      }

      try {
        const pageData = {
          title: this.title.trim(),
          slug: this.slug.trim()
        }

        this.$emit('saved', pageData)
        this.$emit('close')
      } catch (error) {
        alert('Ошибка при сохранении')
      }
    }
  }
}
</script>

<style scoped>
.save-dialog {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.save-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.cancel-button {
  background-color: #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
</style> 