import Link from 'next/link'
import { getAllYearMonths, getEntriesByMonth } from '@/lib/supabase'
import { formatYearMonth, getCurrentYearMonth } from '@/lib/utils'
import { CATEGORIES } from '@/lib/categories'

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  const currentYearMonth = getCurrentYearMonth()

  let yearMonths: string[] = []
  try {
    yearMonths = await getAllYearMonths()
  } catch {
    // Supabase 미설정 시 빈 배열
  }

  // 현재 달은 아카이브에서 제외
  const pastMonths = yearMonths.filter((ym) => ym !== currentYearMonth)

  return (
    <div className="mx-auto min-h-screen max-w-[480px] px-4 pb-24">
      <header className="pb-4 pt-8">
        <div className="flex items-center gap-3">
          <Link
            href={`/${uuid}/${currentYearMonth}`}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            ←
          </Link>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
              아카이브
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">지난 기록</h1>
          </div>
        </div>
      </header>

      {pastMonths.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">아직 지난 기록이 없어요</p>
          <p className="mt-1 text-xs text-gray-300 dark:text-gray-600">
            이달의 기록을 완성하면 여기에 쌓여요
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pastMonths.map((ym) => (
            <ArchiveItem key={ym} uuid={uuid} yearMonth={ym} />
          ))}
        </div>
      )}
    </div>
  )
}

async function ArchiveItem({ uuid, yearMonth }: { uuid: string; yearMonth: string }) {
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
      href={`/${uuid}/${yearMonth}`}
      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div>
        <p className="font-semibold text-gray-900 dark:text-gray-100">
          {formatYearMonth(yearMonth)}
        </p>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          {filledCount}/{CATEGORIES.length} 채움
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gray-400 dark:bg-gray-400"
            style={{ width: `${(filledCount / CATEGORIES.length) * 100}%` }}
          />
        </div>
        <span className="text-gray-300 dark:text-gray-600">→</span>
      </div>
    </Link>
  )
}
