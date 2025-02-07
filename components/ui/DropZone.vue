<template>
  <div 
    class="drop-zone" 
    :class="dropZoneClasses"
    @dragover.prevent="handleDragOver" 
    @dragenter.prevent="handleDragEnter" 
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div class="drop-zone__content">
      <div 
        v-if="hasSlot" 
        class="drop-zone__slot"
      >
        <slot />
      </div>

      <div 
        v-else 
        class="drop-zone__placeholder"
      >
        <div class="drop-zone__icon">
          <svg 
            class="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </div>
        <div class="drop-zone__text">
          {{ placeholder }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import type { DropData, DropEvent } from '@/types/drop'

type Orientation = 'vertical' | 'horizontal'

interface Props {
  zoneId: string
  placeholder?: string
  orientation?: Orientation
  active?: boolean
  allowedTypes?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Перетащите элемент сюда',
  orientation: 'vertical',
  active: true,
  allowedTypes: () => []
})

const emit = defineEmits<{
  (e: 'dragenter', payload: { event: DragEvent; zoneId: string }): void
  (e: 'dragleave', payload: { event: DragEvent; zoneId: string }): void
  (e: 'drop', payload: DropEvent): void
}>()

const slots = useSlots()
const isDragOver = ref(false)

const hasSlot = computed(() => !!slots.default)

const dropZoneClasses = computed(() => ({
  'drop-zone--active': props.active,
  'drop-zone--drag-over': isDragOver.value,
  'drop-zone--empty': !hasSlot.value,
  [props.orientation]: true
}))

const handleDragOver = (event: DragEvent) => {
  if (!props.active) return
  event.preventDefault()
}

const handleDragEnter = (event: DragEvent) => {
  if (!props.active) return
  isDragOver.value = true
  emit('dragenter', { event, zoneId: props.zoneId })
}

const handleDragLeave = (event: DragEvent) => {
  if (!props.active) return

  const dropZone = event.currentTarget as HTMLElement
  const relatedTarget = event.relatedTarget as HTMLElement

  if (dropZone.contains(relatedTarget)) return

  isDragOver.value = false
  emit('dragleave', { event, zoneId: props.zoneId })
}

const handleDrop = (event: DragEvent) => {
  if (!props.active || !event.dataTransfer) return
  isDragOver.value = false

  try {
    const jsonData = event.dataTransfer.getData('application/json')
    
    if (!jsonData) {
      console.warn('No data received in drop event')
      return
    }

    const data = JSON.parse(jsonData)
    
    if (props.allowedTypes.length && !props.allowedTypes.includes(data.type)) {
      console.warn('This type is not allowed in this drop zone')
      return
    }
    
    emit('drop', { data, zoneId: props.zoneId, event })
  } catch (error) {
    console.error('Failed to parse drop data:', error, 'Raw data:', event.dataTransfer.getData('application/json'))
  }
}
</script>

<style lang="scss" scoped>
.drop-zone {
  @apply relative transition-all duration-200 ease-in-out my-2;

  &--active {
    min-height: 100px;
  }

  &.vertical {
    @apply w-full;
  }

  &.horizontal {
    @apply h-full w-20;
  }

  &__content {
    @apply h-full w-full p-4 rounded-lg border-2 border-dashed border-gray-200 transition-all duration-200;
  }

  &--empty &__content {
    @apply bg-gray-50;
  }

  &--active:hover &__content {
    @apply border-gray-400 bg-gray-100;
  }

  &--drag-over &__content {
    @apply bg-indigo-50 border-indigo-500;
    transform: scale(1.02);
    @apply shadow-lg;
  }

  &__placeholder {
    @apply h-full flex flex-col items-center justify-center text-gray-500 p-6;
  }

  &__icon {
    @apply mb-3 transition-transform duration-200;
  }

  &--drag-over &__icon {
    transform: scale(1.1);
  }

  &__text {
    @apply text-sm text-center transition-colors duration-200;
  }

  &--drag-over &__text {
    @apply text-indigo-500;
  }

  &__slot {
    @apply h-full;
  }

  &--drag-over {
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
</style>