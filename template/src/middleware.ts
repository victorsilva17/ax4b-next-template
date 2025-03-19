import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserRoleEnum } from "@/core/models/user/userRole.enum";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken");
  const { pathname } = request.nextUrl;

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/v1/home", request.url)); //TODO: change this to the initial route.
  }

  // Se não houver token, redireciona para a página de login
  if (!token && pathname.startsWith("/v1")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = request.cookies.get("userSession");

  if (user) {
    const userCoverted = JSON.parse(user.value);
    if (userCoverted) {
      if (
        userCoverted.role !== UserRoleEnum.admin &&
        pathname.includes("/v1/users")
      ) {
        return NextResponse.redirect(new URL("/v1/home", request.url));
      }
    }
  }

  // Permite o acesso se o token estiver presente
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/v1/:path*"],
};
