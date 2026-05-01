import { NextRequest } from 'next/server'
import { getEntriesByMonth, upsertEntry, deleteEntry, createSupabaseServerClient } from '@/lib/supabase'

async function getAuthUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const yearMonth = request.nextUrl.searchParams.get('yearMonth')
    if (!yearMonth) {
      return Response.json({ error: 'yearMonth required' }, { status: 400 })
    }
    const entries = await getEntriesByMonth(yearMonth)
    return Response.json(entries)
  } catch (e) {
    console.error('[GET /api/entries]', e)
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { yearMonth, category, ...payload } = body
    if (!yearMonth || !category) {
      return Response.json({ error: 'yearMonth and category required' }, { status: 400 })
    }
    const entry = await upsertEntry(yearMonth, category, payload)
    return Response.json(entry)
  } catch (e) {
    console.error('[POST /api/entries]', e)
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { yearMonth, category } = body
    if (!yearMonth || !category) {
      return Response.json({ error: 'yearMonth and category required' }, { status: 400 })
    }
    await deleteEntry(yearMonth, category)
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/entries]', e)
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
