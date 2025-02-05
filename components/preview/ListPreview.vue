<template>
  <div class="list-preview">
    <ul class="list-disc pl-5 space-y-2">
      <li v-for="(item, index) in items" :key="index" v-if="item.text">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PreviewListBlock',

  props: {
    content: {
      type: Object,
      default: () => ({
        items: []
      })
    }
  },

  computed: {
    items() {
      return this.content.items || []
    }
  }
}
</script> 