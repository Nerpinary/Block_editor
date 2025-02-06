<template>
  <BaseIcon :size="size" :class-name="className">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5v14h14V5H5zm3 5h8m-8 4h6" />
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

<script lang="ts">
export default {
  name: 'HeadingIcon'
}
</script>