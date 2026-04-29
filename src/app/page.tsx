import { redirect } from 'next/navigation'
import { getCurrentYearMonth } from '@/lib/utils'

export default function RootPage() {
  const uuid = process.env.PRIVATE_UUID
  if (!uuid) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">설정 필요</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            .env.local 파일에 PRIVATE_UUID를 설정해주세요.
          </p>
        </div>
      </div>
    )
  }
  redirect(`/${uuid}/${getCurrentYearMonth()}`)
}
