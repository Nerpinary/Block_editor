import { shallowMount } from '@vue/test-utils'
import DropZone from '@/components/ui/DropZone.vue'

describe('DropZone.vue', () => {
  let wrapper
  const defaultProps = {
    zoneId: 'test-zone'
  }

  beforeEach(() => {
    wrapper = shallowMount(DropZone, {
      propsData: defaultProps,
      attachTo: document.body
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders correctly with default props', () => {
    expect(wrapper.classes('drop-zone')).toBe(true)
    expect(wrapper.classes('vertical')).toBe(true)
    expect(wrapper.find('.drop-zone__text').text()).toBe('Перетащите элемент сюда')
  })

  it('renders slot content when provided', () => {
    const slotContent = '<div class="test-content">Test</div>'
    wrapper = shallowMount(DropZone, {
      propsData: defaultProps,
      slots: {
        default: slotContent
      }
    })
    
    expect(wrapper.find('.drop-zone__slot').exists()).toBe(true)
    expect(wrapper.find('.drop-zone__placeholder').exists()).toBe(false)
  })

  it('applies correct orientation class', async () => {
    await wrapper.setProps({ orientation: 'horizontal' })
    expect(wrapper.classes('horizontal')).toBe(true)
    expect(wrapper.classes('vertical')).toBe(false)
  })

  it('handles drag over correctly', async () => {
    const event = {
      preventDefault: jest.fn(),
      dataTransfer: {
        dropEffect: 'move'
      }
    }
    
    await wrapper.vm.handleDragOver(event)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('handles drag enter correctly', async () => {
    const event = { preventDefault: jest.fn() }
    await wrapper.vm.handleDragEnter(event)
    
    expect(wrapper.vm.isDragOver).toBe(true)
    expect(wrapper.emitted('dragenter')).toBeTruthy()
    expect(wrapper.emitted('dragenter')[0]).toEqual([{
      event,
      zoneId: 'test-zone'
    }])
  })

  it('handles drag leave correctly', async () => {
    const relatedTarget = document.createElement('div')
    document.body.appendChild(relatedTarget)

    const event = { 
      preventDefault: jest.fn(),
      relatedTarget: relatedTarget,
      currentTarget: wrapper.element
    }
    
    wrapper.vm.isDragOver = true
    
    await wrapper.vm.handleDragLeave(event)
    
    expect(wrapper.vm.isDragOver).toBe(false)
    expect(wrapper.emitted('dragleave')).toBeTruthy()
    expect(wrapper.emitted('dragleave')[0]).toEqual([{
      event,
      zoneId: 'test-zone'
    }])

    document.body.removeChild(relatedTarget)
  })

  it('handles drop correctly with valid data', async () => {
    const mockData = {
      type: 'text',
      content: 'Test content'
    }
    const event = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn().mockReturnValue(JSON.stringify(mockData))
      }
    }
    
    await wrapper.vm.handleDrop(event)
    
    expect(wrapper.vm.isDragOver).toBe(false)
    expect(wrapper.emitted('drop')).toBeTruthy()
    expect(wrapper.emitted('drop')[0]).toEqual([{
      data: mockData,
      event,
      zoneId: 'test-zone'
    }])
  })

  it('handles drop with invalid data', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const event = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn().mockReturnValue('invalid json')
      }
    }
    
    await wrapper.vm.handleDrop(event)
    
    expect(consoleSpy).toHaveBeenCalled()
    expect(wrapper.emitted('drop')).toBeFalsy()
    
    consoleSpy.mockRestore()
  })

  it('does not handle events when not active', async () => {
    wrapper = shallowMount(DropZone, {
      propsData: {
        ...defaultProps,
        active: false
      }
    })

    const event = { preventDefault: jest.fn() }
    
    await wrapper.vm.handleDragEnter(event)
    expect(wrapper.vm.isDragOver).toBe(false)
    expect(wrapper.emitted('dragenter')).toBeFalsy()
    
    await wrapper.vm.handleDrop(event)
    expect(wrapper.emitted('drop')).toBeFalsy()
  })
}) 