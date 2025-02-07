import { defineStore } from 'pinia'
import { useFirebase } from '@/composables/useFirebase'
import type { Block, BlockConfig } from '@/types/blocks'
import type { Page } from '@/types/page'
import { firebaseService } from '@/services/firebase'
import { toRaw } from 'vue'

interface EditorState {
  blocks: Block[]
  nextId: number
  blockConfigs: Record<string, BlockConfig>
  savedPages: Page[]
  currentPage: Page | null
}

export const useEditorStore = defineStore('editor', {
  state: () => ({
    blocks: [] as Block[],
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
    savedPages: [] as Page[],
    currentPage: null as Page | null
  }),

  getters: {
    getBlockConfig: (state) => {
      return (type: string) => state.blockConfigs[type]
    },
    getBlocks: (state) => state.blocks
  },

  actions: {
    addBlock(block: Block) {
      const newBlock = {
        id: this.nextId++,
        type: block.type || 'defaultType',
        content: block.content || {},
      }

      if (block.type === 'Heading' && !block.content) {
        newBlock.content = {
          text: '',
          level: 1,
          alignment: 'left',
          color: '#1F2937'
        }
      }

      this.blocks.push(newBlock)
    },

    updateBlock({ index, block }: { index: number, block: Block }) {
      if (index < 0 || index >= this.blocks.length) {
        console.error('Invalid index for update:', index)
        return
      }
      
      const updatedBlock = {
        id: block.id || '',
        type: block.type || 'defaultType',
        content: block.content || {}
      }
      
      this.blocks = [
        ...this.blocks.slice(0, index),
        updatedBlock,
        ...this.blocks.slice(index + 1)
      ]
    },

    insertBlock({ index, block }: { index: number, block: Block }) {
      this.blocks.splice(index, 0, block)
    },

    moveBlock(fromIndex: number, toIndex: number) {
      if (fromIndex === toIndex) return
      
      const [movedBlock] = this.blocks.splice(fromIndex, 1)
      if (movedBlock) {
        this.blocks.splice(toIndex, 0, movedBlock)
      } else {
        console.error('Block not found at index:', fromIndex)
      }
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
          this.blocks = page.blocks || []
        }
        return page
      } catch (error) {
        console.error('Error loading page:', error)
        return null
      }
    },

    clearEditor() {
      this.blocks = []
      this.nextId = 1
      this.currentPage = null
    },

    async savePage(pageData: Partial<Page>) {
      try {
        const pageToSave = {
          ...pageData,
          blocks: this.blocks.map(block => ({
            id: block.id || '',
            type: block.type || 'defaultType',
            content: block.content || {},
            parentId: block.parentId || ''
          }))
        }

        let savedPageId: string

        // Пытаемся обновить существующую страницу
        if (this.currentPage?.id) {
          try {
            savedPageId = await firebaseService.updatePage(this.currentPage.id, pageToSave)
          } catch (updateError) {
            console.log('Failed to update, saving as new page')
            savedPageId = await firebaseService.savePage(pageToSave as Page)
            this.currentPage = null
          }
        } else {
          // Сохраняем как новую страницу
          savedPageId = await firebaseService.savePage(pageToSave as Page)
        }

        // Загружаем обновленный список страниц
        await this.loadSavedPages()

        // Загружаем только что сохраненную страницу
        const savedPage = await firebaseService.getPage(savedPageId)
        if (savedPage) {
          this.currentPage = savedPage
          this.blocks = savedPage.blocks
        }

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