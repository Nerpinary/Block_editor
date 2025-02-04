import { firebaseService } from '@/services/firebase'

export const state = () => ({
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
    }
  },
  savedPages: []
});

export const getters = {
  getBlockConfig: (state) => (type) => state.blockConfigs[type],
  getBlocks: (state) => state.blocks
};

export const mutations = {
  ADD_BLOCK(state, block) {
    state.blocks.push({
      id: state.nextId++,
      ...block
    })
  },
  UPDATE_BLOCK(state, { index, block }) {
    if (index < 0 || index >= state.blocks.length) {
      console.error('Invalid index for update:', index);
      return;
    }
    state.blocks = [
      ...state.blocks.slice(0, index),
      { ...block },
      ...state.blocks.slice(index + 1)
    ]
  },
  REORDER_BLOCKS(state, { fromIndex, toIndex }) {
    const [movedBlock] = state.blocks.splice(fromIndex, 1);
    state.blocks.splice(toIndex, 0, movedBlock);
  },
  REMOVE_BLOCK(state, index) {
    console.log('Removing block at index:', index);
    state.blocks.splice(index, 1);
  },
  SET_BLOCKS(state, blocks) {
    if (Array.isArray(blocks)) {
      state.blocks = blocks;
    } else {
      console.error('Invalid blocks format:', blocks);
    }
  },
  MOVE_BLOCK(state, { fromIndex, toIndex }) {
    const [movedBlock] = state.blocks.splice(fromIndex, 1);
    state.blocks.splice(toIndex, 0, movedBlock);
  },
  ADD_BLOCK_AT_INDEX(state, { block, index }) {
    state.blocks.splice(index, 0, block);
  },
  UPDATE_COLUMNS_BLOCK(state, { index, columnIndex, block }) {
    const columnsBlock = state.blocks[index];

    if (!columnsBlock || !columnsBlock.content) {
      console.error('Invalid columns block:', index);
      return;
    }

    if (!columnsBlock.content.columns) {
      columnsBlock.content.columns = [[], []];
    }

    if (columnIndex < 0 || columnIndex >= columnsBlock.content.columns.length) {
      console.error('Invalid column index:', columnIndex);
      return;
    }

    columnsBlock.content.columns[columnIndex].push(block);
  },
  SET_SAVED_PAGES(state, pages) {
    state.savedPages = pages
  },
  ADD_SAVED_PAGE(state, page) {
    state.savedPages.push(page)
  },
  REMOVE_SAVED_PAGE(state, pageId) {
    state.savedPages = state.savedPages.filter(page => page.id !== pageId)
  },
  UPDATE_SAVED_PAGE(state, updatedPage) {
    const index = state.savedPages.findIndex(p => p.id === updatedPage.id)
    if (index !== -1) {
      state.savedPages = [
        ...state.savedPages.slice(0, index),
        updatedPage,
        ...state.savedPages.slice(index + 1)
      ]
    }
  }
};

export const actions = {
  addBlock({ commit }, block) {
    commit('ADD_BLOCK', block);
  },
  updateBlock({ commit }, payload) {
    commit('UPDATE_BLOCK', payload);
  },
  reorderBlocks({ commit }, payload) {
    commit('REORDER_BLOCKS', payload);
  },
  removeBlock({ commit }, index) {
    commit('REMOVE_BLOCK', index);
  },
  moveBlock({ commit }, payload) {
    commit('MOVE_BLOCK', payload);
  },
  updateColumnsBlock({ commit }, payload) {
    commit('UPDATE_COLUMNS_BLOCK', payload);
  },
  async loadSavedPages({ commit }) {
    try {
      const pages = await firebaseService.getPages()
      commit('SET_SAVED_PAGES', pages)
    } catch (error) {
      console.error('Error loading pages:', error)
    }
  },
  async loadPage({ commit }, pageId) {
    try {
      console.log('Loading page with ID:', pageId)
      const page = await firebaseService.getPage(pageId)
      if (page) {
        const processedBlocks = page.blocks.map(block => {
          try {
            return {
              ...block,
              content: typeof block.content === 'string' 
                ? JSON.parse(block.content) 
                : block.content
            }
          } catch {
            return block
          }
        })
        
        commit('SET_BLOCKS', processedBlocks)
        return page
      }
    } catch (error) {
      console.error('Error loading page:', error)
      throw error
    }
  },
  async savePage({ state, commit }, { title, slug }) {
    try {
      const processedBlocks = state.blocks.map(block => ({
        ...block,
        content: typeof block.content === 'object' && block.content !== null
          ? JSON.stringify(block.content)
          : block.content
      }))
      
      const newPage = {
        title,
        slug,
        blocks: processedBlocks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const pageId = await firebaseService.savePage(newPage)
      
      const savedPage = {
        ...newPage,
        id: pageId
      }
      
      commit('ADD_SAVED_PAGE', savedPage)
      return savedPage
    } catch (error) {
      console.error('Error saving page:', error)
      throw error
    }
  },
  async updatePage({ state, commit }, { pageId, title, slug }) {
    try {
      console.log('Updating page with ID:', pageId)
      const processedBlocks = state.blocks.map(block => ({
        ...block,
        content: typeof block.content === 'object' && block.content !== null
          ? JSON.stringify(block.content)
          : block.content
      }))
      
      const updatedPage = {
        title,
        slug,
        blocks: processedBlocks,
        updatedAt: new Date().toISOString()
      }
      
      await firebaseService.updatePage(pageId, updatedPage)
      
      commit('UPDATE_SAVED_PAGE', {
        ...updatedPage,
        id: pageId
      })
      
      return { ...updatedPage, id: pageId }
    } catch (error) {
      console.error('Error updating page:', error)
      throw error
    }
  },
  async deletePage({ commit }, pageId) {
    try {
      await firebaseService.deletePage(pageId)
      commit('REMOVE_SAVED_PAGE', pageId)
      
      const pages = JSON.parse(localStorage.getItem('pages') || '[]')
      const filteredPages = pages.filter(page => page.id !== pageId)
      localStorage.setItem('pages', JSON.stringify(filteredPages))
    } catch (error) {
      console.error('Error deleting page:', error)
      throw error
    }
  }
};