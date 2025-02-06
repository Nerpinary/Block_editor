<template>
  <svg
    :width="size * 4"
    :height="size * 4"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z"
      stroke="currentColor"
      stroke-width="2"
    />
    <path d="M3 10H21" stroke="currentColor" stroke-width="2" />
    <path d="M3 15H21" stroke="currentColor" stroke-width="2" />
    <path d="M12 10V20" stroke="currentColor" stroke-width="2" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 6
})
</script>