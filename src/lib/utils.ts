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

export function sortYearMonthsDesc(yearMonths: string[]): string[] {
  return [...yearMonths].sort((a, b) => b.localeCompare(a))
}
