<template>
  <div class="list-preview">
    <ul class="list-disc pl-5 space-y-2">
      <template v-for="(item, index) in items" :key="index">
        <li v-if="item.text">
          {{ item.text }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ListContent, ListItem } from '@/types/content'

interface Props {
  content: ListContent
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({
    items: [] as ListItem[]
  })
})

const items = computed<ListItem[]>(() => props.content.items || [])
</script>

<script lang="ts">
export default {
  name: 'PreviewListBlock'
}
</script> 