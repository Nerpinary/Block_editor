<template>
  <div class="h-14 border-b bg-white px-4 flex items-center justify-between">
    <h1 class="text-lg font-medium text-gray-900">{{ title }}</h1>
    <div class="flex gap-2">
      <button
        v-for="action in actions"
        :key="action.name"
        @click="$emit(action.event)"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {{ action.name }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditorHeader',
  
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
    }
  }
}
</script> 