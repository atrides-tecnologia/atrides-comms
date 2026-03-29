import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'

export async function POST(request: NextRequest) {
  const { supabase } = createSupabaseMiddlewareClient(request)
  await supabase.auth.signOut()

  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl, { status: 302 })
}
