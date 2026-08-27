import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Publicly accessible paths without auth redirect
  const publicPaths = ['/landing', '/login', '/register', '/api', '/favicon.ico', '/favicon.png', '/images'];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If user lands on root or dashboard paths, we allow navigation (AuthContext handles client-side rehydration)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
