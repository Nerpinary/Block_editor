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
    emit('remove')
  }

  const handleDuplicate = () => {
    emit('duplicate')
  }

  const handleMove = (direction: 'up' | 'down') => {
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