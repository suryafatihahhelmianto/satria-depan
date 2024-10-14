"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function OpsiDimensi() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/); // Menangkap ID yang ada setelah /kinerja/
  const id = idMatch ? idMatch[1] : null; // Ambil ID jika ada

  // Memperbarui fungsi getButtonStyle untuk memeriksa apakah pathname mengandung path yang relevan
  const getButtonStyle = (path) => {
    return pathname.startsWith(path)
      ? "bg-abuAktif text-black font-bold"
      : "bg-abuNonAktif";
  };

  return (
    <div className="grid grid-cols-5 gap-10 text-center">
      <Link
        href={`/kinerja/${id ? id : ""}/sumber-daya`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/kinerja/${id ? id : ""}/sumber-daya`
        )} p-2 rounded-lg`}
      >
        Sumber Daya
      </Link>
      <Link
        href={`/kinerja/${id ? id : ""}/ekonomi1`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/kinerja/${id ? id : ""}/ekonomi1`
        )} bg-gray-300 *:p-2 rounded-lg`}
      >
        Ekonomi
      </Link>
      <Link
        href={`/kinerja/${id ? id : ""}/lingkungan`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/kinerja/${id ? id : ""}/lingkungan`
        )} p-2 rounded-lg`}
      >
        Lingkungan
      </Link>
      <Link
        href={`/kinerja/${id ? id : ""}/sosial`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/kinerja/${id ? id : ""}/sosial`
        )} p-2 rounded-lg`}
      >
        Sosial
      </Link>
      <Link
        href={`/kinerja/${id ? id : ""}/hasil`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/kinerja/${id ? id : ""}/hasil`
        )} p-2 rounded-lg`}
      >
        Hasil
      </Link>
    </div>
  );
}
