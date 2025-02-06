import { defineStore } from 'pinia'
import { useFirebase } from '@/composables/useFirebase'
import type { Block, BlockConfig } from '@/types/blocks'
import type { Page } from '@/types/page'
import { firebaseService } from '@/services/firebase'

interface EditorState {
  blocks: Block[]
  nextId: number
  blockConfigs: Record<string, BlockConfig>
  savedPages: Page[]
  currentPage: Page | null
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    blocks: [],
    nextId: 1,
    blockConfigs: {
      'Text': {
        name: 'Текст',
        icon: 'TextIcon'
      },
      'Heading': {
        name: 'Заголовок',
        icon: 'HeadingIcon'
      },
      'Image': {
        name: 'Изображение',
        icon: 'ImageIcon'
      },
      'Columns': {
        name: 'Колонки',
        icon: 'ColumnsIcon'
      },
      'List': {
        name: 'Список',
        icon: 'ListIcon'
      },
      'Table': {
        name: 'Таблица',
        icon: 'TableIcon'
      },
      'ProsCons': {
        name: 'Плюсы и минусы',
        icon: 'ProsConsIcon'
      },
      'Specifications': {
        name: 'Спецификации',
        icon: 'SpecificationsIcon'
      }
    } as Record<string, BlockConfig>,
    savedPages: [],
    currentPage: null
  }),

  getters: {
    getBlockConfig: (state) => {
      return (type: string) => state.blockConfigs[type]
    },
    getBlocks: (state) => state.blocks
  },

  actions: {
    addBlock(block: Block) {
      this.blocks.push({
        id: this.nextId++,
        ...block
      })
    },

    updateBlock({ index, block }: { index: number, block: Block }) {
      if (index < 0 || index >= this.blocks.length) {
        console.error('Invalid index for update:', index)
        return
      }
      this.blocks = [
        ...this.blocks.slice(0, index),
        { ...block },
        ...this.blocks.slice(index + 1)
      ]
    },

    moveBlock(fromIndex: number, toIndex: number) {
      const [movedBlock] = this.blocks.splice(fromIndex, 1)
      this.blocks.splice(toIndex, 0, movedBlock)
    },

    removeBlock(index: number) {
      this.blocks.splice(index, 1)
    },

    setBlocks(blocks: Block[]) {
      this.blocks = blocks
    },

    updateColumnsBlock({ index, columnIndex, block }: { 
      index: number, 
      columnIndex: number, 
      block: Block 
    }) {
      const columnsBlock = this.blocks[index]

      if (!columnsBlock || !columnsBlock.content) {
        console.error('Invalid columns block:', index)
        return
      }

      if (!columnsBlock.content.columns) {
        columnsBlock.content.columns = [[], []]
      }

      if (columnIndex < 0 || columnIndex >= columnsBlock.content.columns.length) {
        console.error('Invalid column index:', columnIndex)
        return
      }

      columnsBlock.content.columns[columnIndex].push(block)
    },

    async loadSavedPages() {
      try {
        this.savedPages = await firebaseService.getPages()
      } catch (error) {
        console.error('Error loading saved pages:', error)
      }
    },

    async loadPage(pageId: string) {
      try {
        const page = await firebaseService.getPage(pageId)
        if (page) {
          this.currentPage = page
          this.blocks = page.blocks
        }
        return page
      } catch (error) {
        console.error('Error loading page:', error)
        return null
      }
    },

    async savePage(pageData: Partial<Page>) {
      try {
        if (this.currentPage?.id) {
          await firebaseService.updatePage(this.currentPage.id, {
            ...pageData,
            blocks: this.blocks
          })
        } else {
          await firebaseService.savePage({
            ...pageData,
            blocks: this.blocks
          } as Page)
        }
        await this.loadSavedPages()
      } catch (error) {
        console.error('Error saving page:', error)
        throw error
      }
    },

    async deletePage(pageId: string) {
      try {
        await firebaseService.deletePage(pageId)
        await this.loadSavedPages()
      } catch (error) {
        console.error('Error deleting page:', error)
        throw error
      }
    }
  }
}) 