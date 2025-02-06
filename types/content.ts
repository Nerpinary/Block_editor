import type { BlockData, ContentBlock } from "./blocks"

export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingContent {
  text: string
  level: HeadingLevel
  alignment: TextAlign
  color: string
}

export interface ImageContent {
  url: string
  caption: string
}

export interface ListItem {
  text: string
}

export interface ListContent {
  items: ListItem[]
}

export interface ProsConsContent {
  pros: string
  cons: string
}

export interface SpecificationsContent {
  rows: SpecificationRow[]
}

export interface SpecificationRow {
  key: string
  value: string
}

export interface TableContent {
  data: string[][]
}

export interface ColumnsContent {
  columns: BlockData[][]
}

export interface TextContent {
  text: string
  alignment: TextAlign
  color: string
}

export interface ColumnContent {
  left: ContentBlock[]
  right: ContentBlock[]
}

export interface ColumnsBlockContent {
  columns: ContentBlock[][]
} 