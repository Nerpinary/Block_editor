import { shallowMount } from '@vue/test-utils'
import EditorContent from '@/components/editor/EditorContent.vue'
import { BLOCK_TYPES } from '@/constants/blocks'

describe('EditorContent.vue', () => {
  let wrapper
  const mockBlocks = [
    { id: 1, type: BLOCK_TYPES.TEXT, content: 'Test text' },
    { id: 2, type: BLOCK_TYPES.HEADING, content: { text: 'Test heading', level: 1 } }
  ]

  beforeEach(() => {
    wrapper = shallowMount(EditorContent, {
      mocks: {
        $store: {
          state: {
            blocks: mockBlocks
          },
          commit: jest.fn()
        }
      },
      stubs: {
        TextBlock: true,
        HeadingBlock: true,
        ImageBlock: true,
        ColumnsBlock: true,
        BlockMenu: true
      }
    })
  })

  it('renders blocks correctly', () => {
    const blocks = wrapper.findAll('.editor-block')
    expect(blocks).toHaveLength(2)
  })

  it('shows empty state when no blocks', async () => {
    await wrapper.setData({
      $store: {
        state: {
          blocks: []
        }
      }
    })
    expect(wrapper.text()).toContain('Нажмите на блок слева, чтобы добавить его')
  })

  it('updates block content correctly', async () => {
    const newContent = 'Updated text'
    await wrapper.vm.updateBlockContent(0, newContent)
    
    expect(wrapper.vm.$store.commit).toHaveBeenCalledWith('UPDATE_BLOCK', {
      index: 0,
      block: {
        ...mockBlocks[0],
        content: newContent
      }
    })
  })

  it('duplicates block correctly', async () => {
    const index = 0
    jest.spyOn(Date, 'now').mockImplementation(() => 123)
    
    await wrapper.vm.duplicateBlock(index)
    
    expect(wrapper.vm.$store.commit).toHaveBeenCalledWith('ADD_BLOCK', {
      ...mockBlocks[index],
      id: 123
    })
  })

  it('removes block correctly', async () => {
    const index = 0
    await wrapper.vm.handleMoveFromEditor({ index })
    
    expect(wrapper.vm.$store.commit).toHaveBeenCalledWith('REMOVE_BLOCK', index)
  })

  it('returns correct component name for block type', () => {
    expect(wrapper.vm.getComponentName(BLOCK_TYPES.TEXT)).toBe('TextBlock')
    expect(wrapper.vm.getComponentName(BLOCK_TYPES.HEADING)).toBe('HeadingBlock')
  })

  it('returns correct default content for different block types', () => {
    expect(wrapper.vm.getDefaultContent(BLOCK_TYPES.TEXT)).toBe('')
    expect(wrapper.vm.getDefaultContent(BLOCK_TYPES.HEADING)).toEqual({
      text: '',
      level: 1
    })
    expect(wrapper.vm.getDefaultContent(BLOCK_TYPES.IMAGE)).toEqual({
      url: '',
      caption: ''
    })
    expect(wrapper.vm.getDefaultContent(BLOCK_TYPES.TWO_COLUMNS)).toEqual({
      columns: [[], []]
    })
  })

  // Тесты для drag and drop функциональности
  describe('drag and drop', () => {
    it('handles dragover event', async () => {
      const event = {
        preventDefault: jest.fn(),
        dataTransfer: {
          dropEffect: 'none',
          effectAllowed: 'all'
        }
      }
      await wrapper.vm.onDragOver(event)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('handles drop event', async () => {
      const mockData = {
        type: BLOCK_TYPES.TEXT,
        content: ''
      }
      const event = {
        preventDefault: jest.fn(),
        dataTransfer: {
          dropEffect: 'none',
          effectAllowed: 'all',
          getData: jest.fn().mockReturnValue(JSON.stringify(mockData))
        },
        clientY: 100
      }
      
      await wrapper.vm.onDrop(event)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('handles dragleave event', async () => {
      const event = {
        preventDefault: jest.fn(),
        currentTarget: document.createElement('div'),
        relatedTarget: document.createElement('div')
      }
      
      await wrapper.vm.onDragLeave(event)
      
      const block = wrapper.find('.editor-block')
      expect(block.classes('drop-before')).toBeFalsy()
      expect(block.classes('drop-after')).toBeFalsy()
    })
  })
}) 