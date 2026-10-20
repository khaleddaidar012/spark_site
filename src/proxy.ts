import { NextRequest, NextResponse } from "next/server";

const locales = ["ar", "en"];
const defaultLocale = "ar";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let response: NextResponse;
  if (!hasLocale) {
    const url = new URL(`/${defaultLocale}${pathname === "/" ? "" : pathname}`, request.url);
    url.search = request.nextUrl.search;
    response = NextResponse.redirect(url);
  } else {
    response = NextResponse.next();
  }

  if (!request.cookies.has("spark_visitor")) {
    response.cookies.set("spark_visitor", crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\..*).*)"],
};
