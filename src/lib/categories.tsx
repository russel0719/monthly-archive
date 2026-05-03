import type { ReactNode } from 'react'

export type MediaType = 'text' | 'image' | 'link'

export interface Category {
  id: string
  label: string
  icon: ReactNode
  mediaTypes: MediaType[]
  placeholder: string
}

const p = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const CATEGORIES: Category[] = [
  {
    id: 'photo',
    label: '사진',
    icon: (
      <svg {...p}>
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
    mediaTypes: ['image'],
    placeholder: '이달을 대표하는 사진을 올려주세요',
  },
  {
    id: 'song',
    label: '노래',
    icon: (
      <svg {...p}>
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    mediaTypes: ['link', 'text'],
    placeholder: '이달에 가장 많이 들은 노래',
  },
  {
    id: 'goal',
    label: '목표',
    icon: (
      <svg {...p}>
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    mediaTypes: ['text'],
    placeholder: '이달에 세웠거나 이룬 목표',
  },
  {
    id: 'quote',
    label: '문장',
    icon: (
      <svg {...p}>
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    mediaTypes: ['text'],
    placeholder: '이달에 마음에 남은 문장이나 글귀',
  },
  {
    id: 'restaurant',
    label: '맛집',
    icon: (
      <svg {...p}>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/>
        <line x1="7" y1="2" x2="7" y2="22"/>
        <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3z"/>
        <line x1="21" y1="15" x2="21" y2="22"/>
      </svg>
    ),
    mediaTypes: ['text', 'image', 'link'],
    placeholder: '이달에 가장 인상 깊었던 식당이나 카페',
  },
  {
    id: 'place',
    label: '장소',
    icon: (
      <svg {...p}>
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    mediaTypes: ['text', 'image'],
    placeholder: '이달에 다녀온 기억에 남는 장소',
  },
  {
    id: 'purchase',
    label: '소비',
    icon: (
      <svg {...p}>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    mediaTypes: ['text', 'image', 'link'],
    placeholder: '이달에 가장 잘했다고 생각하는 소비',
  },
  {
    id: 'movie',
    label: '영화/드라마',
    icon: (
      <svg {...p}>
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    mediaTypes: ['text', 'image', 'link'],
    placeholder: '이달에 인상 깊었던 영상 콘텐츠',
  },
  {
    id: 'discovery',
    label: '발견',
    icon: (
      <svg {...p}>
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    mediaTypes: ['text', 'link'],
    placeholder: '이달에 새로 알게 된 것 (앱, 제품, 습관 등)',
  },
  {
    id: 'gratitude',
    label: '감사한 것',
    icon: (
      <svg {...p}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    mediaTypes: ['text'],
    placeholder: '이달에 감사했던 순간이나 사람',
  },
]

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}
