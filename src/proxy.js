import { NextResponse } from 'next/server';

export function proxy(request) {
  // Check for the presence of the Better Auth session token cookie
  const sessionToken = 
    request.cookies.get("better-auth.session_token") || 
    request.cookies.get("__Secure-better-auth.session_token");

  // If no session token cookie is found, redirect to the sign-in page
  if (!sessionToken) {
    const signInUrl = new URL("/auth/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only match dashboard paths (both the root /dashboard and nested routes)
  matcher: ["/dashboard/:path*", "/dashboard","/properties"],
};
