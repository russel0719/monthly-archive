'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase'

export default function LoginPage() {
  async function handleGoogleLogin() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-[375px] text-center">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">이달의 기록</h1>
        <p className="text-sm text-text-secondary mb-8">
          매달 10가지 카테고리로 남기는 나만의 아카이브
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full h-[44px] rounded-full bg-accent text-text-primary text-sm font-semibold
                     transition-all duration-150 active:opacity-80 active:scale-[0.98]"
        >
          Google로 계속하기
        </button>
      </div>
    </div>
  )
}
