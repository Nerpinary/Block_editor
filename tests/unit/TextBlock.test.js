import { mount } from '@vue/test-utils';
import TextBlock from '@/components/content/TextBlock.vue';
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue';
import BlockControls from '@/components/shared/BlockControls.vue';
import FormatToolbar from '@/components/shared/FormatToolbar.vue';

describe('TextBlock.vue', () => {
  let wrapper;
  const defaultProps = {
    content: 'Test content',
    index: 0,
    isLast: false
  };

  beforeEach(() => {
    wrapper = mount(TextBlock, {
      propsData: defaultProps,
      stubs: {
        DeleteBlockButton: true,
        BlockControls: true,
        FormatToolbar: true
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('text-block');
  });

  it('displays the content correctly', () => {
    const editor = wrapper.find('.editor-content');
    expect(editor.element.innerHTML).toBe('Test content');
  });

  it('emits remove event when delete button is clicked', async () => {
    const deleteButton = wrapper.findComponent({ name: 'DeleteBlockButton' });
    await deleteButton.vm.$emit('delete');
    expect(wrapper.emitted().remove).toBeTruthy();
  });

  it('handles text formatting', async () => {
    const toolbar = wrapper.findComponent({ name: 'FormatToolbar' });
    await toolbar.vm.$emit('format-text', 'bold');
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, null);
  });

  it('handles drag start event', () => {
    const event = {
      dataTransfer: {
        setData: jest.fn()
      }
    };
    
    wrapper.vm.onDragStart(event);
    
    expect(event.dataTransfer.setData).toHaveBeenCalledWith(
      'application/json',
      expect.any(String)
    );
    
    const transferData = JSON.parse(event.dataTransfer.setData.mock.calls[0][1]);
    expect(transferData).toEqual(expect.objectContaining({
      type: 'Text',
      index: 0,
      content: 'Test content'
    }));
  });

  it('shows BlockControls when not inside column', () => {
    const controls = wrapper.findComponent(BlockControls);
    expect(controls.exists()).toBe(true);
  });

  it('hides BlockControls when inside column', async () => {
    await wrapper.setProps({ isInsideColumn: true });
    const controls = wrapper.findComponent(BlockControls);
    expect(controls.exists()).toBe(false);
  });

  it('updates content when text is changed', async () => {
    const editor = wrapper.find('.editor-content');
    editor.element.innerHTML = 'New content';
    await editor.trigger('input');
    
    expect(wrapper.emitted()['update:content']).toBeTruthy();
    expect(wrapper.emitted()['update:content'][0]).toEqual(['New content']);
  });

  it('handles text alignment changes', async () => {
    const toolbar = wrapper.findComponent({ name: 'FormatToolbar' });
    await toolbar.vm.$emit('set-alignment', 'center');
    
    expect(wrapper.vm.currentAlignment).toBe('center');
    expect(document.execCommand).toHaveBeenCalledWith('justifyCenter', false, null);
  });
});

beforeAll(() => {
  document.execCommand = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
}); 