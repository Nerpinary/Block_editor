import { shallowMount } from '@vue/test-utils';
import BlockLibrary from '@/components/editor/BlockLibrary.vue';
import { BLOCK_TYPES } from '@/constants/blocks';

describe('BlockLibrary.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(BlockLibrary, {
      mocks: {
        $store: {
          getters: {
            getBlockConfig: jest.fn((type) => ({
              icon: 'IconComponent',
              name: type
            })),
          },
          commit: jest.fn()
        }
      },
      stubs: {
        TextIcon: true,
        HeadingIcon: true,
        ImageIcon: true,
        ColumnsIcon: true
      }
    });
  });

  it('renders block items correctly', () => {
    const items = wrapper.findAllComponents({ name: 'BlockLibraryItem' });
    expect(items.length).toBe(4); // 1 примитив + 3 контент блока
  });

  it('adds a block when clicked', async () => {
    const items = wrapper.findAllComponents({ name: 'BlockLibraryItem' });
    
    const textBlockIndex = items.wrappers.findIndex(
      item => item.props('type') === BLOCK_TYPES.TEXT
    );
    
    const textBlock = items.at(textBlockIndex);
    
    expect(textBlock.exists()).toBe(true);
    
    await textBlock.vm.$emit('click', BLOCK_TYPES.TEXT);

    expect(wrapper.vm.$store.commit).toHaveBeenCalledWith('ADD_BLOCK', {
      type: BLOCK_TYPES.TEXT,
      content: ''
    });
  });

  it('handles drag start event', () => {
    const dragEvent = {
      dataTransfer: {
        setData: jest.fn(),
      },
    };
    wrapper.vm.handleDragStart(dragEvent, BLOCK_TYPES.TEXT);
    expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith('application/json', expect.any(String));
  });
}); 