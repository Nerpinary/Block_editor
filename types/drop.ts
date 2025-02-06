export interface DropData {
  type: string
  source: string
  content: any
  index?: number
  originalIndex?: number
  parentId?: string
  originalBlock?: any
  [key: string]: any
}

export interface DropEvent {
  data: DropData
  zoneId: string
  event: DragEvent
} 