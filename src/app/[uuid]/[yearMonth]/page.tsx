import Link from 'next/link'
import { getEntriesByMonth } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/categories'
import { formatYearMonth, isCurrentMonth, getCurrentYearMonth } from '@/lib/utils'
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
      className={`group relative flex flex-col rounded-2xl border p-4 transition-all
        ${hasContent
          ? 'border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
          : readOnly
          ? 'border-dashed border-gray-200 bg-gray-50 opacity-50 cursor-default dark:border-gray-700 dark:bg-gray-900'
          : 'border-dashed border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800'
        }`}
      onClick={readOnly && !hasContent ? (e) => e.preventDefault() : undefined}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-2xl">{category.emoji}</span>
        {!readOnly && !hasContent && (
          <span className="text-xs text-gray-400 dark:text-gray-500">+ 기록하기</span>
        )}
        {hasContent && !readOnly && (
          <span className="text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-500">
            수정
          </span>
        )}
      </div>

      <p className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
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
            <p className="line-clamp-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              {entry.text_content}
            </p>
          )}
          {!entry.text_content && entry.link_preview?.title && (
            <p className="line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              {entry.link_preview.title}
            </p>
          )}
        </div>
      ) : (
        <p className="flex-1 text-xs text-gray-400 dark:text-gray-600">{category.placeholder}</p>
      )}
    </Link>
  )
}

export default async function MonthPage({
  params,
}: {
  params: Promise<{ uuid: string; yearMonth: string }>
}) {
  const { uuid, yearMonth } = await params
  const readOnly = !isCurrentMonth(yearMonth)

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
    <div className="mx-auto min-h-screen max-w-[480px] px-4 pb-24">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 pb-4 pt-8 backdrop-blur-sm dark:bg-gray-950/80">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
              이달의 기록
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatYearMonth(yearMonth)}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {filledCount}/{CATEGORIES.length}
            </span>
            <Link
              href={`/${uuid}/archive`}
              className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              아카이브
            </Link>
          </div>
        </div>
        {readOnly && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">읽기 전용 — 지난 달 기록</p>
        )}
        {!readOnly && yearMonth !== getCurrentYearMonth() && null}
      </header>

      {/* 카테고리 그리드 */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            entry={entryMap.get(category.id)}
            href={`/${uuid}/${yearMonth}/${category.id}`}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  )
}
