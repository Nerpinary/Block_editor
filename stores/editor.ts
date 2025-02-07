import { defineStore } from 'pinia'
import type { Block, BlockConfig, BlockContent, BlockType } from '@/types/blocks'
import type { Page } from '@/types/page'
import { firebaseService } from '@/services/firebase'

interface EditorState {
  blocks: Block[]
  blockConfigs: Record<string, BlockConfig>
  savedPages: Page[]
  currentPage: Page | null
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    blocks: [],
    blockConfigs: {
      Text: { name: 'Текст', icon: 'TextIcon' },
      Heading: { name: 'Заголовок', icon: 'HeadingIcon' },
      Image: { name: 'Изображение', icon: 'ImageIcon' },
      Columns: { name: 'Колонки', icon: 'ColumnsIcon' },
      List: { name: 'Список', icon: 'ListIcon' },
      Table: { name: 'Таблица', icon: 'TableIcon' },
      ProsCons: { name: 'Плюсы и минусы', icon: 'ProsConsIcon' },
      Specifications: { name: 'Спецификации', icon: 'SpecificationsIcon' }
    },
    savedPages: [],
    currentPage: null
  }),

  getters: {
    getBlockConfig: (state) => (type: string) => state.blockConfigs[type],
    getBlocks: (state) => state.blocks
  },

  actions: {
    getNextId(): number {
      return this.blocks.reduce((max, block) => Math.max(max, block.id ?? 0), 0) + 1
    },

    addBlock(block: Block) {
      const defaultContent: Record<string, any> = {
        Heading: { text: '', level: 1, alignment: 'left', color: '#1F2937' },
        Image: { url: '', caption: '' },
        Columns: { columns: [[], []] }, 
        List: { items: [] },
        Table: { rows: [[]] },
        ProsCons: { pros: [], cons: [] },
        Specifications: { specs: [] }
      };
    
      this.blocks.push({
        id: this.getNextId(),
        type: block.type || 'defaultType',
        content: block.content ?? defaultContent[block.type] ?? '',
        parentId: block.parentId ?? ''
      });
    },
    

    updateBlock({ index, block }: { index: number, block: Block }) {
      if (index < 0 || index >= this.blocks.length) return console.error('Invalid index for update:', index)
      this.blocks[index] = { ...block }
    },

    insertBlock({ index, block }: { index: number, block: Block }) {
      this.blocks.splice(index, 0, block)
    },

    moveBlock(fromIndex: number, toIndex: number) {
      if (fromIndex === toIndex || toIndex < 0 || toIndex >= this.blocks.length) return
      const [movedBlock] = this.blocks.splice(fromIndex, 1)
      this.blocks.splice(toIndex, 0, movedBlock)
    },

    removeBlock(index: number) {
      this.blocks.splice(index, 1)
    },

    setBlocks(blocks: Block[]) {
      this.blocks = blocks
    },

    updateColumnsBlock({ index, columnIndex, block }: { index: number, columnIndex: number, block: Block }) {
      const columnsBlock = this.blocks[index]
    
      if (!columnsBlock || !this.isColumnsContent(columnsBlock.content)) {
        return console.error('Invalid columns block:', index)
      }
    
      if (columnIndex < 0 || columnIndex >= columnsBlock.content.columns.length) {
        return console.error('Invalid column index:', columnIndex)
      }
    
      columnsBlock.content.columns[columnIndex].push(block)
    },
    
    isColumnsContent(content: any): content is { columns: Block[][] } {
      return content && typeof content === 'object' && 'columns' in content && Array.isArray(content.columns)
    },
    

    async loadSavedPages() {
      try {
        const pages = await firebaseService.getPages();
        console.log("Fetched pages:", pages);
    
        this.savedPages = pages.map(page => ({
          ...page,
          createdAt: Number(page.createdAt),
          updatedAt: page.updatedAt ? Number(page.updatedAt) : Date.now(),
          blocks: page.blocks.map(block => ({
            id: block.id ?? this.getNextId(),
            type: block.type as BlockType,
            content: block.content as BlockContent,
            parentId: block.parentId ?? ''
          }))
        }));
      } catch (error) {
        console.error('Error loading saved pages:', error);
      }
    },
    
    async loadPage(pageId: string) {
      try {
        const page = await firebaseService.getPage(pageId);
        if (page) {
          this.currentPage = {
            ...page,
            createdAt: Number(page.createdAt),
            updatedAt: page.updatedAt ? Number(page.updatedAt) : Date.now(),
            blocks: page.blocks.map(block => ({
              id: block.id ?? this.getNextId(),
              type: block.type as BlockType,
              content: block.content as BlockContent,
              parentId: block.parentId ?? ''
            }))
          };
          this.blocks = this.currentPage.blocks;
        }
        return page;
      } catch (error) {
        console.error('Error loading page:', error);
        return null;
      }
    },

    clearEditor() {
      this.blocks = []
      this.currentPage = null
    },

    preparePageData(pageData?: Partial<Page>) {
      return {
        ...(pageData || {}),
        blocks: this.blocks.map(({ id, type, content, parentId }) => ({ id, type, content, parentId }))
      }
    },

    async savePage(pageData?: Partial<Page>) {
      console.log('Данные перед сохранением в Firebase:', pageData)
      try {
        const pageToSave = this.preparePageData(pageData);

        console.log('После preparePageData:', pageToSave);
    
        pageToSave.blocks = pageToSave.blocks.map(block => ({
          id: block.id !== undefined ? block.id : this.getNextId(),
          type: block.type as BlockType,
          content: block.content ?? '',
          parentId: block.parentId ?? ''
        })) as Block[];
    
        let savedPageId: string;
    
        if (this.currentPage?.id) {
          pageToSave.updatedAt = Date.now();
          savedPageId = await firebaseService.updatePage(this.currentPage.id, pageToSave);
        } else {
          pageToSave.id = crypto.randomUUID();
          pageToSave.createdAt = Date.now();
          pageToSave.updatedAt = Date.now();
          savedPageId = await firebaseService.savePage(pageToSave as Page);
        }
    
        await this.loadSavedPages();
        return savedPageId;
      } catch (error) {
        console.error('Error saving page:', error);
        throw error;
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
