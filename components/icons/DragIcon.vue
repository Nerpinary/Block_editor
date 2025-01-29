<template>
  <BaseIcon :size="size" :class-name="className">
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M9 5v4m0 6v4M15 5v4m0 6v4"
    />
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'DragIcon',
  components: { BaseIcon },
  props: {
    size: { type: Number, default: 5 },
    className: { type: String, default: '' }
  }
}
</script> 