import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import PreviewPage from '@/pages/preview.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('pages/preview.vue', () => {
  let wrapper
  let store
  let state
  let $router

  beforeEach(() => {
    state = {
      blocks: [
        { 
          id: 1, 
          type: 'Text',
          content: 'Test content' 
        },
        { 
          id: 2, 
          type: 'Heading',
          content: 'Test heading' 
        }
      ]
    }

    store = new Vuex.Store({
      state
    })

    $router = {
      push: jest.fn()
    }

    wrapper = shallowMount(PreviewPage, {
      localVue,
      store,
      mocks: {
        $router
      },
      stubs: {
        PreviewTextBlock: true,
        PreviewHeadingBlock: true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders preview page layout correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('preview-page')
    expect(wrapper.classes()).toContain('min-h-screen')
    expect(wrapper.classes()).toContain('bg-white')
  })

  it('renders header with correct title', () => {
    const header = wrapper.find('h1')
    expect(header.exists()).toBe(true)
    expect(header.text()).toBe('Предпросмотр')
  })

  it('renders "back to editor" button', () => {
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Вернуться к редактированию')
  })

  it('navigates back to editor when button is clicked', async () => {
    const button = wrapper.find('button')
    await button.trigger('click')
    expect($router.push).toHaveBeenCalledWith('/')
  })

  it('renders content container with correct styles', () => {
    const container = wrapper.find('.max-w-4xl')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('mx-auto')
    expect(container.classes()).toContain('p-8')
  })

  it('renders correct number of blocks', () => {
    const blocks = wrapper.findAll('.mb-4')
    expect(blocks).toHaveLength(2)
  })

  it('computes blocks from store correctly', () => {
    expect(wrapper.vm.blocks).toEqual(state.blocks)
  })

  it('generates correct preview component names', () => {
    expect(wrapper.vm.getPreviewComponent('Text')).toBe('PreviewTextBlock')
    expect(wrapper.vm.getPreviewComponent('Heading')).toBe('PreviewHeadingBlock')
  })

  it('renders blocks with correct components', () => {
    const blocks = wrapper.findAll('.mb-4')
    
    const firstBlock = blocks.at(0).findComponent({ name: 'PreviewTextBlock' })
    const secondBlock = blocks.at(1).findComponent({ name: 'PreviewHeadingBlock' })
    
    expect(firstBlock.exists()).toBe(true)
    expect(secondBlock.exists()).toBe(true)
  })

  it('passes correct content to preview components', () => {
    const blocks = wrapper.findAll('.mb-4')
    
    const firstComponent = blocks.at(0).find('previewtextblock-stub')
    const secondComponent = blocks.at(1).find('previewheadingblock-stub')
    
    expect(firstComponent.attributes('content')).toBe('Test content')
    expect(secondComponent.attributes('content')).toBe('Test heading')
  })

  it('has sticky header with correct styles', () => {
    const header = wrapper.find('.h-14')
    expect(header.classes()).toContain('sticky')
    expect(header.classes()).toContain('top-0')
    expect(header.classes()).toContain('z-10')
  })

  it('renders blocks in correct order', () => {
    const blocks = wrapper.findAll('.mb-4')
    expect(blocks).toHaveLength(2)
    
    const firstComponent = blocks.at(0).findComponent({ name: 'PreviewTextBlock' })
    const secondComponent = blocks.at(1).findComponent({ name: 'PreviewHeadingBlock' })
    
    expect(firstComponent.attributes('content')).toBe('Test content')
    expect(secondComponent.attributes('content')).toBe('Test heading')
  })
}) 