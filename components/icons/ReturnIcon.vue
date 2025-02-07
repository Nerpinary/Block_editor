<template>
  <BaseIcon :size="size" :class-name="className">
    <!-- Основная дуга стрелки -->
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="1.5"
      d="M8 5L4 9L8 13"
    />
    <!-- Изящная дуга -->
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="1.5"
      d="M4 9H16C18.7614 9 21 11.2386 21 14C21 16.7614 18.7614 19 16 19H12"
    />
    <!-- Декоративная точка -->
    <circle 
      cx="16" 
      cy="14" 
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