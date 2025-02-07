import type { Block } from "./blocks"

export interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
  createdAt: number;
  updatedAt: number;
}

export interface PageData {
  title: string
  slug: string
  content?: any
  id?: string | number
} 