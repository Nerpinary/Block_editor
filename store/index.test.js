import { state, mutations, actions } from './index';

describe('Vuex Store', () => {
  let storeState;

  beforeEach(() => {
    storeState = state();
  });

  describe('mutations', () => {
    it('ADD_BLOCK should add a new block', () => {
      const block = { type: 'Text', content: 'Hello World' };
      mutations.ADD_BLOCK(storeState, block);
      expect(storeState.blocks).toHaveLength(1);
      expect(storeState.blocks[0]).toHaveProperty('id');
      expect(storeState.blocks[0]).toMatchObject(block);
    });

    it('UPDATE_BLOCK should update an existing block', () => {
      const block = { type: 'Text', content: 'Hello World' };
      mutations.ADD_BLOCK(storeState, block);
      const updatedBlock = { content: 'Updated Content' };
      mutations.UPDATE_BLOCK(storeState, { index: 0, block: updatedBlock });
      expect(storeState.blocks[0].content).toBe('Updated Content');
    });

    it('REMOVE_BLOCK should remove a block', () => {
      const block = { type: 'Text', content: 'Hello World' };
      mutations.ADD_BLOCK(storeState, block);
      mutations.REMOVE_BLOCK(storeState, 0);
      expect(storeState.blocks).toHaveLength(0);
    });

    it('MOVE_BLOCK should move a block', () => {
      const block1 = { type: 'Text', content: 'Block 1' };
      const block2 = { type: 'Text', content: 'Block 2' };
      mutations.ADD_BLOCK(storeState, block1);
      mutations.ADD_BLOCK(storeState, block2);
      mutations.MOVE_BLOCK(storeState, { fromIndex: 0, toIndex: 1 });
      expect(storeState.blocks[1].content).toBe('Block 1');
    });

    it('UPDATE_COLUMNS_BLOCK should update a columns block', () => {
      const columnsBlock = { type: 'Columns', content: { columns: [[], []] } };
      mutations.ADD_BLOCK(storeState, columnsBlock);
      const newBlock = { type: 'Text', content: 'New Block' };
      mutations.UPDATE_COLUMNS_BLOCK(storeState, { index: 0, columnIndex: 0, block: newBlock });
      expect(storeState.blocks[0].content.columns[0]).toHaveLength(1);
      expect(storeState.blocks[0].content.columns[0][0]).toMatchObject(newBlock);
    });
  });

  describe('actions', () => {
    it('addBlock should commit ADD_BLOCK mutation', () => {
      const commit = jest.fn();
      const block = { type: 'Text', content: 'Hello World' };
      actions.addBlock({ commit }, block);
      expect(commit).toHaveBeenCalledWith('ADD_BLOCK', block);
    });

    it('updateBlock should commit UPDATE_BLOCK mutation', () => {
      const commit = jest.fn();
      const payload = { index: 0, block: { content: 'Updated Content' } };
      actions.updateBlock({ commit }, payload);
      expect(commit).toHaveBeenCalledWith('UPDATE_BLOCK', payload);
    });

    it('removeBlock should commit REMOVE_BLOCK mutation', () => {
      const commit = jest.fn();
      const index = 0;
      actions.removeBlock({ commit }, index);
      expect(commit).toHaveBeenCalledWith('REMOVE_BLOCK', index);
    });
  });
});
