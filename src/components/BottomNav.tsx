'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCurrentYearMonth } from '@/lib/utils'

function getPrevYearMonth(): string {
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`
}

export default function BottomNav() {
  const pathname = usePathname()
  const currentYm = getCurrentYearMonth()
  const prevYm = getPrevYearMonth()

  const NAV_ITEMS = [
    { href: `/${prevYm}`, label: '지난 달', emoji: '◀︎' },
    { href: `/${currentYm}`, label: '이번 달', emoji: '●' },
    { href: '/archive', label: '아카이브', emoji: '🗂️' },
  ]

  function isActive(href: string): boolean {
    if (href === '/archive') return pathname.startsWith('/archive')
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-[60px] border-t border-border bg-bg-primary"
    >
      <div className="mx-auto flex h-full max-w-[640px] items-center justify-around px-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5
                       text-xs transition-opacity duration-150 active:opacity-60
                       ${isActive(item.href) ? 'text-accent' : 'text-text-disabled'}`}
          >
            <span className="text-base leading-none">{item.emoji}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
