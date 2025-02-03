import { getters } from '@/store/index'; // Путь к вашему файлу с геттерами

describe('getters', () => {
  const state = {
    blockConfigs: {
      Text: {
        icon: 'TextIcon',
        name: 'Текст'
      },
      Heading: {
        icon: 'HeadingIcon',
        name: 'Заголовок'
      }
    },
    blocks: []
  };

  it('getBlockConfig returns correct config for a given type', () => {
    const result = getters.getBlockConfig(state)('Text');
    expect(result).toEqual({
      icon: 'TextIcon',
      name: 'Текст'
    });
  });

  it('getBlockConfig returns undefined for unknown type', () => {
    const result = getters.getBlockConfig(state)('UnknownType');
    expect(result).toBeUndefined();
  });
}); 