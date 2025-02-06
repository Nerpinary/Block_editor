<template>
  <svg :class="[`w-${size} h-${size}`, className]" :width="size * 4" :height="size * 4" fill="none"
    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <slot />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number
  className?: string
}

withDefaults(defineProps<Props>(), {
  size: 5,
  className: ''
})
</script>

<script lang="ts">
export default {
  name: 'BaseIcon'
}
</script>