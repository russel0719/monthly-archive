import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const uuid = process.env.PRIVATE_UUID
  if (!uuid) return NextResponse.next()

  const { pathname } = request.nextUrl

  // API 라우트는 제외
  if (pathname.startsWith('/api/')) return NextResponse.next()

  // 루트는 UUID로 리다이렉트
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${uuid}`, request.url))
  }

  // UUID 검증: 경로의 첫 세그먼트가 PRIVATE_UUID와 일치해야 함
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && segments[0] !== uuid) {
    return NextResponse.rewrite(new URL('/not-found', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)'],
}
