<template>
  <svg :class="[`w-${size} h-${size}`, className]" :width="size * 4" :height="size * 4" fill="none"
    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <slot />
  </svg>
</template>

<script>
export default {
  name: 'BaseIcon',

  props: {
    size: {
      type: Number,
      default: 5
    },
    className: {
      type: String,
      default: ''
    }
  }
}
</script>