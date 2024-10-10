"use client";

import React from "react";
import Link from "next/link"; // Import Link untuk navigasi
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed bg-ijoDash text-black w-64 h-screen p-5 flex flex-col gap-5">
      <Link href="/" className="text-2xl font-bold mb-6 text-center">
        Dashboard
      </Link>
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/" className="hover:text-white">
              Home Page
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/kinerja" className="hover:text-white">
              Kinerja Rantai Pasok
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="hover:text-white">
              Pengukuran Rendemen
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="hover:text-white">
              Data Pengguna
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
