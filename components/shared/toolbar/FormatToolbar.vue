<template>
  <div class="formatting-toolbar flex items-center gap-3 mb-2 p-2 bg-white rounded-lg border shadow-sm">
    <TextFormattingGroup 
      v-if="hasTextFormatting"
      :formats="textFormats"
      :active-states="activeStates"
      :current-color="currentColor"
      @format="formatText"
    />

    <div 
      class="h-5 w-px bg-gray-200" 
      v-if="hasTextFormatting && hasAlignment"
    />

    <AlignmentGroup
      v-if="hasAlignment"
      :alignments="alignments"
      :current-alignment="currentAlignment"
      @set-alignment="setAlignment"
    />

    <div 
      class="h-5 w-px bg-gray-200" 
      v-if="hasAlignment && hasColorPicker"
    />

    <ColorPicker
      v-if="hasColorPicker"
      :colors="colors"
      :current-color="currentColor"
      @apply-color="applyColor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { TextFormatCommand, ActiveStates } from '@/types/toolbar'
import type { TextAlign } from '@/types/content'
import { textFormats, alignments, colors } from './toolbar-data'
import TextFormattingGroup from './TextFormattingGroup.vue'
import AlignmentGroup from './AlignmentGroup.vue'
import ColorPicker from './ColorPicker.vue'

interface Props {
  hasTextFormatting?: boolean
  hasAlignment?: boolean
  hasColorPicker?: boolean
  currentAlignment?: TextAlign
  currentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  hasTextFormatting: true,
  hasAlignment: true,
  hasColorPicker: true,
  currentAlignment: 'left',
  currentColor: '#1F2937'
})

const emit = defineEmits<{
  (e: 'format-text', command: TextFormatCommand): void
  (e: 'set-alignment', align: TextAlign): void
  (e: 'apply-color', color: string): void
}>()

const activeStates = ref<ActiveStates>({
  bold: false,
  italic: false,
  underline: false
})

const updateActiveStates = () => {
  activeStates.value = {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline')
  }
}

const formatText = (command: TextFormatCommand) => {
  emit('format-text', command)
  setTimeout(updateActiveStates, 0)
}

const setAlignment = (align: TextAlign) => {
  emit('set-alignment', align)
}

const applyColor = (color: string) => {
  emit('apply-color', color)
}

onMounted(() => {
  updateActiveStates()
  document.addEventListener('selectionchange', updateActiveStates)

  const observer = new MutationObserver(updateActiveStates)
  const editorElement = document.querySelector('.editor')
  
  if (editorElement) {
    observer.observe(editorElement, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }

  onBeforeUnmount(() => {
    document.removeEventListener('selectionchange', updateActiveStates)
    observer.disconnect()
  })
})
</script>

<style lang="scss" scoped>
.toolbar-btn {
  @apply p-2 rounded hover:bg-gray-100 transition-colors duration-200 text-gray-600;

  &.active {
    @apply bg-blue-50 text-blue-600;
  }

  svg {
    @apply w-4 h-4;
  }
}

.color-btn {
  @apply w-7 h-7 rounded-full transition-transform duration-150;
  border: 2px solid rgba(255, 255, 255, 0.8);

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor;
  }
}
</style>