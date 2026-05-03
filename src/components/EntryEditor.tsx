'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/categories'
import type { Entry } from '@/lib/supabase'

interface LinkPreview {
  title?: string
  description?: string
  image?: string
  favicon?: string
}

interface Props {
  yearMonth: string
  category: string
  categoryDef: Category
  initialEntry: Entry | null
  readOnly: boolean
}

export default function EntryEditor({
  yearMonth,
  category,
  categoryDef,
  initialEntry,
  readOnly,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [textContent, setTextContent] = useState(initialEntry?.text_content ?? '')
  const [imageUrls, setImageUrls] = useState<string[]>(initialEntry?.image_urls ?? [])
  const [linkUrl, setLinkUrl] = useState(initialEntry?.link_url ?? '')
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(
    initialEntry?.link_preview ?? null
  )
  const [memo, setMemo] = useState(initialEntry?.memo ?? '')
  const [isFetchingPreview, setIsFetchingPreview] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasImage = categoryDef.mediaTypes.includes('image')
  const hasText = categoryDef.mediaTypes.includes('text')
  const hasLink = categoryDef.mediaTypes.includes('link')

  async function fetchLinkPreview(url: string) {
    if (!url.trim()) return
    setIsFetchingPreview(true)
    try {
      const res = await fetch(`/api/og-preview?url=${encodeURIComponent(url)}`)
      if (res.ok) {
        const data = await res.json()
        setLinkPreview(data)
      }
    } catch {
      // ignore
    } finally {
      setIsFetchingPreview(false)
    }
  }

  async function handleImageUpload(files: FileList) {
    const remaining = 3 - imageUrls.length
    const toUpload = Array.from(files).slice(0, remaining)

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i]
      if (!file.type.match(/^image\//)) continue
      if (file.size > 10 * 1024 * 1024) {
        setError('이미지는 10MB 이하만 업로드 가능해요')
        continue
      }

      setUploadingIndex(imageUrls.length + i)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('yearMonth', yearMonth)
      formData.append('category', category)

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) throw new Error('Upload failed')
        const { url } = await res.json()
        setImageUrls((prev) => [...prev, url])
      } catch {
        setError('이미지 업로드에 실패했어요')
      } finally {
        setUploadingIndex(null)
      }
    }
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            yearMonth,
            category,
            text_content: textContent || null,
            image_urls: imageUrls,
            link_url: linkUrl || null,
            link_preview: linkPreview,
            memo: memo || null,
          }),
        })
        if (!res.ok) throw new Error('Save failed')
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        router.refresh()
      } catch {
        setError('저장에 실패했어요. 다시 시도해주세요.')
      }
    })
  }

  async function handleDelete() {
    if (!confirm('이 기록을 삭제할까요?')) return
    startTransition(async () => {
      try {
        const res = await fetch('/api/entries', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ yearMonth, category }),
        })
        if (!res.ok) throw new Error('Delete failed')
        router.push(`/${yearMonth}`)
        router.refresh()
      } catch {
        setError('삭제에 실패했어요.')
      }
    })
  }

  if (readOnly) {
    const hasContent = initialEntry && (
      initialEntry.text_content ||
      (initialEntry.image_urls && initialEntry.image_urls.length > 0) ||
      initialEntry.link_url
    )
    if (!hasContent) {
      return (
        <div className="mt-16 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-4 text-sm text-text-disabled">기록이 없어요</p>
        </div>
      )
    }
    return (
      <div className="space-y-6">
        {imageUrls.length > 0 && (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(imageUrls.length, 2)}, 1fr)` }}>
            {imageUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt="" className="w-full rounded-xl object-cover aspect-square" />
            ))}
          </div>
        )}
        {linkPreview && (
          <LinkPreviewCard preview={linkPreview} url={linkUrl} />
        )}
        {textContent && (
          <p className="whitespace-pre-wrap leading-relaxed text-text-primary">
            {textContent}
          </p>
        )}
        {memo && (
          <div className="rounded-xl bg-bg-secondary p-4">
            <p className="text-xs font-medium text-text-disabled mb-1">메모</p>
            <p className="text-sm leading-relaxed text-text-secondary">{memo}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {hasImage && (
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            사진 <span className="font-normal text-text-disabled">최대 3장</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full
                             bg-black/60 text-white text-xs transition-opacity duration-150 active:opacity-60"
                >
                  ×
                </button>
              </div>
            ))}
            {imageUrls.length < 3 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingIndex !== null}
                className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed
                           border-gray-300 bg-bg-secondary text-2xl transition-all duration-150
                           active:opacity-80 active:scale-[0.98] disabled:opacity-50"
              >
                {uploadingIndex !== null ? (
                  <span className="text-xs text-text-disabled">업로드 중...</span>
                ) : (
                  '+'
                )}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          />
        </div>
      )}

      {hasLink && (
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            링크
          </label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => {
              setLinkUrl(e.target.value)
              setLinkPreview(null)
            }}
            onBlur={() => fetchLinkPreview(linkUrl)}
            placeholder="https://"
            className="w-full h-[44px] rounded-[10px] border border-gray-300 bg-bg-primary px-4 text-sm
                       outline-none transition-colors focus:border-accent"
          />
          {isFetchingPreview && (
            <p className="mt-2 text-xs text-text-disabled">미리보기 불러오는 중...</p>
          )}
          {linkPreview && !isFetchingPreview && (
            <div className="mt-2">
              <LinkPreviewCard preview={linkPreview} url={linkUrl} />
            </div>
          )}
        </div>
      )}

      {hasText && (
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            내용
          </label>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder={categoryDef.placeholder}
            rows={4}
            className="w-full resize-none rounded-[10px] border border-gray-300 bg-bg-primary px-4 py-3
                       text-sm leading-relaxed outline-none transition-colors focus:border-accent"
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          메모{' '}
          <span className="font-normal text-text-disabled">선택 · {memo.length}/500</span>
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value.slice(0, 500))}
          placeholder="자유롭게 메모를 남겨보세요"
          rows={3}
          className="w-full resize-none rounded-[10px] border border-gray-300 bg-bg-primary px-4 py-3
                     text-sm leading-relaxed outline-none transition-colors focus:border-accent"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex-1 h-[44px] rounded-full bg-accent text-sm font-semibold text-text-primary
                     transition-all duration-150 active:opacity-80 active:scale-[0.98]
                     disabled:opacity-50"
        >
          {isPending ? '저장 중...' : saved ? '✓ 저장됨' : '저장하기'}
        </button>
        {initialEntry && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="h-[44px] rounded-full border border-gray-300 px-4 text-sm text-text-secondary
                       transition-all duration-150 active:opacity-80 active:scale-[0.98]
                       disabled:opacity-50"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  )
}

function LinkPreviewCard({ preview, url }: { preview: LinkPreview; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex overflow-hidden rounded-xl border border-gray-300 bg-bg-primary
                 transition-all duration-150 active:opacity-80"
    >
      {preview.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview.image}
          alt=""
          className="h-20 w-20 flex-shrink-0 object-cover"
        />
      )}
      <div className="flex min-w-0 flex-col justify-center px-3 py-2">
        {preview.title && (
          <p className="truncate text-sm font-medium text-text-primary">
            {preview.title}
          </p>
        )}
        {preview.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">
            {preview.description}
          </p>
        )}
        <p className="mt-1 truncate text-xs text-text-disabled">
          {url}
        </p>
      </div>
    </a>
  )
}
