<template>
  <transition name="notification">
    <div 
      v-if="show" 
      class="notification"
    >
      <div 
        v-if="type === 'success'" 
        class="notification__icon"
      >
        <svg 
          class="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div class="notification__message">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Props {
  show: boolean
  message: string
  type?: NotificationType
}

withDefaults(defineProps<Props>(), {
  show: false,
  type: 'success'
})
</script>

<script lang="ts">
export default {
  name: 'Notification'
}
</script>

<style lang="scss" scoped>
.notification {
  @apply fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-3 flex items-center z-50;

  &__icon {
    @apply text-green-500 mr-2;
  }

  &__message {
    @apply text-gray-700;
  }

  &-enter-active,
  &-leave-active {
    @apply transition-all duration-300 ease-in-out;
  }

  &-enter-from,
  &-leave-to {
    @apply opacity-0;
    transform: translateY(-20px);
  }
}
</style> 