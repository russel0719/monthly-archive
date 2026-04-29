import { NextRequest } from 'next/server'

function extractMeta(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1]
  }
  return ''
}

function extractNameMeta(html: string, name: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1]
  }
  return ''
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match ? match[1].trim() : ''
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return Response.json({ error: 'url required' }, { status: 400 })

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MonthlyArchiveBot/1.0)' },
      signal: AbortSignal.timeout(5000),
    })
    const html = await res.text()

    const title =
      extractMeta(html, 'og:title') ||
      extractMeta(html, 'twitter:title') ||
      extractTitle(html)

    const description =
      extractMeta(html, 'og:description') ||
      extractMeta(html, 'twitter:description') ||
      extractNameMeta(html, 'description')

    const image =
      extractMeta(html, 'og:image') ||
      extractMeta(html, 'twitter:image')

    const origin = new URL(url).origin
    const faviconMatch = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i)
    const favicon = faviconMatch
      ? faviconMatch[1].startsWith('http') ? faviconMatch[1] : `${origin}${faviconMatch[1]}`
      : `${origin}/favicon.ico`

    return Response.json({ title, description, image, favicon })
  } catch {
    return Response.json({ title: '', description: '', image: '', favicon: '' })
  }
}
