import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('cyber_leek_session')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');
  
  if (!session && !isLoginPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
