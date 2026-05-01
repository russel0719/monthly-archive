export function getCurrentYearMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  return `${year}년 ${Number(month)}월`
}

export function isCurrentMonth(yearMonth: string): boolean {
  return yearMonth === getCurrentYearMonth()
}

export function isEditableMonth(yearMonth: string): boolean {
  const now = new Date()
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prev = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
  return yearMonth === current || yearMonth === prev
}

export function sortYearMonthsDesc(yearMonths: string[]): string[] {
  return [...yearMonths].sort((a, b) => b.localeCompare(a))
}
