import { shallowMount } from '@vue/test-utils';
import HeadingBlock from '@/components/content/HeadingBlock.vue';

describe('HeadingBlock.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(HeadingBlock, {
      propsData: {
        content: JSON.stringify({ text: 'Test Heading', alignment: 'left', color: '#1F2937' }),
        index: 0,
        isLast: false,
      },
    });
  });

  it('renders the heading text correctly', () => {
    const editor = wrapper.find('[contenteditable="true"]');
    expect(editor.element.innerHTML).toBe('Test Heading');
  });

  it('applies the correct alignment and color', () => {
    const editor = wrapper.find('[contenteditable="true"]');
    expect(editor.element.style.textAlign).toBe('left');
    expect(editor.element.style.color).toBe('rgb(31, 41, 55)');
  });

  it('updates localContent on input', async () => {
    const editor = wrapper.find('[contenteditable="true"]');
    editor.element.innerHTML = 'New Heading';
    await editor.trigger('input');
    expect(wrapper.vm.localContent).toBe('New Heading');
  });

  it('emits update:content when content is updated', async () => {
    const editor = wrapper.find('[contenteditable="true"]');
    editor.element.innerHTML = 'Updated Heading';
    await editor.trigger('input');
    expect(wrapper.emitted()['update:content']).toBeTruthy();
    expect(wrapper.emitted()['update:content'][0]).toEqual([JSON.stringify({
      text: 'Updated Heading',
      alignment: 'left',
      color: '#1F2937',
    })]);
  });

  it('handles drag start event', () => {
    const dragEvent = {
      dataTransfer: {
        setData: jest.fn(),
      },
    };
    wrapper.vm.onDragStart(dragEvent);
    expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith('application/json', expect.any(String));
  });

  it('emits remove-original-block when delete button is clicked', async () => {
    const deleteButton = wrapper.findComponent({ name: 'DeleteBlockButton' });
    await deleteButton.vm.$emit('delete');
    expect(wrapper.emitted()['remove-original-block']).toBeTruthy();
  });
}); 