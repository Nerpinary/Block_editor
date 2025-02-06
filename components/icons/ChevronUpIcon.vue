<template>
  <BaseIcon :size="size" :class-name="className">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
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