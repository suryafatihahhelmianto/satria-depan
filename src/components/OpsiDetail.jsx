"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function OpsiDetail() {
  const pathname = usePathname();
  //   const idMatch = pathname.match(/\/detail\/([a-zA-Z0-9]+)/); // Menangkap ID yang ada setelah /detail/
  //   const id = idMatch ? idMatch[1] : null; // Ambil ID jika ada

  const id = "";

  // Memperbarui fungsi getButtonStyle untuk memeriksa apakah pathname mengandung path yang relevan
  const getButtonStyle = (path) => {
    return pathname.startsWith(path)
      ? "bg-abuAktif text-black font-bold"
      : "bg-abuNonAktif";
  };

  return (
    <div className="grid grid-cols-5 gap-10 text-center">
      <Link
        href={`/detail/${id ? id : ""}/sumber-daya`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/sumber-daya`
        )} p-2 rounded-lg`}
      >
        Sumber Daya
      </Link>
      <Link
        href={`/detail/${id ? id : ""}/ekonomi`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/ekonomi`
        )} p-2 rounded-lg`}
      >
        Ekonomi
      </Link>
      <Link
        href={`/detail/${id ? id : ""}/lingkungan`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/lingkungan`
        )} p-2 rounded-lg`}
      >
        Lingkungan
      </Link>
      <Link
        href={`/detail/${id ? id : ""}/sosial`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/sosial`
        )} p-2 rounded-lg`}
      >
        Sosial
      </Link>
      <Link
        href={`/detail/${id ? id : ""}/hasil`} // Menambahkan ID ke URL jika ada
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/hasil`
        )} p-2 rounded-lg`}
      >
        Agregat
      </Link>
    </div>
  );
}
