-- 애플리케이션 스키마 생성
CREATE SCHEMA IF NOT EXISTS app_monthly_archive;

-- entries 테이블
CREATE TABLE app_monthly_archive.entries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_month    char(7) NOT NULL,
  category      text NOT NULL CHECK (category IN (
                  'photo','song','goal','quote','restaurant',
                  'place','purchase','movie','discovery','gratitude'
                )),
  text_content  text,
  image_urls    text[] DEFAULT '{}',
  link_url      text,
  link_preview  jsonb,
  memo          text CHECK (char_length(memo) <= 500),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE (year_month, category)
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION app_monthly_archive.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER entries_updated_at
  BEFORE UPDATE ON app_monthly_archive.entries
  FOR EACH ROW EXECUTE FUNCTION app_monthly_archive.update_updated_at();

-- RLS 활성화 (서버 사이드 Service Role Key로만 접근)
ALTER TABLE app_monthly_archive.entries ENABLE ROW LEVEL SECURITY;

-- 퍼블릭 접근 차단
CREATE POLICY "deny_all" ON app_monthly_archive.entries FOR ALL TO public USING (false);

-- Storage 버킷 생성 (storage는 Supabase 내장 스키마, 변경 없음)
INSERT INTO storage.buckets (id, name, public)
VALUES ('entry-images', 'entry-images', true)
ON CONFLICT DO NOTHING;

-- Storage 퍼블릭 읽기 허용
CREATE POLICY "public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'entry-images');
