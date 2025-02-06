<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useRoute, useRouter } from 'vue-router'
import type { Block, Page } from '@/types'

const store = useEditorStore()
const route = useRoute()
const router = useRouter()

const blocks = computed<Block[]>(() => store.blocks)

const getPreviewComponent = (type: string): string => {
  return `Preview${type}Block`
}

const goBack = (): void => {
  if (route.params.slug) {
    router.push('/saved-pages')
  } else {
    router.push('/')
  }
}

const loadPageBySlug = async (slug: string): Promise<void> => {
  try {
    // Сначала загружаем список страниц, если он еще не загружен
    if (!store.savedPages.length) {
      await store.loadSavedPages()
    }
    
    const pages = store.savedPages
    const page = pages.find(p => p.slug === slug)
    
    if (page) {
      await store.loadPage(page.id)
    } else {
      console.warn(`Page with slug "${slug}" not found`, {
        slug,
        availablePages: pages.map(p => ({ slug: p.slug, id: p.id }))
      })
      router.push('/saved-pages')
    }
  } catch (error) {
    console.error('Error loading page:', error)
    router.push('/saved-pages')
  }
}

onMounted(async () => {
  const slug = route.params.slug as string
  if (slug) {
    await loadPageBySlug(slug)
  }
})
</script>

<!-- остальной код без изменений --> 