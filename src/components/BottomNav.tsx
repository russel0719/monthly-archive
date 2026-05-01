'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCurrentYearMonth } from '@/lib/utils'

const NAV_ITEMS = [
  { href: `/${getCurrentYearMonth()}`, label: '이번 달', emoji: '📅' },
  { href: '/archive', label: '아카이브', emoji: '🗂️' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-[60px] border-t border-border
                  bg-bg-primary dark:bg-bg-primary"
    >
      <div className="mx-auto flex h-full max-w-[640px] items-center justify-around px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/archive'
            ? pathname.startsWith('/archive')
            : !pathname.startsWith('/archive') && !pathname.startsWith('/login') && !pathname.startsWith('/auth')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5
                         text-xs transition-opacity duration-150 active:opacity-60
                         ${isActive ? 'text-accent' : 'text-text-disabled'}`}
            >
              <span className="text-xl leading-none">{item.emoji}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
