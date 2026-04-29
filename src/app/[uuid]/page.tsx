import { redirect } from 'next/navigation'
import { getCurrentYearMonth } from '@/lib/utils'

export default async function UUIDRootPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  redirect(`/${uuid}/${getCurrentYearMonth()}`)
}
