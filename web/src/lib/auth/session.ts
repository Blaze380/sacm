const ACCESS_TOKEN_KEY = 'sacm_access_token'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export async function clearAccessToken(): Promise<void> {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  try {
    await fetch('/api/auth/session', { method: 'DELETE' })
  } catch {
    // ignore
  }
}

export async function persistSessionCookie(token: string): Promise<void> {
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
}
