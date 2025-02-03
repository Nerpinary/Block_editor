import { mount } from '@vue/test-utils';
import HeadingBlock from '@/components/content/HeadingBlock.vue';
import DeleteBlockButton from '@/components/shared/DeleteBlockButton.vue';
import BlockControls from '@/components/shared/BlockControls.vue';
import FormatToolbar from '@/components/shared/FormatToolbar.vue';

beforeAll(() => {
  jest.useFakeTimers();
  
  document.execCommand = jest.fn();
  document.queryCommandState = jest.fn().mockReturnValue(false);
  document.queryCommandValue = jest.fn().mockReturnValue('');
  
  window.getSelection = jest.fn().mockReturnValue({
    getRangeAt: jest.fn().mockReturnValue({}),
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
    rangeCount: 1
  });
});

describe('HeadingBlock.vue', () => {
  let wrapper;
  const initialContent = JSON.stringify({
    text: 'Test Heading',
    alignment: 'left',
    color: '#1F2937'
  });

  beforeEach(() => {
    wrapper = mount(HeadingBlock, {
      propsData: {
        content: initialContent,
        index: 0
      },
      stubs: {
        DeleteBlockButton: true,
        BlockControls: true,
        FormatToolbar: true,
        HeadingIcon: true
      }
    });

    jest.runAllTimers();
  });

  afterEach(() => {
    wrapper.destroy();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the content correctly', () => {
    const editor = wrapper.find('.editor-content');
    expect(editor.element.innerHTML).toBe('Test Heading');
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

  it('handles alignment changes', async () => {
    const toolbar = wrapper.findComponent({ name: 'FormatToolbar' });
    await toolbar.vm.$emit('set-alignment', 'center');
    expect(wrapper.vm.currentAlignment).toBe('center');
    expect(document.execCommand).toHaveBeenCalledWith('justifyCenter', false, null);
  });

  it('handles color changes', async () => {
    const toolbar = wrapper.findComponent({ name: 'FormatToolbar' });
    const newColor = '#FF0000';
    await toolbar.vm.$emit('apply-color', newColor);
    expect(wrapper.vm.currentColor).toBe(newColor);
    expect(document.execCommand).toHaveBeenCalledWith('foreColor', false, newColor);
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
    expect(transferData).toEqual({
      type: 'Heading',
      index: 0,
      parentId: 'main-editor',
      source: 'editor',
      content: initialContent,
      originalBlock: {
        type: 'Heading',
        content: initialContent
      }
    });
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
    editor.element.innerHTML = 'New heading';
    await editor.trigger('input');
    
    expect(wrapper.emitted()['update:content']).toBeTruthy();
    const emittedContent = JSON.parse(wrapper.emitted()['update:content'][0][0]);
    expect(emittedContent.text).toBe('New heading');
  });
}); 