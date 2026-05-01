import Link from 'next/link'
import { getAllYearMonths, getEntriesByMonth } from '@/lib/supabase'
import { formatYearMonth, getCurrentYearMonth } from '@/lib/utils'
import { CATEGORIES } from '@/lib/categories'

export default async function ArchivePage() {
  const currentYearMonth = getCurrentYearMonth()

  let yearMonths: string[] = []
  try {
    yearMonths = await getAllYearMonths()
  } catch {
    // Supabase 미설정 시 빈 배열
  }

  const pastMonths = yearMonths.filter((ym) => ym !== currentYearMonth)

  return (
    <div className="mx-auto min-h-screen max-w-[640px] px-4 pb-[60px]">
      <header className="pb-4 pt-8">
        <p className="text-xs font-medium uppercase tracking-widest text-text-disabled">
          아카이브
        </p>
        <h1 className="mt-1 text-2xl font-bold text-text-primary">지난 기록</h1>
      </header>

      {pastMonths.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-4 text-sm text-text-disabled">아직 지난 기록이 없어요</p>
          <p className="mt-1 text-xs text-text-disabled opacity-60">
            이달의 기록을 완성하면 여기에 쌓여요
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pastMonths.map((ym) => (
            <ArchiveItem key={ym} yearMonth={ym} />
          ))}
        </div>
      )}
    </div>
  )
}

async function ArchiveItem({ yearMonth }: { yearMonth: string }) {
  let filledCount = 0
  try {
    const entries = await getEntriesByMonth(yearMonth)
    filledCount = entries.filter(
      (e) => e.text_content || (e.image_urls && e.image_urls.length > 0) || e.link_url
    ).length
  } catch {
    // ignore
  }

  return (
    <Link
      href={`/${yearMonth}`}
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-bg-primary p-5
                 transition-all duration-150 active:opacity-80 active:scale-[0.98]
                 dark:border-gray-700 dark:bg-bg-primary"
    >
      <div>
        <p className="font-semibold text-text-primary">
          {formatYearMonth(yearMonth)}
        </p>
        <p className="mt-0.5 text-xs text-text-disabled">
          {filledCount}/{CATEGORIES.length} 채움
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-tertiary dark:bg-bg-tertiary">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${(filledCount / CATEGORIES.length) * 100}%` }}
          />
        </div>
        <span className="text-text-disabled">→</span>
      </div>
    </Link>
  )
}
