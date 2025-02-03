<template>
  <div class="formatting-toolbar flex items-center gap-2 mb-2 p-2 bg-white rounded-lg border shadow-sm">
    <div class="flex gap-1" v-if="hasTextFormatting">
      <button v-for="format in textFormats" :key="format.command" @click="formatText(format.command)"
        class="toolbar-btn" :class="{ 'active': activeStates[format.command] }" :title="format.title">
        <svg class="w-4 h-4" fill="none" :stroke="activeStates[format.command] ? currentColor : 'currentColor'"
          viewBox="0 0 24 24">
          <g v-if="format.command === 'underline'">
            <path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"></path>
            <line x1="4" y1="21" x2="20" y2="21" :stroke="activeStates[format.command] ? currentColor : 'currentColor'">
            </line>
          </g>
          <g v-else v-html="format.icon"></g>
        </svg>
      </button>
    </div>

    <div class="h-4 w-px bg-gray-200" v-if="hasTextFormatting && hasAlignment"></div>

    <div class="flex gap-1" v-if="hasAlignment">
      <button v-for="align in alignments" :key="align.value" @click="setAlignment(align.value)" class="toolbar-btn"
        :class="{ 'active': currentAlignment === align.value }" :title="align.title">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="align.icon"></svg>
      </button>
    </div>

    <div class="h-4 w-px bg-gray-200" v-if="hasAlignment && hasColorPicker"></div>

    <div class="relative" v-if="hasColorPicker">
      <button @click.stop="showColorPicker = !showColorPicker" class="toolbar-btn flex items-center gap-1"
        title="Цвет текста">
        <div class="w-4 h-4 rounded-sm border border-gray-200" :style="{ backgroundColor: currentColor }"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      <div v-show="showColorPicker"
        class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border z-50 w-[200px]">
        <div class="p-2">
          <div class="grid grid-cols-5 gap-2">
            <button v-for="color in colors" :key="color.hex" @click.stop="applyColor(color.hex)" class="color-btn"
              :style="{ backgroundColor: color.hex }" :title="color.name"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormatToolbar',

  props: {
    hasTextFormatting: {
      type: Boolean,
      default: true
    },
    hasAlignment: {
      type: Boolean,
      default: true
    },
    hasColorPicker: {
      type: Boolean,
      default: true
    },
    currentAlignment: {
      type: String,
      default: 'left'
    },
    currentColor: {
      type: String,
      default: '#1F2937'
    }
  },

  data() {
    return {
      showColorPicker: false,
      activeStates: {
        bold: false,
        italic: false,
        underline: false
      },
      textFormats: [
        {
          command: 'bold',
          title: 'Жирный текст',
          icon: '<path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>'
        },
        {
          command: 'italic',
          title: 'Курсив',
          icon: '<path d="M19 4h-9M14 20H5M15 4L9 20"></path>'
        },
        {
          command: 'underline',
          title: 'Подчеркнутый',
          icon: '<path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line>'
        }
      ],
      alignments: [
        {
          value: 'left',
          title: 'По левому краю',
          icon: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>'
        },
        {
          value: 'center',
          title: 'По центру',
          icon: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>'
        },
        {
          value: 'right',
          title: 'По правому краю',
          icon: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>'
        }
      ],
      colors: [
        { hex: '#1F2937', name: 'Черный' },
        { hex: '#4B5563', name: 'Темно-серый' },
        { hex: '#6B7280', name: 'Серый' },
        { hex: '#9CA3AF', name: 'Светло-серый' },
        { hex: '#D1D5DB', name: 'Очень светло-серый' },
        { hex: '#DC2626', name: 'Красный' },
        { hex: '#EA580C', name: 'Оранжевый' },
        { hex: '#D97706', name: 'Желтый' },
        { hex: '#059669', name: 'Зеленый' },
        { hex: '#0891B2', name: 'Голубой' },
        { hex: '#2563EB', name: 'Синий' },
        { hex: '#4F46E5', name: 'Индиго' },
        { hex: '#7C3AED', name: 'Фиолетовый' },
        { hex: '#DB2777', name: 'Розовый' },
        { hex: '#9D174D', name: 'Малиновый' }
      ]
    }
  },

  methods: {
    updateActiveStates() {
      this.activeStates = {
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline')
      };
    },

    formatText(command) {
      this.$emit('format-text', command);
      this.$nextTick(() => {
        this.updateActiveStates();
      });
    },

    setAlignment(align) {
      this.$emit('set-alignment', align);
    },

    applyColor(color) {
      this.$emit('apply-color', color);
      this.showColorPicker = false;
    },

    isActive(command) {
      return document.queryCommandState(command);
    }
  },

  mounted() {
    this.updateActiveStates();

    document.addEventListener('selectionchange', this.updateActiveStates);

    const observer = new MutationObserver(() => {
      this.updateActiveStates();
    });

    if (this.$parent.$refs.editor) {
      observer.observe(this.$parent.$refs.editor, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    this.$once('hook:destroyed', () => {
      document.removeEventListener('selectionchange', this.updateActiveStates);
      observer.disconnect();
    });
  }
}
</script>

<style scoped>
.toolbar-btn {
  @apply p-1.5 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600;
}

.toolbar-btn.active {
  @apply bg-blue-50;
  color: v-bind(currentColor);
}

.color-btn {
  @apply w-6 h-6 rounded-full transition-transform duration-150;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.color-btn:hover {
  transform: scale(1.15);
  box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor;
}
</style>