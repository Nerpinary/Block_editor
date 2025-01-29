<template>
  <BaseIcon :size="size" :class-name="className">
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M4 6h16M4 12h16M4 18h7"
    />
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'TextIcon',
  components: { BaseIcon },
  props: {
    size: { type: Number, default: 5 },
    className: { type: String, default: '' }
  }
}
</script> 