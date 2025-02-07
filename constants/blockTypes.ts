export const BLOCK_TYPES = {
    TEXT: 'Text',
    HEADING: 'Heading',
    IMAGE: 'Image',
    TWO_COLUMNS: 'Columns',
    SPECIFICATIONS: 'Specifications',
    PROS_CONS: 'ProsCons',
    LIST: 'List',
    TABLE: 'Table'
  } as const;
  
  export type BlockType = typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES];
  
  export const BLOCK_CATEGORIES = {
    BASIC: 'basic',
    CUSTOM: 'custom'
  } as const;
  
  export type BlockCategory = typeof BLOCK_CATEGORIES[keyof typeof BLOCK_CATEGORIES];
  