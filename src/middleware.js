// // middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Dapatkan cookies dari request
  const token = req.cookies.get("token");

  const currentPath = req.nextUrl.pathname;

  // Tentukan apakah pengguna sedang berada di halaman login atau landing
  const isLoginPage = currentPath === "/login";
  const isLandingPage = currentPath === "/landing";

  console.log("currentPath: ", currentPath);
  console.log("isLoginPage: ", isLoginPage);
  console.log("isLandingPage: ", isLandingPage);

  if (token && (isLoginPage || isLandingPage)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Jika tidak ada token dan pengguna mencoba mengakses rute selain login, arahkan ke halaman login
  if (
    !token &&
    req.nextUrl.pathname !== "/login" &&
    currentPath !== "/landing"
  ) {
    return NextResponse.redirect(new URL("/landing", req.url));
  }

  // Jika sudah login, izinkan akses ke halaman lain
  return NextResponse.next();
}

// Konfigurasi rute mana saja yang akan dilindungi middleware
export const config = {
  matcher: [
    "/((?!api|login|_next/static|_next/image).*)", // Melindungi semua rute kecuali API, halaman login, dan aset statis
  ],
};
