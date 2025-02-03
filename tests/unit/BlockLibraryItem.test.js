import { shallowMount } from '@vue/test-utils';
import BlockLibraryItem from '@/components/editor/BlockLibraryItem.vue';

describe('BlockLibraryItem.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(BlockLibraryItem, {
      propsData: {
        type: 'Text'
      },
      mocks: {
        $store: {
          getters: {
            getBlockConfig: jest.fn(() => ({
              icon: 'IconComponent',
              name: 'Текст'
            })),
          }
        }
      },
      stubs: {
        IconComponent: true
      }
    });
  });

  it('renders the block item correctly', () => {
    const icon = wrapper.findComponent({ name: 'IconComponent' });
    expect(icon.exists()).toBe(true);
    expect(wrapper.find('.name').text()).toBe('Текст');
  });

  it('emits dragstart event when dragged', async () => {
    await wrapper.trigger('dragstart');
    expect(wrapper.emitted().dragstart).toBeTruthy();
  });

  it('emits click event when clicked', async () => {
    await wrapper.trigger('click');
    expect(wrapper.emitted().click).toBeTruthy();
  });
}); 