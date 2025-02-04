<template>
  <div class="image-block relative group" :class="{ 'is-dragging': dragState.isDragging }" draggable="true"
    @dragstart="onDragStart($event)" @dragend="onDragEnd">
    <BlockControls v-if="!isInsideColumn" :index="index" :is-last="isLast" @move="handleMove"
      @duplicate="$emit('duplicate')" />

    <DeleteBlockButton @delete="$emit('remove')" />

    <div class="block-content">
      <div class="block-header flex items-center mb-2">
        <div class="block-type text-sm text-gray-500">Изображение</div>
      </div>

      <div class="image-container relative">
        <div class="min-h-[200px] flex items-center justify-center border-2 border-dashed rounded cursor-pointer"
          :class="{
            'border-gray-300': !imageContent.url,
            'border-blue-400': imageContent.url
          }" @click="triggerFileInput">
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange">
          <template v-if="imageContent.url">
            <img :src="imageContent.url" class="max-w-full max-h-[400px] object-contain" alt="">
          </template>
          <template v-else>
            <div class="text-gray-500">
              Нажмите или перетащите изображение сюда
            </div>
          </template>
        </div>
      </div>

      <input v-if="imageContent.url" 
        :value="imageContent.caption"
        class="mt-2 w-full border-none bg-transparent"
        placeholder="Подпись к изображению..." 
        @input="updateCaption($event.target.value)">
    </div>
  </div>
</template>

<script>
import dragdrop from '@/mixins/dragdrop'
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue'
import BlockControls from '@/components/shared/BlockControls.vue'

export default {
  name: 'ImageBlock',

  components: {
    DeleteBlockButton,
    BlockControls
  },

  mixins: [dragdrop],

  props: {
    content: {
      type: [String, Object],
      default: () => ({
        url: '',
        caption: ''
      })
    },
    index: {
      type: Number,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: 'main-editor'
    },
    isInsideColumn: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dragState: {
        isDragging: false
      }
    }
  },

  computed: {
    imageContent() {
      if (typeof this.content === 'string') {
        try {
          return JSON.parse(this.content)
        } catch {
          return { url: '', caption: '' }
        }
      }
      return this.content || { url: '', caption: '' }
    }
  },

  methods: {
    handleMove(direction) {
      const fromIndex = this.index
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
      this.$store.commit('MOVE_BLOCK', { fromIndex, toIndex })
    },

    removeBlock() {
      this.$emit('remove-original-block', {
        parentId: this.parentId,
        index: this.index
      })
    },

    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newContent = {
            url: e.target.result,
            caption: this.imageContent.caption || ''
          };
          
          this.$emit('update:content', newContent);
          
          this.$refs.fileInput.value = '';
        };
        reader.onerror = () => {
          console.error('Error reading file:', file);
          this.$emit('error', 'Ошибка при загрузке изображения');
        };
        reader.readAsDataURL(file);
      } else {
        this.$emit('error', 'Пожалуйста, загрузите изображение');
      }
    },

    updateCaption(caption) {
      const updatedContent = {
        url: this.imageContent.url,
        caption: caption
      };
      this.$emit('update:content', updatedContent);
    },

    onDragStart(event) {
      const blockData = {
        type: 'Image',
        index: this.index,
        parentId: this.parentId,
        source: 'editor',
        content: this.imageContent,
        originalBlock: {
          type: 'Image',
          content: this.imageContent
        }
      }
      event.dataTransfer.setData('application/json', JSON.stringify(blockData))
    }
  }
}
</script>

<style scoped>

.heading-block, .text-block, .image-block {
  position: relative;
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.block-controls-wrapper) {
  z-index: 1000 !important;
}

.image-block {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.image-block:not(.is-inside-column) :deep(.block-controls) {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease-in-out;
}

.image-block:not(.is-inside-column):hover :deep(.block-controls) {
  opacity: 1;
  transform: translateX(0);
}

.image-block :deep(.delete-button) {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.image-block:hover :deep(.delete-button) {
  opacity: 1;
}

.upload-placeholder {
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder:hover {
  @apply bg-gray-50;
}
</style>