<template>
  <div 
    class="image-block relative group"
    :class="{ 'is-dragging': dragState.isDragging }"
    draggable="true"
    @dragstart="onDragStart($event)"
    @dragend="onDragEnd"
  >
    <BlockControls 
      :index="index"
      :is-last="isLast"
      @move="handleMove"
      @duplicate="$emit('duplicate')"
    />

    <DeleteBlockButton @delete="removeBlock" />

    <div class="block-content">
      <div class="block-header flex items-center mb-2">
        <div class="block-type text-sm text-gray-500">Изображение</div>
      </div>

      <div class="image-container relative">
        <div 
          class="min-h-[200px] flex items-center justify-center border-2 border-dashed rounded cursor-pointer"
          :class="{
            'border-gray-300': !imageContent.url,
            'border-blue-400': imageContent.url
          }"
          @click="triggerFileInput"
        >
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handleFileChange"
          >
          <template v-if="imageContent.url">
            <img 
              :src="imageContent.url" 
              class="max-w-full max-h-[400px] object-contain"
              alt=""
            >
          </template>
          <template v-else>
            <div class="text-gray-500">
              Нажмите или перетащите изображение сюда
            </div>
          </template>
        </div>
      </div>

      <input 
        v-if="imageContent.url"
        v-model="imageContent.caption"
        class="mt-2 w-full border-none bg-transparent"
        placeholder="Подпись к изображению..."
        @input="updateContent"
      >
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
    }
  },

  computed: {
    imageContent() {
      return typeof this.content === 'string' 
        ? { url: '', caption: '' }
        : { ...this.content };
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
          this.updateContent({
            url: e.target.result,
            caption: this.imageContent.caption
          });
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

    updateContent(newContent) {
      this.$emit('update:content', {
        url: newContent.url || this.imageContent.url,
        caption: newContent.caption || this.imageContent.caption
      })
    },

    onDragStart(event) {
      const blockData = {
        type: 'Image',
        index: this.index,
        parentId: this.parentId,
        source: 'editor',
        content: this.content,
        originalBlock: {
          type: 'Image',
          content: this.content
        }
      }
      event.dataTransfer.setData('application/json', JSON.stringify(blockData))
    }
  }
}
</script>

<style scoped>
.image-block {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.image-block :deep(.block-controls) {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease-in-out;
}

.image-block:hover :deep(.block-controls) {
  opacity: 1;
  transform: translateX(0);
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