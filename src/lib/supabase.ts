import { createClient } from '@supabase/supabase-js'

export interface Entry {
  id: string
  year_month: string
  category: string
  text_content: string | null
  image_urls: string[]
  link_url: string | null
  link_preview: {
    title?: string
    description?: string
    image?: string
    favicon?: string
  } | null
  memo: string | null
  created_at: string
  updated_at: string
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createClient(url, key)
}

export async function getEntriesByMonth(yearMonth: string): Promise<Entry[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('year_month', yearMonth)
  if (error) throw error
  return data ?? []
}

export async function getEntry(yearMonth: string, category: string): Promise<Entry | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('year_month', yearMonth)
    .eq('category', category)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function upsertEntry(
  yearMonth: string,
  category: string,
  payload: Partial<Omit<Entry, 'id' | 'year_month' | 'category' | 'created_at' | 'updated_at'>>
): Promise<Entry> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('entries')
    .upsert(
      { year_month: yearMonth, category, ...payload },
      { onConflict: 'year_month,category' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteEntry(yearMonth: string, category: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('year_month', yearMonth)
    .eq('category', category)
  if (error) throw error
}

export async function getAllYearMonths(): Promise<string[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('entries')
    .select('year_month')
  if (error) throw error
  const unique = [...new Set((data ?? []).map((r: { year_month: string }) => r.year_month))]
  return unique.sort((a, b) => b.localeCompare(a))
}

export async function uploadImage(file: File, path: string): Promise<string> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.storage
    .from('entry-images')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('entry-images').getPublicUrl(path)
  return data.publicUrl
}
