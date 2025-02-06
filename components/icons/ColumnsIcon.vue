<template>
  <BaseIcon :size="size" :class-name="className">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M9 4.5v15M15 4.5v15M4.5 19.5h15a2 2 0 002-2v-11a2 2 0 00-2-2h-15a2 2 0 00-2 2v11a2 2 0 002 2z" />
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
// Для поддержки имени компонента в DevTools
export default {
  name: 'ColumnsIcon'
}
</script>