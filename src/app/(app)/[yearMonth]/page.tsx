import Link from 'next/link'
import { getEntriesByMonth } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/categories'
import { formatYearMonth, isEditableMonth } from '@/lib/utils'
import type { Entry } from '@/lib/supabase'

function CategoryCard({
  category,
  entry,
  href,
  readOnly,
}: {
  category: (typeof CATEGORIES)[number]
  entry: Entry | undefined
  href: string
  readOnly: boolean
}) {
  const hasContent =
    entry &&
    (entry.text_content || (entry.image_urls && entry.image_urls.length > 0) || entry.link_url)

  return (
    <Link
      href={readOnly && !hasContent ? '#' : href}
      className={`flex flex-col rounded-xl border p-4 transition-all duration-150
        ${hasContent
          ? 'border-gray-200 bg-bg-primary dark:border-gray-700 dark:bg-bg-primary active:opacity-80 active:scale-[0.98]'
          : readOnly
          ? 'border-dashed border-gray-200 bg-bg-secondary opacity-50 cursor-default dark:border-gray-700 dark:bg-bg-tertiary'
          : 'border-dashed border-gray-200 bg-bg-secondary dark:border-gray-700 dark:bg-bg-tertiary active:opacity-80 active:scale-[0.98]'
        }`}
      onClick={readOnly && !hasContent ? (e) => e.preventDefault() : undefined}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-2xl">{category.emoji}</span>
        {!readOnly && !hasContent && (
          <span className="text-xs text-text-disabled">+ 기록하기</span>
        )}
      </div>

      <p className="mb-2 text-sm font-semibold text-text-primary dark:text-text-primary">
        {category.label}
      </p>

      {hasContent ? (
        <div className="flex-1 overflow-hidden">
          {entry.image_urls && entry.image_urls.length > 0 && (
            <div className="mb-2 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.image_urls[0]}
                alt={category.label}
                className="h-28 w-full object-cover"
              />
            </div>
          )}
          {entry.text_content && (
            <p className="line-clamp-3 text-xs leading-relaxed text-text-secondary">
              {entry.text_content}
            </p>
          )}
          {!entry.text_content && entry.link_preview?.title && (
            <p className="line-clamp-2 text-xs leading-relaxed text-text-secondary">
              {entry.link_preview.title}
            </p>
          )}
        </div>
      ) : (
        <p className="flex-1 text-xs text-text-disabled">{category.placeholder}</p>
      )}
    </Link>
  )
}

export default async function MonthPage({
  params,
}: {
  params: Promise<{ yearMonth: string }>
}) {
  const { yearMonth } = await params
  const readOnly = !isEditableMonth(yearMonth)

  let entries: Entry[] = []
  try {
    entries = await getEntriesByMonth(yearMonth)
  } catch {
    // Supabase 미설정 시 빈 배열로 처리
  }

  const entryMap = new Map(entries.map((e) => [e.category, e]))
  const filledCount = entries.filter(
    (e) => e.text_content || (e.image_urls && e.image_urls.length > 0) || e.link_url
  ).length

  return (
    <div className="mx-auto min-h-screen max-w-[640px] px-4 pb-[60px]">
      <header className="sticky top-0 z-10 bg-bg-primary pb-4 pt-8 dark:bg-bg-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-text-disabled">
              이달의 기록
            </p>
            <h1 className="mt-1 text-2xl font-bold text-text-primary">
              {formatYearMonth(yearMonth)}
            </h1>
          </div>
          <span className="text-sm text-text-disabled">
            {filledCount}/{CATEGORIES.length}
          </span>
        </div>
        {readOnly && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">읽기 전용 — 2달 이상 지난 기록</p>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            entry={entryMap.get(category.id)}
            href={`/${yearMonth}/${category.id}`}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  )
}
