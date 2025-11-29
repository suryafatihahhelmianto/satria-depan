"use client";

import OpsiDetailEksekutif from "@/components/OpsiDetailEksekutif";
import { fetchData } from "@/tools/api";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import { getCookie } from "@/tools/getCookie";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaIndustry,
  FaLeaf,
  FaUsers,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

export default function HasilPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail-eksekutif\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [dataHasil, setDataHasil] = useState([]);
  const [sortOrder, setSortOrder] = useState(null); // "asc" | "desc" | null

  const getKategori = (nilai) => {
    if (nilai >= 0 && nilai <= 25) return "Tidak Berkelanjutan";
    if (nilai > 25 && nilai <= 50) return "Kurang Berkelanjutan";
    if (nilai > 50 && nilai <= 75) return "Cukup Berkelanjutan";
    if (nilai > 75 && nilai <= 100) return "Berkelanjutan";
    return "Tidak Diketahui";
  };

  const handleSort = () => {
    let newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setDataHasil((prev) => {
      // pisahkan total dulu
      const nonTotal = prev.filter(
        (item) => item.dimensi !== "Total Nilai Kinerja"
      );
      const total = prev.find((item) => item.dimensi === "Total Nilai Kinerja");

      // urutkan hanya non-total
      const sorted = [...nonTotal].sort((a, b) =>
        newOrder === "asc" ? a.nilai - b.nilai : b.nilai - a.nilai
      );

      // gabungkan lagi total ke bawah
      return [...sorted, total];
    });
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

        const dataTable = [
          {
            dimensi: "Sumberdaya (D)",
            nilai: parseFloat(response.nilaiDimenSDAM?.toFixed(2)),
            kategori: getKategori(response.nilaiDimenSDAM),
            icon: <FaIndustry className="text-gray-600 text-lg" />,
          },
          {
            dimensi: "Ekonomi (E)",
            nilai: parseFloat(response.nilaiDimenEkono?.toFixed(2)),
            kategori: getKategori(response.nilaiDimenEkono),
            icon: <FaChartLine className="text-gray-600 text-lg" />,
          },
          {
            dimensi: "Lingkungan (L)",
            nilai: parseFloat(response.nilaiDimenLingku?.toFixed(2)),
            kategori: getKategori(response.nilaiDimenLingku),
            icon: <FaLeaf className="text-gray-600 text-lg" />,
          },
          {
            dimensi: "Sosial (S)",
            nilai: parseFloat(response.nilaiDimenSosial?.toFixed(2)),
            kategori: getKategori(response.nilaiDimenSosial),
            icon: <FaUsers className="text-gray-600 text-lg" />,
          },
          {
            dimensi: "Total Nilai Kinerja",
            nilai: parseFloat(response.nilaiKinerja?.toFixed(2)),
            kategori: getKategori(response.nilaiKinerja),
            icon: null,
          },
        ];

        setDataHasil(dataTable);
      } catch (error) {
        console.error("Error fetching dimensi hasil data:", error);
      }
    };

    fetchHasilKinerja();
  }, [sesiId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <OpsiDetailEksekutif />
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-x-auto border border-white/40 shadow-xl rounded-2xl bg-white/60 backdrop-blur-lg">
            <table className="min-w-[720px] w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 to-green-400 text-white">
                  <th className="px-6 py-3 text-left font-semibold text-lg border-b border-green-700">
                    Dimensi
                  </th>

                  {/* Kolom Nilai dengan fitur sort */}
                  <th
                    className="px-6 py-3 text-center font-semibold text-lg border-b border-green-700 cursor-pointer select-none hover:bg-green-700 transition"
                    onClick={handleSort}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Nilai (%)</span>
                      {sortOrder === "asc" ? (
                        <FaSortUp className="text-white" />
                      ) : sortOrder === "desc" ? (
                        <FaSortDown className="text-white" />
                      ) : (
                        <FaSort className="text-white" />
                      )}
                    </div>
                  </th>

                  <th className="px-6 py-3 text-center font-semibold text-lg border-b border-green-700">
                    Kategori
                  </th>
                </tr>
              </thead>

              <tbody>
                {dataHasil.map((row, index) => {
                  const isTotal = row.dimensi === "Total Nilai Kinerja";
                  return (
                    <tr
                      key={index}
                      className={`transition-all duration-300 ${
                        isTotal
                          ? "bg-gradient-to-r from-green-700 to-green-500 text-white font-bold rounded-b-lg"
                          : index % 2 === 0
                          ? "bg-gray-50 hover:bg-green-50"
                          : "bg-white hover:bg-green-50"
                      }`}
                    >
                      <td
                        className={`px-6 py-4 ${
                          isTotal
                            ? "rounded-bl-lg text-white"
                            : "border-b border-gray-200 text-gray-800"
                        } flex items-center gap-3`}
                      >
                        {row.icon}
                        <span>{row.dimensi}</span>
                      </td>

                      <td
                        className={`px-6 py-4 text-center font-semibold ${
                          isTotal
                            ? "text-white"
                            : row.kategori === "Berkelanjutan"
                            ? "text-green-600"
                            : row.kategori === "Cukup Berkelanjutan"
                            ? "text-green-500"
                            : row.kategori === "Kurang Berkelanjutan"
                            ? "text-orange-600"
                            : "text-red-600"
                        } ${!isTotal ? "border-b border-gray-200" : ""}`}
                      >
                        {formatNumberToIndonesian(row.nilai)}
                      </td>

                      <td
                        className={`px-6 py-4 text-center font-medium ${
                          isTotal
                            ? "text-white rounded-br-lg"
                            : row.kategori === "Berkelanjutan"
                            ? "text-green-600"
                            : row.kategori === "Cukup Berkelanjutan"
                            ? "text-green-500"
                            : row.kategori === "Kurang Berkelanjutan"
                            ? "text-orange-600"
                            : "text-red-600"
                        } ${!isTotal ? "border-b border-gray-200" : ""}`}
                      >
                        {row.kategori}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
