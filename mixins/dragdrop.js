export default {
  data() {
    return {
      dragState: {
        isDragging: false,
        draggedBlock: null
      }
    }
  },
  
  methods: {
    onDragStart(event, blockData) {
      this.dragState.isDragging = true
      this.dragState.draggedBlock = blockData
      
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/json', JSON.stringify(blockData))
      
      event.target.classList.add('dragging')
    },
    
    onDragEnd(event) {
      this.dragState.isDragging = false
      this.dragState.draggedBlock = null
      
      event.target.classList.remove('dragging')
    },
    
    onDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      
      const dropZone = this.findDropZone(event.target)
      if (dropZone) {
        this.highlightDropZone(dropZone, event.clientY)
      }
    },
    
    onDragLeave(event) {
      const dropZone = this.findDropZone(event.target)
      if (dropZone) {
        dropZone.classList.remove('drop-before', 'drop-after')
      }
    },
    
    onDrop(event) {
      event.preventDefault()
      
      try {
        const blockData = JSON.parse(event.dataTransfer.getData('application/json'))
        const dropZone = this.findDropZone(event.target)
        
        if (dropZone) {
          const dropPosition = this.getDropPosition(dropZone, event.clientY)
          this.moveBlock(blockData, dropPosition)
          dropZone.classList.remove('drop-before', 'drop-after')
        }
      } catch (error) {
        console.error('Drop error:', error)
      }
    },
    
    findDropZone(element) {
      while (element && !element.classList.contains('editor-block')) {
        element = element.parentElement
      }
      return element
    },
    
    highlightDropZone(dropZone, y) {
      const rect = dropZone.getBoundingClientRect()
      const middle = rect.top + rect.height / 2
      
      dropZone.classList.remove('drop-before', 'drop-after')
      dropZone.classList.add(y < middle ? 'drop-before' : 'drop-after')
    },
    
    getDropPosition(dropZone, y) {
      const rect = dropZone.getBoundingClientRect()
      const middle = rect.top + rect.height / 2
      const dropIndex = parseInt(dropZone.dataset.index)
      
      return {
        index: dropIndex,
        position: y < middle ? 'before' : 'after'
      }
    },
    
    moveBlock(blockData, dropPosition) {
      const { index: dropIndex, position } = dropPosition
      const sourceIndex = blockData.originalIndex
      const targetIndex = position === 'before' ? dropIndex : dropIndex + 1
      
      if (sourceIndex !== targetIndex) {
        this.$store.commit('MOVE_BLOCK', { 
          fromIndex: sourceIndex, 
          toIndex: targetIndex 
        })
      }
    }
  }
} 