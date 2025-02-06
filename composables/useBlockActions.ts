import { useEditorStore } from '@/stores/editor'

type BlockEmits = {
  (e: 'remove'): void
  (e: 'duplicate'): void
  (e: 'move', payload: { direction: 'up' | 'down', index: number, parentId: string }): void
  (e: 'update:content', payload: any): void
  [key: string]: any 
}

interface BlockActionsProps {
  index: number
  parentId: string
  emit: BlockEmits
}

export function useBlockActions({ index, parentId, emit }: BlockActionsProps) {
  const store = useEditorStore()

  const handleDelete = () => {
    console.log('Deleting block at index:', index)
    emit('remove')
  }

  const handleDuplicate = () => {
    console.log('Duplicating block at index:', index)
    emit('duplicate')
  }

  const handleMove = (direction: 'up' | 'down') => {
    console.log('Moving block:', { direction, index, parentId })
    emit('move', {
      direction,
      index,
      parentId
    })
  }

  return {
    handleDelete,
    handleDuplicate,
    handleMove
  }
} 