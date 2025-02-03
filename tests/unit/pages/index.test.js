import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import IndexPage from '@/pages/index.vue'
import BlockLibrary from '@/components/editor/BlockLibrary.vue'
import EditorHeader from '@/components/editor/EditorHeader.vue'
import EditorContent from '@/components/editor/EditorContent.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('pages/index.vue', () => {
  let wrapper
  let store
  let state
  let mutations
  let $router

  beforeEach(() => {
    state = {
      blocks: [
        { id: 1, type: 'text', content: 'Test content', parentId: 'main-editor' },
        { id: 2, type: 'heading', content: 'Test heading', parentId: 'main-editor' }
      ]
    }

    mutations = {
      ADD_BLOCK: jest.fn(),
      UPDATE_BLOCK: jest.fn(),
      REMOVE_BLOCK: jest.fn()
    }

    store = new Vuex.Store({
      state,
      mutations
    })

    $router = {
      push: jest.fn()
    }

    wrapper = shallowMount(IndexPage, {
      localVue,
      store,
      stubs: {
        BlockLibrary: true,
        EditorHeader: true,
        EditorContent: true
      },
      mocks: {
        $router
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
    jest.clearAllMocks()
  })

  it('renders editor layout correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('min-h-screen')
    expect(wrapper.classes()).toContain('flex')
  })

  it('renders all editor components', () => {
    expect(wrapper.findComponent(BlockLibrary).exists()).toBe(true)
    expect(wrapper.findComponent(EditorHeader).exists()).toBe(true)
    expect(wrapper.findComponent(EditorContent).exists()).toBe(true)
  })

  it('has correct editor area styles', () => {
    const editorArea = wrapper.find('.flex-1')
    expect(editorArea.exists()).toBe(true)
    expect(editorArea.classes()).toContain('bg-gray-50')
  })

  it('adds block with generated id', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 12345)
    
    const newBlock = { type: 'text' }
    wrapper.vm.addBlock(newBlock)

    expect(mutations.ADD_BLOCK).toHaveBeenCalledWith(
      state,
      expect.objectContaining({
        id: 12345,
        type: 'text',
        content: '',
        parentId: 'main-editor'
      })
    )

    jest.restoreAllMocks()
  })

  it('adds columns block with correct initial structure', () => {
    const newBlock = { type: 'two-columns' }
    wrapper.vm.addBlock(newBlock)

    expect(mutations.ADD_BLOCK).toHaveBeenCalledWith(
      state,
      expect.objectContaining({
        type: 'two-columns',
        content: JSON.stringify({ left: [], right: [] }),
        parentId: 'main-editor'
      })
    )
  })

  it('updates block content preserving block structure', () => {
    const update = {
      index: 0,
      content: 'Updated content'
    }
    wrapper.vm.updateBlockContent(update)

    expect(mutations.UPDATE_BLOCK).toHaveBeenCalledWith(
      state,
      {
        index: 0,
        block: {
          id: 1,
          type: 'text',
          content: 'Updated content',
          parentId: 'main-editor'
        }
      }
    )
  })

  it('removes block by index', () => {
    wrapper.vm.removeBlock({ index: 0 })
    expect(mutations.REMOVE_BLOCK).toHaveBeenCalledWith(state, 0)
  })

  it('navigates to preview route', async () => {
    const header = wrapper.findComponent(EditorHeader)
    await header.vm.$emit('preview')
    expect($router.push).toHaveBeenCalledWith('/preview')
  })

  it('logs block addition to console', () => {
    const consoleSpy = jest.spyOn(console, 'log')
    const newBlock = { type: 'text' }
    
    wrapper.vm.addBlock(newBlock)
    
    expect(consoleSpy).toHaveBeenCalledWith('Adding block:', 'text')
    consoleSpy.mockRestore()
  })
})