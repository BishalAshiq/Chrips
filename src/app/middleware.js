import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // Define paths that don't need authentication
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/api/");

  // Define authentication-only paths (Login & Signup)
  const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Define protected paths (Require authentication)
  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/profile");

  // Define guest-accessible paths (Dashboard)
  const isGuestPath = pathname.startsWith("/dashboard");

  try {
    if (token) {
      const decoded = jwtDecode(token);
      const isValidToken = decoded.exp * 1000 > Date.now() && decoded.role === "end_user";

      if (isValidToken) {
        // Redirect authenticated users away from auth pages
        if (isAuthPath) {
          return NextResponse.redirect(new URL("/dashboard/", request.url));
        }
        // Allow authenticated users to access protected and guest paths
        return NextResponse.next();
      } else {
        // Expired or invalid token: Redirect protected users to login
        if (isProtectedPath) {
          return NextResponse.redirect(new URL("/login/", request.url));
        }
      }
    } else {
      // No token present
      if (isProtectedPath) {
        return NextResponse.redirect(new URL("/login/", request.url));
      }
      if (isGuestPath) {
        //  Allow guest users to access the dashboard
        return NextResponse.next();
      }
    }

    // Allow access to public pages
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error.message);
    // Handle decoding errors: Redirect to login only if accessing protected routes
    if (isProtectedPath) {
      return NextResponse.redirect(new URL("/login/", request.url));
    }
    return NextResponse.next();
  }
}

// Configure routes where middleware applies
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api).*)"],
};
