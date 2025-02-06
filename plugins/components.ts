import { defineNuxtPlugin } from '#app'
import type { Component } from 'vue'

// Импорты иконок
import TextIcon from '@/components/icons/TextIcon.vue'
import HeadingIcon from '@/components/icons/HeadingIcon.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import ColumnsIcon from '@/components/icons/ColumnsIcon.vue'
import ListIcon from '@/components/icons/ListIcon.vue'
import TableIcon from '@/components/icons/TableIcon.vue'

interface IconComponents {
  [key: string]: Component
}

export default defineNuxtPlugin((nuxtApp) => {
  const icons: IconComponents = {
    TextIcon,
    HeadingIcon,
    ImageIcon,
    ColumnsIcon,
    ListIcon,
    TableIcon
  }

  // Регистрируем иконки глобально
  Object.entries(icons).forEach(([name, component]) => {
    nuxtApp.vueApp.component(name, component)
  })

  // Предоставляем доступ к иконкам через provide
  return {
    provide: {
      icons
    }
  }
}) 