"use client";

import OpsiDetail from "@/components/OpsiDetail";
import SpiderGraph from "@/components/SpiderGraph";
import { fetchData } from "@/tools/api";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import { getCookie } from "@/tools/getCookie";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function HasilPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [dataHasil, setDataHasil] = useState([]);
  const [dataSpiderHasil, setDataSpiderHasil] = useState([]);

  const getKategori = (nilai) => {
    if (nilai >= 0 && nilai <= 25) return "Tidak Berkelanjutan";
    if (nilai > 25 && nilai <= 50) return "Kurang Berkelanjutan";
    if (nilai > 50 && nilai <= 75) return "Cukup Berkelanjutan";
    if (nilai > 75 && nilai <= 100) return "Berkelanjutan";
    return "Tidak Diketahui";
  };

  useEffect(() => {
    const fetchHasilKinerja = async () => {
      try {
        const response = await fetchData(
          `/api/dimensi/hasil?sesiPengisianId=${sesiId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Prepare data for the table
        const dataTable = [
          {
            dimensi: "Sumberdaya (D)",
            nilai: response.nilaiDimenSDAM?.toFixed(2),
            kategori: getKategori(response.nilaiDimenSDAM),
          },
          {
            dimensi: "Ekonomi (E)",
            nilai: response.nilaiDimenEkono?.toFixed(2),
            kategori: getKategori(response.nilaiDimenEkono),
          },
          {
            dimensi: "Lingkungan (L)",
            nilai: response.nilaiDimenLingku?.toFixed(2),
            kategori: getKategori(response.nilaiDimenLingku),
          },
          {
            dimensi: "Sosial (S)",
            nilai: response.nilaiDimenSosial?.toFixed(2),
            kategori: getKategori(response.nilaiDimenSosial),
          },
          {
            dimensi: "Total Nilai Kinerja",
            nilai: response.nilaiKinerja?.toFixed(2),
            kategori: getKategori(response.nilaiKinerja),
          },
        ];

        // Prepare data for the SpiderGraph (exclude "Total Nilai Kinerja")
        const spiderData = dataTable
          .filter((item) => item.dimensi !== "Total Nilai Kinerja")
          .map((item) => ({
            subject: item.dimensi,
            A: item.nilai,
          }));

        setDataHasil(dataTable);
        setDataSpiderHasil(spiderData);
      } catch (error) {
        console.error("Error fetching dimensi hasil data:", error);
      }
    };

    fetchHasilKinerja();
  }, [sesiId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <OpsiDetail />
      <div className="mb-8">
        <SpiderGraph data={dataSpiderHasil} />
      </div>
      <div className="flex justify-center">
        <table className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-green-600 to-green-400 text-white">
              <th className="px-6 py-3 text-left font-semibold text-lg border-b border-green-700">
                Dimensi
              </th>
              <th className="px-6 py-3 text-center font-semibold text-lg border-b border-green-700">
                Nilai (%)
              </th>
              <th className="px-6 py-3 text-center font-semibold text-lg border-b border-green-700">
                Kategori
              </th>
            </tr>
          </thead>
          <tbody>
            {dataHasil.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-green-50`}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                  {row.dimensi}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-gray-800 font-semibold">
                  {formatNumberToIndonesian(row.nilai)}
                </td>
                <td
                  className={`px-6 py-4 border-b border-gray-200 text-center font-medium ${
                    row.kategori === "Berkelanjutan"
                      ? "text-green-600"
                      : row.kategori === "Cukup Berkelanjutan"
                      ? "text-yellow-600"
                      : row.kategori === "Kurang Berkelanjutan"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {row.kategori}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
