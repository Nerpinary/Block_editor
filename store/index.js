export const state = () => ({
  blocks: [],
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
      id: Date.now(),
      ...block
    })
  },
  UPDATE_BLOCK(state, { index, block }) {
    console.log('Before update:', state.blocks[index]);
    state.blocks[index] = {
      ...state.blocks[index],
      ...block
    };
    console.log('After update:', state.blocks[index]);
  },
  REORDER_BLOCKS(state, { fromIndex, toIndex }) {
    const blocks = [...state.blocks];
    const [movedBlock] = blocks.splice(fromIndex, 1);
    blocks.splice(toIndex, 0, movedBlock);
    state.blocks = blocks;
  },
  REMOVE_BLOCK(state, index) {
    state.blocks.splice(index, 1)
  },
  SET_BLOCKS(state, blocks) {
    state.blocks = blocks;
  },
  MOVE_BLOCK(state, { fromIndex, toIndex }) {
    const blocks = [...state.blocks];
    const [movedBlock] = blocks.splice(fromIndex, 1);
    blocks.splice(toIndex, 0, movedBlock);
    state.blocks = blocks;
  },
  ADD_BLOCK_AT_INDEX(state, { block, index }) {
    state.blocks.splice(index, 0, block);
  },
  UPDATE_COLUMNS_BLOCK(state, { index, columnIndex, block }) {
    console.log('Updating columns block:', {
      blockAtIndex: state.blocks[index],
      index,
      columnIndex,
      block
    })

    const columnsBlock = state.blocks[index]
    
    if (!columnsBlock) {
      console.error('Block not found at index:', index)
      return
    }

    if (!columnsBlock.content) {
      columnsBlock.content = {}
    }

    if (!columnsBlock.content.columns) {
      columnsBlock.content.columns = [[], []]
    }

    if (!columnsBlock.content.columns[columnIndex]) {
      columnsBlock.content.columns[columnIndex] = []
    }

    columnsBlock.content.columns[columnIndex].push(block)
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