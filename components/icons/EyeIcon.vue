<template>
  <BaseIcon :size="size" :class-name="className">
    <!-- Внешний контур глаза -->
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="1.5" 
      d="M22 12c0 1-5 7-10 7S2 13 2 12s5-7 10-7 10 6 10 7z" 
    />
    <!-- Радужка -->
    <circle 
      cx="12" 
      cy="12" 
      r="3" 
      stroke-width="1.5"
      stroke-linecap="round" 
      stroke-linejoin="round" 
    />
    <!-- Блик -->
    <circle 
      cx="13.5" 
      cy="10.5" 
      r="1" 
      fill="currentColor" 
    />
  </BaseIcon>
</template>

<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'
import type { IconProps } from '@/types/icons'

withDefaults(defineProps<IconProps>(), {
  size: 5,
  className: ''
})
</script>