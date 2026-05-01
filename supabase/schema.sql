-- 애플리케이션 스키마 생성
CREATE SCHEMA IF NOT EXISTS app_monthly_archive;

-- 스키마 권한 부여 (Supabase 커스텀 스키마 필수)
GRANT USAGE ON SCHEMA app_monthly_archive TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA app_monthly_archive TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA app_monthly_archive TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA app_monthly_archive TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA app_monthly_archive
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA app_monthly_archive
  GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA app_monthly_archive
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- entries 테이블
CREATE TABLE IF NOT EXISTS app_monthly_archive.entries (
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

DROP TRIGGER IF EXISTS entries_updated_at ON app_monthly_archive.entries;
CREATE TRIGGER entries_updated_at
  BEFORE UPDATE ON app_monthly_archive.entries
  FOR EACH ROW EXECUTE FUNCTION app_monthly_archive.update_updated_at();

-- RLS 활성화
ALTER TABLE app_monthly_archive.entries ENABLE ROW LEVEL SECURITY;

-- 퍼블릭 접근 차단
DROP POLICY IF EXISTS "deny_all" ON app_monthly_archive.entries;
CREATE POLICY "deny_all" ON app_monthly_archive.entries FOR ALL TO public USING (false);

-- Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('entry-images', 'entry-images', true)
ON CONFLICT DO NOTHING;

-- Storage 퍼블릭 읽기 허용
DROP POLICY IF EXISTS "public_read" ON storage.objects;
CREATE POLICY "public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'entry-images');
