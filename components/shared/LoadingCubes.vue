<template>
  <div class="loading-container">
    <div class="cube-container">
      <div class="cube cube-1"></div>
      <div class="cube cube-2"></div>
      <div class="cube cube-3"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-container {
  @apply fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50;
}

.cube-container {
  @apply relative w-96 h-48;
}

.cube {
  @apply absolute w-12 h-12 bg-blue-500 rounded-lg shadow-lg;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  top: -200px;

  &-1 {
    animation: cube-fall-1 4s infinite cubic-bezier(0.55, 0, 0.85, 0.36);
    animation-delay: 0s;
    z-index: 1;
  }

  &-2 {
    animation: cube-fall-2 4s infinite cubic-bezier(0.55, 0, 0.85, 0.36);
    animation-delay: 0.4s;
    z-index: 2;
  }

  &-3 {
    animation: cube-fall-3 4s infinite cubic-bezier(0.55, 0, 0.85, 0.36);
    animation-delay: 0.8s;
    z-index: 3;
  }
}

@keyframes cube-fall-1 {
  0% {
    top: -200px;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  25% {
    top: 70%;
    left: 50%;
    transform: translateX(-50%) rotate(15deg);
  }
  30% {
    top: 65%;
    left: 50%;
    transform: translateX(-50%) rotate(-8deg);
  }
  35% {
    top: 70%;
    left: 50%;
    transform: translateX(-50%) rotate(4deg);
  }
  40%, 100% {
    top: 70%;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
    opacity: 1;
  }
}

@keyframes cube-fall-2 {
  0% {
    top: -200px;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  23% {
    top: 42%;
    left: 50%;
    transform: translateX(-50%) rotate(5deg);
  }
  27% {
    top: 38%;
    left: 58%;
    transform: translateX(-50%) rotate(-15deg);
  }
  35% {
    top: 54%;
    left: 65%;
    transform: translateX(-50%) rotate(10deg);
  }
  40% {
    top: 50%;
    left: 65%;
    transform: translateX(-50%) rotate(-5deg);
  }
  45% {
    top: 54%;
    left: 65%;
    transform: translateX(-50%) rotate(0deg);
  }
  75% {
    top: 54%;
    left: 65%;
    transform: translateX(-50%) rotate(0deg);
  }
  85% {
    top: 40%;
    left: 50%;
    transform: translateX(-50%) rotate(-10deg);
  }
  90% {
    top: 54%;
    left: 50%;
    transform: translateX(-50%) rotate(5deg);
  }
  100% {
    top: 54%;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
  }
}

@keyframes cube-fall-3 {
  0% {
    top: -200px;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  23% {
    top: 42%;
    left: 50%;
    transform: translateX(-50%) rotate(-5deg);
  }
  27% {
    top: 38%;
    left: 42%;
    transform: translateX(-50%) rotate(15deg);
  }
  35% {
    top: 54%;
    left: 35%;
    transform: translateX(-50%) rotate(-10deg);
  }
  40% {
    top: 50%;
    left: 35%;
    transform: translateX(-50%) rotate(5deg);
  }
  45% {
    top: 54%;
    left: 35%;
    transform: translateX(-50%) rotate(0deg);
  }
  75% {
    top: 54%;
    left: 35%;
    transform: translateX(-50%) rotate(0deg);
  }
  85% {
    top: 40%;
    left: 50%;
    transform: translateX(-50%) rotate(10deg);
  }
  90% {
    top: 38%;
    left: 50%;
    transform: translateX(-50%) rotate(-5deg);
  }
  100% {
    top: 38%;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
  }
}
</style>

<script setup lang="ts">
defineProps<{
  isLoading?: boolean
}>()
</script> 