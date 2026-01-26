import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  deleteSession,
  getSession,
  isValidSession,
} from "./services/auth/session";
import { IAuthData } from "./services/auth/types";
import { DEFAULT_PUBLIC_PAGES } from "./constants";
import { EAppQueryParamsKey, EAppRoutes } from "./enums";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create response early so we can pass it to getSession
  const response = NextResponse.next();

  // Get session with both request and response
  const session: IAuthData | null = await getSession({
    req: request,
    res: response,
  });

  // Redirect root to login - for now since no landing page
  if (pathname === "/") {
    return NextResponse.redirect(new URL(EAppRoutes.LOGIN, request.url));
  }

  const cleanPath = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
  // console.log({ session, cleanPath, pathname });
  const isPublicRoute = DEFAULT_PUBLIC_PAGES.includes(cleanPath as EAppRoutes);
  // If public route, allow access
  if (isPublicRoute) {
    return response;
  }

  // Check authentication for protected routes
  if (!session || !isValidSession(session) || !session.token) {
    const url = request.nextUrl.clone();
    url.pathname = EAppRoutes.LOGIN;
    url.searchParams.set(EAppQueryParamsKey.REDIRECT_URL, pathname);
    return NextResponse.redirect(url);
  }

  // Check if session is expired
  if (session.expires && Date.now() > session.expires) {
    const url = request.nextUrl.clone();
    deleteSession({ req: request, res: response });
    url.pathname = EAppRoutes.LOGIN;
    url.searchParams.set(EAppQueryParamsKey.REDIRECT_URL, pathname);
    return NextResponse.redirect(url);
  }

  // Add custom header for your API client
  response.headers.set("x-url", pathname);

  return response;
}

export const config = {
  matcher: ["/((?!api|webhook|_next|.*\\..*).*)"],
};
