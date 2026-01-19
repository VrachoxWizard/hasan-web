import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js 16 renamed middleware to proxy. Keep the same i18n behavior,
 * just expose it under the new file convention.
 */
const intlMiddleware = createMiddleware(routing);

// Force Croatian as the default when no locale is in the URL.
// Without this, next-intl may redirect based on the browser's Accept-Language
// (e.g. many browsers default to English -> /en).
const intlMiddlewareNoDetect = createMiddleware({
  ...routing,
  localeDetection: false,
});

export function proxy(request: NextRequest) {
  return intlMiddlewareNoDetect(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - cms (custom CMS is mounted at /cms and should not be locale-prefixed)
  // - Static files (images, fonts, etc.)
  matcher: ["/((?!api|_next|cms|.*\\..*).*)"],
};
