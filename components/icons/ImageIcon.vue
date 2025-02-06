<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size * 4"
    :height="size * 4"
    :class="className"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
</template>

<script setup lang="ts">
import type { IconProps } from '@/types/icons'

withDefaults(defineProps<IconProps>(), {
  size: 5,
  className: ''
})
</script>