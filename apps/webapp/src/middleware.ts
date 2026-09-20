import { NextResponse } from 'next/server'

/** Pass-through: next-intl path rewrite 404s when pages are not under `[locale]`. */
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
