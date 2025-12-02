import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("auth_token"); // cookie que indica login

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  // Bloqueia tudo exceto /login se o usuário não estiver logado
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Impede usuário logado de voltar ao /login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|fonts|assets|static|.*\\..*).*)"],
};
