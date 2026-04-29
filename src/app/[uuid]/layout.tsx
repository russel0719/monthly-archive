import { notFound } from 'next/navigation'

export default async function UUIDLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  if (uuid !== process.env.PRIVATE_UUID) {
    notFound()
  }
  return <>{children}</>
}
