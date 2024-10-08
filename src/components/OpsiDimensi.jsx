import Link from "next/link";
import React from "react";

export default function OpsiDimensi() {
  return (
    <div className="grid grid-cols-5 gap-4">
      <Link href="/kinerja/sumber-daya" className="bg-gray-300 p-2 rounded">
        Sumber Daya
      </Link>
      <Link
        href="/kinerja/ekonomi"
        className="bg-green-700 p-2 rounded text-white"
      >
        Ekonomi
      </Link>
      <Link href="/kinerja/lingkungan" className="bg-gray-300 p-2 rounded">
        Lingkungan
      </Link>
      <Link href="/kinerja/sosial" className="bg-gray-300 p-2 rounded">
        Sosial
      </Link>
      <Link href="/kinerja/hasil" className="bg-gray-300 p-2 rounded">
        Hasil
      </Link>
    </div>
  );
}
