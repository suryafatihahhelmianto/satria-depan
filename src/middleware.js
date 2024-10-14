// // middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Dapatkan cookies dari request
  const token = req.cookies.get("token");

  // TODO buat ngecek udah login apa blm di halaman login

  const isLoginPage = req.nextUrl.pathname === "/login";

  console.log("isLoginPage: ", isLoginPage);

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Jika tidak ada token dan pengguna mencoba mengakses rute selain login, arahkan ke halaman login
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
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
