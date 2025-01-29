import Vue from 'vue'
import TextIcon from '@/components/icons/TextIcon.vue'
import HeadingIcon from '@/components/icons/HeadingIcon.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import ColumnsIcon from '@/components/icons/ColumnsIcon.vue'
import TextBlock from '@/components/content/TextBlock.vue'
import HeadingBlock from '@/components/content/HeadingBlock.vue'
import ImageBlock from '@/components/content/ImageBlock.vue'
import ColumnsBlock from '@/components/layout/ColumnsBlock.vue'

// Регистрируем иконки
Vue.component('TextIcon', TextIcon)
Vue.component('HeadingIcon', HeadingIcon)
Vue.component('ImageIcon', ImageIcon)
Vue.component('ColumnsIcon', ColumnsIcon)

// Регистрируем блоки
Vue.component('TextBlock', TextBlock)
Vue.component('HeadingBlock', HeadingBlock)
Vue.component('ImageBlock', ImageBlock)
Vue.component('ColumnsBlock', ColumnsBlock) 