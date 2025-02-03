import { shallowMount } from '@vue/test-utils'
import EditorHeader from '@/components/editor/EditorHeader.vue'

describe('EditorHeader.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(EditorHeader)
  })

  it('renders default title correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Редактор')
  })

  it('renders custom title when provided', () => {
    const customTitle = 'Мой редактор'
    wrapper = shallowMount(EditorHeader, {
      propsData: {
        title: customTitle
      }
    })
    expect(wrapper.find('h1').text()).toBe(customTitle)
  })

  it('renders default action button', () => {
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(1)
    expect(buttons.at(0).text()).toBe('Предпросмотр')
  })

  it('renders multiple custom actions', async () => {
    const customActions = [
      { name: 'Сохранить', event: 'save' },
      { name: 'Отменить', event: 'cancel' }
    ]
    
    wrapper = shallowMount(EditorHeader, {
      propsData: {
        actions: customActions
      }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons.at(0).text()).toBe('Сохранить')
    expect(buttons.at(1).text()).toBe('Отменить')
  })

  it('emits correct events when buttons are clicked', async () => {
    const customActions = [
      { name: 'Сохранить', event: 'save' },
      { name: 'Отменить', event: 'cancel' }
    ]
    
    wrapper = shallowMount(EditorHeader, {
      propsData: {
        actions: customActions
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons.at(0).trigger('click')
    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')).toHaveLength(1)
    
    await buttons.at(1).trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('emits default preview event when default button is clicked', async () => {
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted('preview')).toBeTruthy()
    expect(wrapper.emitted('preview')).toHaveLength(1)
  })
}) 