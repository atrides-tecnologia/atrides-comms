import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next') ?? '/chat'
  // Prevent open redirect — only allow relative paths on same origin
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/chat'

  if (code) {
    const { supabase, response } = createSupabaseMiddlewareClient(request)
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const redirectUrl = new URL(next, request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl)
}
