"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function OpsiDimensi() {
  const pathname = usePathname();

  const getButtonStyle = (path) => {
    return pathname === path ? "bg-gray-400 text-black" : "bg-gray-300";
  };
  return (
    <div className="grid grid-cols-5 gap-10 text-center">
      <Link
        href="/kinerja/sumber-daya"
        className={`${getButtonStyle("/kinerja/sumber-daya")} p-2 rounded-lg`}
      >
        Sumber Daya
      </Link>
      <Link
        href="/kinerja/ekonomi"
        className={`${getButtonStyle("/kinerja/ekonomi")} p-2 rounded-lg`}
      >
        Ekonomi
      </Link>
      <Link
        href="/kinerja/lingkungan"
        className={`${getButtonStyle("/kinerja/lingkungan")} p-2 rounded-lg`}
      >
        Lingkungan
      </Link>
      <Link
        href="/kinerja/sosial"
        className={`${getButtonStyle("/kinerja/sosial")} p-2 rounded-lg`}
      >
        Sosial
      </Link>
      <Link
        href="/kinerja/hasil"
        className={`${getButtonStyle("/kinerja/hasil")} p-2 rounded-lg`}
      >
        Hasil
      </Link>
    </div>
  );
}
