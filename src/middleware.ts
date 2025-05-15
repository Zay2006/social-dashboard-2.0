import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  // Paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/signup', '/api/auth/signin', '/api/auth/signup'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = request.cookies.get('token')?.value;
  console.log('🍪 Token check:', { path: request.nextUrl.pathname, hasToken: !!token });

  if (!token) {
    // For API routes, return 401 instead of redirecting
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  try {
    // Create secret key for jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    
    // Verify token
    const { payload } = await jose.jwtVerify(token, secret);
    console.log('🔓 Token verified:', { payload });
    return NextResponse.next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    // Token is invalid
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.delete('token');
    return response;
  }
}

// Add paths that should be protected by authentication
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ]
};
