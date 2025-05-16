import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export async function middleware(request: NextRequest) {
  // Get environment
  const isProduction = process.env.NODE_ENV === 'production';
  console.log('🌍 Environment:', process.env.NODE_ENV);

  // Paths that don't require authentication
  const publicPaths = [
    '/auth/signin',
    '/auth/signup',
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/health'
  ];
  
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = request.cookies.get('token')?.value;
  console.log('🍪 Token check:', {
    path: request.nextUrl.pathname,
    hasToken: !!token,
    cookieHeader: request.headers.get('cookie')
  });

  if (!token) {
    console.log('❌ No token found');
    // For API routes, return 401 instead of redirecting
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { message: 'Authentication required', code: 'NO_TOKEN' },
        { status: 401 }
      );
    }
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    return response;
  }

  try {
    // Create secret key for jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    
    // Verify token
    const { payload } = await jose.jwtVerify(token, secret);
    const decodedPayload = payload as unknown as JwtPayload;
    
    console.log('🔓 Token verified:', {
      userId: decodedPayload.userId,
      email: decodedPayload.email,
      exp: new Date(decodedPayload.exp! * 1000).toISOString()
    });

    // Check if token is about to expire (within 1 hour)
    const expiresIn = (decodedPayload.exp! * 1000) - Date.now();
    if (expiresIn < 3600000) { // less than 1 hour
      console.log('⚠️ Token expiring soon, refreshing...');
      // Create a new token
      const newToken = await new jose.SignJWT({
        userId: decodedPayload.userId,
        email: decodedPayload.email
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      // Clone the response to add the new token
      const response = NextResponse.next();
      response.cookies.set('token', newToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 86400,
        domain: isProduction ? '.vercel.app' : undefined
      });
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    // Token is invalid
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { message: 'Invalid authentication token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    // Delete the token cookie
    const cookieOptions = {
      name: 'token',
      value: '',
      path: '/',
      domain: isProduction ? '.vercel.app' : undefined,
      maxAge: 0
    };
    response.cookies.set(cookieOptions);
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
