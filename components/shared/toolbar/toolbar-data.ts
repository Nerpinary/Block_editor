import type { TextFormat, Alignment, Color } from '@/types/toolbar'

export const textFormats: TextFormat[] = [
  {
    command: 'bold',
    title: 'Жирный текст',
    icon: '<path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>'
  },
  {
    command: 'italic',
    title: 'Курсив',
    icon: '<path d="M19 4h-9M14 20H5M15 4L9 20"></path>'
  },
  {
    command: 'underline',
    title: 'Подчеркнутый',
    icon: '<path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line>'
  }
]

export const alignments: Alignment[] = [
  {
    value: 'left',
    title: 'По левому краю',
    icon: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>'
  },
  {
    value: 'center',
    title: 'По центру',
    icon: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>'
  },
  {
    value: 'right',
    title: 'По правому краю',
    icon: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>'
  }
]

export const colors: Color[] = [
  { hex: '#1F2937', name: 'Черный' },
  { hex: '#4B5563', name: 'Темно-серый' },
  { hex: '#6B7280', name: 'Серый' },
  { hex: '#9CA3AF', name: 'Светло-серый' },
  { hex: '#D1D5DB', name: 'Очень светло-серый' },
  { hex: '#DC2626', name: 'Красный' },
  { hex: '#EA580C', name: 'Оранжевый' },
  { hex: '#D97706', name: 'Желтый' },
  { hex: '#059669', name: 'Зеленый' },
  { hex: '#0891B2', name: 'Голубой' },
  { hex: '#2563EB', name: 'Синий' },
  { hex: '#4F46E5', name: 'Индиго' },
  { hex: '#7C3AED', name: 'Фиолетовый' },
  { hex: '#DB2777', name: 'Розовый' },
  { hex: '#9D174D', name: 'Малиновый' }
] 