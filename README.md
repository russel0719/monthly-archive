# 이달의 기록 (Monthly Archive)

매달 10가지 고정 카테고리로 사진, 텍스트, 링크, 영상 등을 기록하고 누적하는 개인 아카이브 웹앱.  
노션 다이어리 스타일의 깔끔한 UI로 모바일에서 편하게 기록하고 돌아볼 수 있다.

---

## 주요 기능

- **월별 카테고리 기록**: 10가지 고정 카테고리를 매달 채우는 방식
- **미디어 지원**: 카테고리별로 텍스트 / 이미지(최대 3장) / 링크 입력 가능
- **링크 OG 프리뷰**: URL 입력 시 제목·이미지·파비콘 자동 미리보기
- **아카이브 뷰**: 지난 달 기록을 목록으로 탐색하고 읽기 전용으로 열람
- **다크 모드**: 시스템 설정 자동 감지
- **PWA**: 홈 화면 앱 설치, 앱 아이콘, 스플래시 지원
- **Google 로그인**: Supabase Auth + Google OAuth

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16.2.4 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 백엔드/DB | Supabase (PostgreSQL) |
| 파일 스토리지 | Supabase Storage (`entry-images` 버킷) |
| 인증 | Supabase Auth + Google OAuth |
| 배포 | Vercel |

---

## 카테고리 목록

| # | 카테고리 | 지원 미디어 |
|---|---|---|
| 1 | 📷 사진 | 이미지 |
| 2 | 🎵 노래 | 링크, 텍스트 |
| 3 | 🎯 목표 | 텍스트 |
| 4 | ✍️ 문장 | 텍스트 |
| 5 | 🍽️ 맛집 | 텍스트, 이미지, 링크 |
| 6 | 📍 장소 | 텍스트, 이미지 |
| 7 | 🛍️ 소비 | 텍스트, 이미지, 링크 |
| 8 | 🎬 영화/드라마 | 텍스트, 이미지, 링크 |
| 9 | 🔍 발견 | 텍스트, 링크 |
| 10 | 🙏 감사한 것 | 텍스트 |

모든 카테고리에 공통 메모 필드 제공 (최대 500자).

---

## 화면 구성

```
/                         → 이번 달 카드 그리드 (자동 리다이렉트)
/[YYYY-MM]                → 특정 달 카드 그리드 (이번 달 / 지난 달 편집 가능, 2달 이상은 읽기 전용)
/[YYYY-MM]/[category]     → 카테고리 상세 편집 화면
/archive                  → 전체 아카이브 목록 (최신순)
/login                    → Google 로그인
```

하단 네비게이션: **지난 달** / **이번 달** / **아카이브**

---

## 프로젝트 구조

```
src/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx              # BottomNav 포함 앱 레이아웃
│   │   ├── [yearMonth]/
│   │   │   ├── page.tsx            # 월별 카드 그리드
│   │   │   └── [category]/
│   │   │       └── page.tsx        # 카테고리 편집 화면
│   │   └── archive/
│   │       └── page.tsx            # 아카이브 목록
│   ├── api/
│   │   ├── entries/route.ts        # GET / POST / DELETE
│   │   ├── upload/route.ts         # 이미지 업로드
│   │   └── og-preview/route.ts     # OG 메타 크롤링
│   ├── auth/callback/route.ts      # OAuth 콜백
│   ├── login/page.tsx              # 로그인 페이지
│   └── page.tsx                    # 루트 → 이번 달로 리다이렉트
├── components/
│   ├── BottomNav.tsx               # 하단 네비게이션
│   ├── EntryEditor.tsx             # 카테고리 편집 폼
│   └── ServiceWorkerRegistrar.tsx  # PWA SW 등록
└── lib/
    ├── categories.ts               # 카테고리 정의 및 타입
    ├── supabase.ts                 # Supabase 클라이언트 + DB 함수
    └── utils.ts                    # 날짜 포맷 유틸

supabase/
└── schema.sql                      # DB 스키마 (멱등성 보장)

public/
├── manifest.json                   # PWA 매니페스트
├── sw.js                           # Service Worker
└── icons/                          # PWA 아이콘 (180, 192, 512px)
```

---

## 데이터 모델

Supabase 스키마: `app_monthly_archive`

### `entries` 테이블

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK, 자동 생성 |
| `year_month` | char(7) | 예: `'2026-04'` |
| `category` | text | 카테고리 키 (enum 제약) |
| `text_content` | text | 텍스트 내용 |
| `image_urls` | text[] | Supabase Storage URL 배열 (최대 3장) |
| `link_url` | text | 외부 링크 URL |
| `link_preview` | jsonb | `{ title, description, image, favicon }` |
| `memo` | text | 공통 메모 (최대 500자) |
| `created_at` | timestamptz | 생성 시각 |
| `updated_at` | timestamptz | 수정 시각 (트리거 자동 갱신) |

`UNIQUE (year_month, category)` — 달별 카테고리 1개 (upsert 방식)

### RLS 정책

- 모든 public 접근 차단 (`deny_all`)
- API 라우트는 `SUPABASE_SERVICE_ROLE_KEY`로 서버사이드에서만 접근

---

## 환경 변수

`.env.local` 파일 생성 후 아래 값을 설정:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 로컬 개발

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

`http://localhost:3000` 접속 후 Google 로그인.

### Supabase 설정

1. Supabase 대시보드 → SQL 에디터에서 `supabase/schema.sql` 실행
2. Authentication → Providers → Google OAuth 활성화 및 Redirect URL 등록
3. API Settings → Exposed schemas에 `app_monthly_archive` 추가
4. Storage에 `entry-images` 퍼블릭 버킷 생성 (schema.sql에 포함)

---

## 배포 (Vercel)

1. GitHub에 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 3개 설정
4. `main` 브랜치 → 자동 프로덕션 배포

---

## 접근 제어

- **Google OAuth**: 인증된 사용자만 접근 가능
- **미들웨어**: 비로그인 상태에서 `/login`으로 자동 리다이렉트
- **편집 제한**: 현재 달 및 지난 달만 편집 가능, 2달 이상 이전은 읽기 전용

---

## 보안

- Supabase 키는 서버사이드 API 라우트에서만 사용 (`SUPABASE_SERVICE_ROLE_KEY`)
- 이미지 업로드: jpg, png, webp, heic만 허용, 최대 10MB
- RLS로 직접 DB 접근 차단

---

## 비기능 요구사항

- **반응형**: 모바일(~480px) 우선, 최대 너비 640px
- **다크 모드**: `prefers-color-scheme` 자동 감지, Tailwind `dark:` 클래스
- **PWA**: 홈 화면 설치, 오프라인 캐시
- **이미지 최적화**: Supabase CDN URL 직접 사용
