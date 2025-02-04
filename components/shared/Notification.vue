<template>
  <transition name="notification">
    <div v-if="show" class="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-3 flex items-center z-50">
      <div v-if="type === 'success'" class="text-green-500 mr-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <div class="text-gray-700">{{ message }}</div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Notification',
  
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success'
    }
  }
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style> 