import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const yearMonth = formData.get('yearMonth') as string
    const category = formData.get('category') as string

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: 'Invalid file type' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceKey)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${yearMonth}/${category}/${uuidv4()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from('entry-images')
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('entry-images').getPublicUrl(path)
    return Response.json({ url: data.publicUrl })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
