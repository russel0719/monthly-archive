'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCurrentYearMonth } from '@/lib/utils'

function getPrevYearMonth(): string {
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`
}

function IconPrev() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <polyline points="11 14 9 16 11 18"/>
      <line x1="9" y1="16" x2="14" y2="16"/>
    </svg>
  )
}

function IconToday() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function IconArchive() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8"/>
      <rect x="1" y="3" width="22" height="5" rx="1"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  )
}

export default function BottomNav() {
  const pathname = usePathname()
  const currentYm = getCurrentYearMonth()
  const prevYm = getPrevYearMonth()

  const NAV_ITEMS = [
    { href: `/${prevYm}`, label: '지난 달', Icon: IconPrev },
    { href: `/${currentYm}`, label: '이번 달', Icon: IconToday },
    { href: '/archive', label: '아카이브', Icon: IconArchive },
  ]

  function isActive(href: string): boolean {
    if (href === '/archive') return pathname.startsWith('/archive')
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[60px] border-t border-border bg-bg-primary">
      <div className="mx-auto flex h-full max-w-[640px] items-center justify-around px-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1
                       text-xs transition-opacity duration-150 active:opacity-60
                       ${isActive(item.href) ? 'text-accent' : 'text-text-disabled'}`}
          >
            <item.Icon />
            <span className="font-medium leading-none">{item.label}</span>
            {isActive(item.href) && (
              <span className="mt-0.5 h-1 w-1 rounded-full bg-accent" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
