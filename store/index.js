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
  }
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
    state.blocks[index] = {
      ...state.blocks[index],
      ...block
    };
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
  }
};