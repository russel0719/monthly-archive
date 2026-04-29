export type MediaType = 'text' | 'image' | 'link'

export interface Category {
  id: string
  label: string
  emoji: string
  mediaTypes: MediaType[]
  placeholder: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'photo',
    label: '사진',
    emoji: '📷',
    mediaTypes: ['image'],
    placeholder: '이달을 대표하는 사진을 올려주세요',
  },
  {
    id: 'song',
    label: '노래',
    emoji: '🎵',
    mediaTypes: ['link', 'text'],
    placeholder: '이달에 가장 많이 들은 노래',
  },
  {
    id: 'goal',
    label: '목표',
    emoji: '🎯',
    mediaTypes: ['text'],
    placeholder: '이달에 세웠거나 이룬 목표',
  },
  {
    id: 'quote',
    label: '문장',
    emoji: '✍️',
    mediaTypes: ['text'],
    placeholder: '이달에 마음에 남은 문장이나 글귀',
  },
  {
    id: 'restaurant',
    label: '맛집',
    emoji: '🍽️',
    mediaTypes: ['text', 'image', 'link'],
    placeholder: '이달에 가장 인상 깊었던 식당이나 카페',
  },
  {
    id: 'place',
    label: '장소',
    emoji: '📍',
    mediaTypes: ['text', 'image'],
    placeholder: '이달에 다녀온 기억에 남는 장소',
  },
  {
    id: 'purchase',
    label: '소비',
    emoji: '🛍️',
    mediaTypes: ['text', 'image', 'link'],
    placeholder: '이달에 가장 잘했다고 생각하는 소비',
  },
  {
    id: 'movie',
    label: '영화/드라마',
    emoji: '🎬',
    mediaTypes: ['text', 'image', 'link'],
    placeholder: '이달에 인상 깊었던 영상 콘텐츠',
  },
  {
    id: 'discovery',
    label: '발견',
    emoji: '🔍',
    mediaTypes: ['text', 'link'],
    placeholder: '이달에 새로 알게 된 것 (앱, 제품, 습관 등)',
  },
  {
    id: 'gratitude',
    label: '감사한 것',
    emoji: '🙏',
    mediaTypes: ['text'],
    placeholder: '이달에 감사했던 순간이나 사람',
  },
]

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}
