import type { Block } from "./blocks"

export interface Page {
  id: string
  title: string
  slug: string
  blocks: Block[]
  createdAt: string
  updatedAt: string
}

export interface PageData {
  title: string
  slug: string
  content?: any
  id?: string | number
} 