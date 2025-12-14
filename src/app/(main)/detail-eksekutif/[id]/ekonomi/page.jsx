"use client";

import OpsiDetailEksekutif from "@/components/OpsiDetailEksekutif";
import { fetchData } from "@/tools/api";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import { getCookie } from "@/tools/getCookie";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function DetailPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail-eksekutif\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [dataEkonomi, setDataEkonomi] = useState([]);
  const [nilaiDimensiEkonomi, setNilaiDimensiEkonomi] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, order: null });

  // Fungsi kategori warna
  const getKategoriColor = (nilai) => {
    if (nilai >= 0 && nilai <= 25) return "text-red-600";
    if (nilai > 25 && nilai <= 50) return "text-orange-600";
    if (nilai > 50 && nilai <= 75) return "text-green-500";
    if (nilai > 75 && nilai <= 100) return "text-green-600";
    return "text-gray-500";
  };

  // Sorting handler
  const handleSort = (key) => {
    let newOrder = "asc";
    if (sortConfig.key === key && sortConfig.order === "asc") {
      newOrder = "desc";
    }
    setSortConfig({ key, order: newOrder });

    setDataEkonomi((prev) => {
      const sorted = [...prev].sort((a, b) => {
        if (newOrder === "asc") return a[key] - b[key];
        return b[key] - a[key];
      });
      return sorted;
    });
  };

  useEffect(() => {
    const fetchEkonomiData = async () => {
      try {
        const response = await fetchData(
          `/api/dimensi/ekonomi?sesiPengisianId=${sesiId}`,
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
            id: 1,
            indikator: "Tingkat Risiko",
            simbol: "E1",
            nilai: (response.tingkatRisiko * 100).toFixed(1),
            leverage: response.leverageTingkatRisiko,
          },
          {
            id: 2,
            indikator: "Hilangnya Produksi",
            simbol: "E2",
            nilai: (response.hilangProduksi * 100).toFixed(1),
            leverage: response.leverageHilangProduksi,
          },
          {
            id: 3,
            indikator: "Kesenjangan Keuntungan",
            simbol: "E3",
            nilai: (response.kesenjanganKeuntungan * 100).toFixed(1),
            leverage: response.leverageKesenjanganKeuntungan,
          },
          {
            id: 4,
            indikator: "Harga Patokan Petani",
            simbol: "E4",
            nilai: (response.hargaPatokPetan * 100).toFixed(1),
            leverage: response.leverageHargaPatokPetan,
          },
          {
            id: 5,
            indikator: "Tingkat Ketangkasan",
            simbol: "E5",
            nilai: (response.tingkatKetangkasan * 100).toFixed(1),
            leverage: response.leverageTingkatKetangkasan,
          },
          {
            id: 6,
            indikator: "Return on Investment (ROI)",
            simbol: "E6",
            nilai: (response.returnOnInvestment * 100).toFixed(1),
            leverage: response.leverageReturnOnInvestment,
          },
        ];

        setDataEkonomi(dataTable);
        setNilaiDimensiEkonomi(response.nilaiDimenEkono);
      } catch (error) {
        console.error("Error fetching dimensi ekonomi data:", error);
      }
    };

    fetchEkonomiData();
  }, [sesiId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <OpsiDetailEksekutif />
      {/* Tabel responsif (scroll horizontal di layar kecil) */}
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-x-auto border border-white/40 shadow-xl rounded-2xl bg-white/60 backdrop-blur-lg">
            <table className="min-w-[720px] w-full text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-sm sm:text-lg border-b border-green-700">
                    Indikator
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-sm sm:text-lg border-b border-green-700">
                    Simbol
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 text-center font-semibold text-sm sm:text-lg border-b border-green-700 cursor-pointer select-none hover:bg-green-700 transition"
                    onClick={() => handleSort("nilai")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Nilai (%)</span>
                      {sortConfig.key === "nilai" ? (
                        sortConfig.order === "asc" ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 text-center font-semibold text-sm sm:text-lg border-b border-green-700 cursor-pointer select-none hover:bg-green-700 transition"
                    onClick={() => handleSort("leverage")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Prioritas Indikator*</span>
                      {sortConfig.key === "leverage" ? (
                        sortConfig.order === "asc" ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {dataEkonomi.map((data, index) => (
                  <tr
                    key={data.id}
                    className={`transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-green-50`}
                  >
                    <td className="px-4 sm:px-6 py-3 border-b border-gray-200 text-gray-800">
                      {data.indikator}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-center border-b border-gray-200 text-gray-800">
                      {data.simbol}
                    </td>
                    <td
                      className={`px-4 sm:px-6 py-3 border-b border-gray-200 text-center font-semibold ${getKategoriColor(
                        data.nilai
                      )}`}
                    >
                      {formatNumberToIndonesian(data.nilai)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 border-b border-gray-200 text-left">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden max-w-[120px] sm:max-w-[200px]">
                          <div
                            className="bg-ijoTebu h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (data.leverage / 20) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-gray-700 font-medium text-xs sm:text-sm">
                          {formatNumberToIndonesian(data.leverage)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-700 max-w-5xl mx-auto">
        *Indikator dengan nilai leverage tinggi memiliki tingkat sensitivitas
        tinggi, indikator dengan nilai leverage tinggi dapat digunakan sebagai
        prioritas utama dalam pengembangan strategi peningkatan kinerja
        keberlanjutan rantai pasok.
      </p>
    </div>
  );
}
