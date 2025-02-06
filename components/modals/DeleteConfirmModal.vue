<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3 class="text-lg font-medium mb-4">
        Подтверждение удаления
      </h3>
      <p class="text-gray-600 mb-6">
        Вы уверены, что хотите удалить страницу "{{ page?.title }}"?
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="modal-button modal-button--gray"
        >
          Отмена
        </button>
        <button
          @click="$emit('confirm')"
          class="modal-button modal-button--red"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Page } from '@/types/page'

defineProps<{
  page: Page | null
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<style lang="scss" scoped>
.modal {
  &-overlay {
    @apply fixed inset-0 bg-black bg-opacity-50;
    @apply flex items-center justify-center z-50;
  }

  &-content {
    @apply bg-white rounded-lg p-6 w-[400px] shadow-xl;
  }

  &-button {
    @apply px-4 py-2 rounded;
    @apply transition-colors duration-200;

    &--gray {
      @apply bg-gray-100 text-gray-700;
      @apply hover:bg-gray-200;
    }

    &--red {
      @apply bg-red-500 text-white;
      @apply hover:bg-red-600;
    }
  }
}
</style> 