import { shallowMount } from '@vue/test-utils';
import TextBlock from '@/components/content/TextBlock.vue';

describe('TextBlock.vue', () => {
  let wrapper;

  beforeEach(() => {
    document.execCommand = jest.fn();
    wrapper = shallowMount(TextBlock, {
      propsData: {
        content: 'Тестовый текст',
        index: 0,
        isLast: false,
      },
    });
  });

  it('renders the content correctly', () => {
    const editor = wrapper.find('[contenteditable="true"]');
    expect(editor.element.innerHTML).toBe('Тестовый текст');
  });

  it('updates content on input', async () => {
    const editor = wrapper.find('[contenteditable="true"]');
    editor.element.innerHTML = 'Новый текст';
    await editor.trigger('input');
    expect(wrapper.emitted()['update:content']).toBeTruthy();
    expect(wrapper.emitted()['update:content'][0]).toEqual(['Новый текст']);
  });

  it('sets alignment correctly', async () => {
    await wrapper.vm.setAlignment('center');
    expect(wrapper.vm.currentAlignment).toBe('center');
    const editor = wrapper.find('[contenteditable="true"]');
    expect(editor.element.style.textAlign).toBe('center');
  });

  it('applies color correctly', async () => {
    await wrapper.vm.applyColor('#FF0000');
    expect(wrapper.vm.currentColor).toBe('#FF0000');
    const editor = wrapper.find('[contenteditable="true"]');
    expect(editor.element.style.color).toBe('rgb(255, 0, 0)'); // Проверка на rgb
  });

  it('emits remove-original-block when delete button is clicked', async () => {
    const deleteButton = wrapper.findComponent({ name: 'DeleteBlockButton' });
    await deleteButton.vm.$emit('delete');
    expect(wrapper.emitted()['remove-original-block']).toBeTruthy();
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
}); 