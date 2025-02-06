import type { TextAlign } from "./content"

export type TextFormatCommand = 'bold' | 'italic' | 'underline'

export interface TextFormat {
  command: string
  title: string
  icon: string
}

export interface Alignment {
  value: TextAlign
  title: string
  icon: string
}

export interface Color {
  hex: string
  name: string
}

export interface ActiveStates {
  bold: boolean
  italic: boolean
  underline: boolean
} 