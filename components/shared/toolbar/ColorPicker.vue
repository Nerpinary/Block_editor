<template>
    <div class="relative">
      <button 
        @click.stop="isOpen = !isOpen" 
        class="toolbar-btn flex items-center gap-1"
        :class="{ 'active': isOpen }"
        title="Цвет текста"
      >
        <div 
          class="w-4 h-4 rounded-sm border border-gray-200" 
          :style="{ backgroundColor: currentColor }"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="w-3 h-3" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
  
      <div 
        v-if="isOpen"
        class="absolute top-full w-40 left-0 mt-1 bg-white rounded-lg shadow-xl border z-50 p-3"
        v-click-outside="close"
      >
        <div class="grid grid-cols-5 gap-2">
          <button 
            v-for="color in colors" 
            :key="color.hex"
            @click.stop="selectColor(color.hex)"
            class="color-btn"
            :class="{ 'ring-2 ring-offset-2 ring-blue-500': color.hex === currentColor }"
            :style="{ backgroundColor: color.hex }"
            :title="color.name"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import type { Color } from '@/types/toolbar'
  import type { DirectiveBinding } from 'vue'
  
  interface CustomHTMLElement extends HTMLElement {
    clickOutsideEvent?: (event: Event) => void
  }
  
  interface Props {
    colors: Color[]
    currentColor: string
  }
  
  defineProps<Props>()
  
  const emit = defineEmits<{
    (e: 'apply-color', color: string): void
  }>()
  
  const isOpen = ref(false)
  
  const close = () => {
    isOpen.value = false
  }
  
  const selectColor = (color: string) => {
    emit('apply-color', color)
    close()
  }
  
  const vClickOutside = {
    mounted(el: CustomHTMLElement, binding: DirectiveBinding) {
      el.clickOutsideEvent = (event: Event) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event)
        }
      }
      document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el: CustomHTMLElement) {
      if (el.clickOutsideEvent) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
  </script>

  <style lang="scss" scoped>
  .toolbar-btn {
    @apply p-2 rounded hover:bg-gray-100 transition-colors duration-200;
    @apply text-gray-600;

    &.active {
      @apply bg-blue-50 text-blue-600;
    }
  }

  .color-btn {
    @apply w-5 h-5 rounded-full transition-transform duration-150;
    border: 1px solid rgba(255, 255, 255, 0.8);

    &:hover {
      transform: scale(1.2);
    }
  }
  </style>