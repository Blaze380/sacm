import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const COOKIE_NAME = 'sacm_admin_token'

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string }
  if (!body.token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, body.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  return NextResponse.json({ ok: true })
}
