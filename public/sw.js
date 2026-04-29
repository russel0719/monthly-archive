// 기본 서비스 워커 — 정적 자산 캐시
const CACHE_NAME = 'monthly-archive-v1'
const STATIC_ASSETS = ['/', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // API 요청은 캐시하지 않음
  if (event.request.url.includes('/api/')) return

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})
