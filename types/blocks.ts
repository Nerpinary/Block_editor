import type { 
  HeadingContent, 
  TextContent,
  ListContent, 
  ProsConsContent, 
  SpecificationsContent, 
  TableContent, 
  ColumnsContent, 
  ImageContent 
} 
from "./content"


export type BlockType = 
  | 'Text'
  | 'Heading'
  | 'Image'
  | 'List'
  | 'Table'
  | 'Columns'
  | 'Specifications'
  | 'ProsCons'

export interface Block {
  id?: number
  type: BlockType
  content: BlockContent
  parentId: string
}

export interface ContentBlock {
  id: string
  type: BlockType
  content: 
    | TextContent 
    | HeadingContent 
    | ImageContent 
    | ListContent 
    | TableContent 
    | ProsConsContent 
    | SpecificationsContent 
    | ColumnsContent 
    | string
}

export interface BlockConfig {
  name: string
  icon: string
}

export type BlockContent = 
  | string 
  | HeadingContent 
  | ImageContent 
  | ColumnsContent 
  | SpecificationsContent 
  | ProsConsContent 
  | ListContent 
  | TableContent 

export interface BlockLibraryItem {
  type: BlockType
  icon: string
  name: string
}

export interface BlockData {
  type: string
  index: number
  originalIndex: number
  parentId: string
  source: string
  content: any
  originalBlock: {
    type: string
    content: any
  }
} 