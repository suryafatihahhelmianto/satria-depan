"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function OpsiDetail() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail\/([a-zA-Z0-9]+)/); // Capture ID after /detail/
  const id = idMatch ? idMatch[1] : null; // Extract ID if present

  // Function to determine the active button style
  const getButtonStyle = (path) => {
    return pathname.startsWith(path)
      ? "bg-green-800 text-white font-semibold shadow-md transform transition-transform scale-105"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-green-800 font-medium shadow-sm";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 md:gap-8 text-center">
      <Link
        href={`/detail/${id ? id : ""}/sumber-daya`} // Add ID to URL if present
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/sumber-daya`
        )} p-3 rounded-lg transition-all duration-200`}
      >
        Sumber Daya
      </Link>
      <Link
        href={`/detail/${id ? id : ""}/ekonomi`} // Add ID to URL if present
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/ekonomi`
        )} p-3 rounded-lg transition-all duration-200`}
      >
        Ekonomi
      </Link>
      <Link
        href={`/detail/${id ? id : ""}/lingkungan`} // Add ID to URL if present
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/lingkungan`
        )} p-3 rounded-lg transition-all duration-200`}
      >
        Lingkungan
      </Link>
      <Link
        href={`/detail/${id ? id : ""}/sosial`} // Add ID to URL if present
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/sosial`
        )} p-3 rounded-lg transition-all duration-200`}
      >
        Sosial
      </Link>
      <Link
        href={`/detail/${id ? id : ""}/hasil`} // Add ID to URL if present
        className={`${getButtonStyle(
          `/detail/${id ? id : ""}/hasil`
        )} p-3 rounded-lg transition-all duration-200`}
      >
        Agregat
      </Link>
    </div>
  );
}
