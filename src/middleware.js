// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Dapatkan cookies dari request
  const token = req.cookies.get("token");

  const currentPath = req.nextUrl.pathname;

  // Tentukan apakah pengguna sedang berada di halaman login, landing, atau sertifikat
  const isLoginPage = currentPath === "/login";
  const isLandingPage = currentPath === "/landing";
  const isSertifikatPage = currentPath === "/sertifikat";

  console.log("currentPath: ", currentPath);
  console.log("isLoginPage: ", isLoginPage);
  console.log("isLandingPage: ", isLandingPage);
  console.log("isSertifikatPage: ", isSertifikatPage);

  // Jika sudah login dan mencoba akses login/landing, redirect ke home
  if (token && (isLoginPage || isLandingPage)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Jika tidak ada token dan mencoba akses rute yang dilindungi
  if (!token && !isLoginPage && !isLandingPage && !isSertifikatPage) {
    return NextResponse.redirect(new URL("/landing", req.url));
  }

  // Jika sudah login, izinkan akses ke halaman lain
  return NextResponse.next();
}

// Konfigurasi rute mana saja yang akan dilindungi middleware
export const config = {
  matcher: [
    "/((?!api|login|iso|img|_next/static|_next/image).*)", // Melindungi semua rute kecuali API, halaman login, dan aset statis
  ],
};
