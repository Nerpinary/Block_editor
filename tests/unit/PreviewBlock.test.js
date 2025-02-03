import { shallowMount } from '@vue/test-utils'
import PreviewBlock from '@/components/preview/PreviewBlock.vue'

describe('PreviewBlock.vue', () => {
  const createWrapper = (block) => {
    return shallowMount(PreviewBlock, {
      propsData: { block },
      stubs: {
        PreviewTextBlock: true,
        PreviewHeadingBlock: true,
        PreviewImageBlock: true,
        PreviewColumnsBlock: true
      }
    })
  }

  it('renders text block correctly', () => {
    const wrapper = createWrapper({
      type: 'text',
      content: 'Sample text'
    })
    
    expect(wrapper.findComponent({ name: 'PreviewTextBlock' }).exists()).toBe(true)
  })

  it('renders heading block correctly', () => {
    const wrapper = createWrapper({
      type: 'heading',
      content: 'Sample heading'
    })
    
    expect(wrapper.findComponent({ name: 'PreviewHeadingBlock' }).exists()).toBe(true)
  })

  it('renders image block correctly', () => {
    const wrapper = createWrapper({
      type: 'image',
      content: JSON.stringify({ url: 'test.jpg', caption: 'Test' })
    })
    
    expect(wrapper.findComponent({ name: 'PreviewImageBlock' }).exists()).toBe(true)
  })

  it('renders columns block correctly', () => {
    const wrapper = createWrapper({
      type: 'two-columns',
      content: JSON.stringify({ columns: [[], []] })
    })
    
    expect(wrapper.findComponent({ name: 'PreviewColumnsBlock' }).exists()).toBe(true)
  })

  it('falls back to text block for unknown type', () => {
    const wrapper = createWrapper({
      type: 'unknown',
      content: 'Unknown content'
    })
    
    expect(wrapper.findComponent({ name: 'PreviewTextBlock' }).exists()).toBe(true)
  })

  it('parses JSON content correctly', () => {
    const jsonContent = JSON.stringify({ text: 'Test', color: '#000' })
    const wrapper = createWrapper({
      type: 'text',
      content: jsonContent
    })
    
    const textBlock = wrapper.findComponent({ name: 'PreviewTextBlock' })
    expect(textBlock.props('content')).toEqual({ text: 'Test', color: '#000' })
  })

  it('passes raw content when JSON parsing fails', () => {
    const rawContent = 'Plain text content'
    const wrapper = createWrapper({
      type: 'text',
      content: rawContent
    })
    
    const textBlock = wrapper.findComponent({ name: 'PreviewTextBlock' })
    expect(textBlock.props('content')).toBe(rawContent)
  })
}) 