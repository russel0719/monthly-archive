import { notFound } from 'next/navigation'
import { getEntry } from '@/lib/supabase'
import { getCategoryById } from '@/lib/categories'
import { isCurrentMonth, formatYearMonth } from '@/lib/utils'
import EntryEditor from '@/components/EntryEditor'
import type { Entry } from '@/lib/supabase'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ uuid: string; yearMonth: string; category: string }>
}) {
  const { uuid, yearMonth, category } = await params
  const categoryDef = getCategoryById(category)
  if (!categoryDef) notFound()

  const readOnly = !isCurrentMonth(yearMonth)

  let entry: Entry | null = null
  try {
    entry = await getEntry(yearMonth, category)
  } catch {
    // Supabase 미설정 시 null
  }

  return (
    <div className="mx-auto min-h-screen max-w-[480px] px-4 pb-24">
      <header className="pb-6 pt-8">
        <div className="flex items-center gap-3">
          <a
            href={`/${uuid}/${yearMonth}`}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            ←
          </a>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {formatYearMonth(yearMonth)}
            </p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <span>{categoryDef.emoji}</span>
              <span>이달의 {categoryDef.label}</span>
            </h1>
          </div>
        </div>
        {readOnly && (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">읽기 전용 — 지난 달 기록</p>
        )}
      </header>

      <EntryEditor
        uuid={uuid}
        yearMonth={yearMonth}
        category={category}
        categoryDef={categoryDef}
        initialEntry={entry}
        readOnly={readOnly}
      />
    </div>
  )
}
