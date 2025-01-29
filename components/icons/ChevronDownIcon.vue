<template>
  <BaseIcon :size="size" :class-name="className">
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M19 9l-7 7-7-7"
    />
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'ChevronDownIcon',
  components: { BaseIcon },
  props: {
    size: { type: Number, default: 5 },
    className: { type: String, default: '' }
  }
}
</script> 