<template>
  <BaseIcon :size="size" :class-name="className">
    <!-- Основная форма дискеты -->
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="1.5" 
      d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" 
    />
    <!-- Внутренняя часть -->
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="1.5" 
      d="M17 21v-8H7v8" 
    />
    <!-- Верхняя часть дискеты -->
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="1.5" 
      d="M7 3v5h8" 
    />
    <!-- Декоративный элемент -->
    <rect 
      x="15" 
      y="13" 
      width="2" 
      height="2" 
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