<template>
  <div
    class="block-library-item"
    draggable="true"
    @dragstart="onDragStart($event, block)"
    @dragend="onDragEnd"
  >
    <div class="block-content">
      <span class="icon" v-html="block.icon"></span>
      <span class="name">{{ block.name }}</span>
    </div>
  </div>
</template>

<script>
import dragdrop from '@/mixins/dragdrop'

export default {
  name: 'BlockLibraryItem',
  mixins: [dragdrop],
  
  props: {
    block: {
      type: Object,
      required: true
    }
  }
}
</script> 