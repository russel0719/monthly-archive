import { redirect } from 'next/navigation'
import { getCurrentYearMonth } from '@/lib/utils'

export default function RootPage() {
  redirect(`/${getCurrentYearMonth()}`)
}
