<template>
  <div class="pros-cons-preview">
    <h3 class="text-lg font-semibold mb-4">Плюсы и минусы</h3>

    <div class="space-y-4">
      <div v-if="content.pros" class="flex items-start gap-3">
        <div class="flex-shrink-0 w-6 h-6 text-green-500 mt-1">
          <ThumbUpIcon :size="6" />
        </div>
        <div class="flex-grow">{{ content.pros }}</div>
      </div>

      <div v-if="content.cons" class="flex items-start gap-3">
        <div class="flex-shrink-0 w-6 h-6 text-red-500 mt-1">
          <ThumbDownIcon :size="6" />
        </div>
        <div class="flex-grow">{{ content.cons }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ThumbUpIcon from '@/components/icons/ThumbUpIcon.vue'
import ThumbDownIcon from '@/components/icons/ThumbDownIcon.vue'

export default {
  name: 'PreviewProsConsBlock',

  components: {
    ThumbUpIcon,
    ThumbDownIcon
  },

  props: {
    content: {
      type: [String, Object],
      default: () => ({
        pros: '',
        cons: ''
      })
    }
  }
}
</script> 