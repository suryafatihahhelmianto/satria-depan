"use client";

import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

export default function OpsiDimensi() {
  const [periode, setPeriode] = useState(0);
  const [namaPabrik, setNamaPabrik] = useState("");

  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/); // Capture ID after /kinerja/
  const id = idMatch ? idMatch[1] : null; // Extract ID if present

  // Function to determine the active button style
  const getButtonStyle = (path) => {
    return pathname.startsWith(path)
      ? "bg-green-800 text-white font-semibold shadow-md transform transition-transform scale-105"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-green-800 font-medium shadow-sm";
  };

  // ✅ Wrap fetchHeaderData with useCallback to stabilize reference
  const fetchHeaderData = useCallback(async () => {
    if (!id) return; // avoid fetching when id is not ready

    try {
      const response = await fetchData(`/api/sesi/header/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
      });

      setPeriode(new Date(response.data.tanggalMulai).getFullYear());
      setNamaPabrik(response.data.pabrikGula.namaPabrik);
    } catch (error) {
      console.error("Error fetching header data:", error);
    }
  }, [id]); // ✅ depend on id only

  useEffect(() => {
    fetchHeaderData();
  }, [fetchHeaderData]); // ✅ clean dependency

  return (
    <div>
      <div className="flex justify-center mb-8">
        <h1 className="font-bold text-4xl">
          Pengisian Data PG <span className="text-green-700">{namaPabrik}</span>{" "}
          - Periode <span className="text-green-700">{periode}</span>
        </h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
        <Link
          href={`/kinerja/${id || ""}/sumber-daya`}
          className={`${getButtonStyle(
            `/kinerja/${id || ""}/sumber-daya`
          )} p-3 rounded-lg transition-all duration-200`}
        >
          Sumber Daya
        </Link>
        <Link
          href={`/kinerja/${id || ""}/ekonomi`}
          className={`${getButtonStyle(
            `/kinerja/${id || ""}/ekonomi`
          )} p-3 rounded-lg transition-all duration-200`}
        >
          Ekonomi
        </Link>
        <Link
          href={`/kinerja/${id || ""}/lingkungan`}
          className={`${getButtonStyle(
            `/kinerja/${id || ""}/lingkungan`
          )} p-3 rounded-lg transition-all duration-200`}
        >
          Lingkungan
        </Link>
        <Link
          href={`/kinerja/${id || ""}/sosial`}
          className={`${getButtonStyle(
            `/kinerja/${id || ""}/sosial`
          )} p-3 rounded-lg transition-all duration-200`}
        >
          Sosial
        </Link>
      </div>
    </div>
  );
}
