import { ref } from 'vue'
import type { Ref } from 'vue'
import { useEditorStore } from '@/stores/editor'

interface DragState {
  isDragging: boolean
  draggedBlock: BlockData | null
}

interface BlockData {
  originalIndex: number
  type: string
  [key: string]: any
}

interface DropPosition {
  index: number
  position: 'before' | 'after'
}

export function useDragAndDrop() {
  const store = useEditorStore()
  const dragState: Ref<DragState> = ref({
    isDragging: false,
    draggedBlock: null
  })

  const onDragStart = (event: DragEvent, blockData: BlockData): void => {
    if (!event.dataTransfer) return

    dragState.value.isDragging = true
    dragState.value.draggedBlock = blockData
    
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(blockData))
    
    const target = event.target as HTMLElement
    target.classList.add('dragging')
  }
  
  const onDragEnd = (event: DragEvent): void => {
    dragState.value.isDragging = false
    dragState.value.draggedBlock = null
    
    const target = event.target as HTMLElement
    target.classList.remove('dragging')
  }
  
  const onDragOver = (event: DragEvent): void => {
    if (!event.dataTransfer) return

    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    
    const target = event.target as HTMLElement
    const dropZone = findDropZone(target)
    if (dropZone) {
      highlightDropZone(dropZone, event.clientY)
    }
  }
  
  const onDragLeave = (event: DragEvent): void => {
    const target = event.target as HTMLElement
    const dropZone = findDropZone(target)
    if (dropZone) {
      dropZone.classList.remove('drop-before', 'drop-after')
    }
  }
  
  const onDrop = (event: DragEvent): void => {
    if (!event.dataTransfer) return
    event.preventDefault()
    
    try {
      const blockData: BlockData = JSON.parse(
        event.dataTransfer.getData('application/json')
      )
      const target = event.target as HTMLElement
      const dropZone = findDropZone(target)
      
      if (dropZone) {
        const dropPosition = getDropPosition(dropZone, event.clientY)
        moveBlock(blockData, dropPosition)
        dropZone.classList.remove('drop-before', 'drop-after')
      }
    } catch (error) {
      console.error('Drop error:', error)
    }
  }
  
  const findDropZone = (element: HTMLElement): HTMLElement | null => {
    let current = element
    while (current && !current.classList.contains('editor-block')) {
      current = current.parentElement as HTMLElement
    }
    return current
  }
  
  const highlightDropZone = (dropZone: HTMLElement, y: number): void => {
    const rect = dropZone.getBoundingClientRect()
    const middle = rect.top + rect.height / 2
    
    dropZone.classList.remove('drop-before', 'drop-after')
    dropZone.classList.add(y < middle ? 'drop-before' : 'drop-after')
  }
  
  const getDropPosition = (dropZone: HTMLElement, y: number): DropPosition => {
    const rect = dropZone.getBoundingClientRect()
    const middle = rect.top + rect.height / 2
    const dropIndex = parseInt(dropZone.dataset.index || '0')
    
    return {
      index: dropIndex,
      position: y < middle ? 'before' : 'after'
    }
  }
  
  const moveBlock = (blockData: BlockData, dropPosition: DropPosition): void => {
    const { index: dropIndex, position } = dropPosition
    const sourceIndex = blockData.originalIndex
    const targetIndex = position === 'before' ? dropIndex : dropIndex + 1
    
    if (sourceIndex !== targetIndex) {
      store.moveBlock(sourceIndex, targetIndex)
    }
  }

  return {
    dragState,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop
  }
} 