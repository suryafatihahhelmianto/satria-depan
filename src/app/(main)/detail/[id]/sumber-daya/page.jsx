"use client";

import OpsiDetail from "@/components/OpsiDetail";
import SpiderGraph from "@/components/SpiderGraph";
import { fetchData } from "@/tools/api";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import { getCookie } from "@/tools/getCookie";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function DetailPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [dataSDAM, setDataSDAM] = useState([]);
  const [dataSpiderSDAM, setDataSpiderSDAM] = useState([]);
  const [nilaiDimensiSDAM, setNilaiDimensiSDAM] = useState(0);
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

    setDataSDAM((prev) => {
      const sorted = [...prev].sort((a, b) => {
        if (newOrder === "asc") return a[key] - b[key];
        return b[key] - a[key];
      });
      return sorted;
    });
  };

  useEffect(() => {
    const fetchSDAMData = async () => {
      try {
        const response = await fetchData(
          `/api/dimensi/sdam?sesiPengisianId=${sesiId}`,
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
            id: 1,
            indikator: "Kemudahan Akses Sumber Daya Tenaga Kerja",
            simbol: "D1",
            nilai: (response.aksesTenagKerja * 100).toFixed(1),
            leverage: response.leverageAksesTenagKerja,
          },
          {
            id: 2,
            indikator: "Tingkat Luas Tanam TRI",
            simbol: "D2",
            nilai: (response.luasTanamTRI * 100).toFixed(1),
            leverage: response.leverageLuasTanamTRI,
          },
          {
            id: 3,
            indikator: "Kompetensi Tenaga Kerja",
            simbol: "D3",
            nilai: (response.kompeTenagKerja * 100).toFixed(1),
            leverage: response.leverageKompeTenagKerja,
          },
          {
            id: 4,
            indikator: "Kualitas Bahan Baku",
            simbol: "D4",
            nilai: (response.kualiBahanBaku * 100).toFixed(1),
            leverage: response.leverageKualiBahanBaku,
          },
          {
            id: 5,
            indikator: "Overall Recovery",
            simbol: "D5",
            nilai: (response.efesiensPabrik * 100).toFixed(1),
            leverage: response.leverageEfesiensPabrik,
          },
          {
            id: 6,
            indikator: "Kecukupan Bahan Baku",
            simbol: "D6",
            nilai: (response.cukupBahanBaku * 100).toFixed(1),
            leverage: response.leverageCukupBahanBaku,
          },
          {
            id: 7,
            indikator: "Tingkat Ratoon Tebu",
            simbol: "D7",
            nilai: (response.tingkatRatoon * 100).toFixed(1),
            leverage: response.leverageTingkatRatoon,
          },
          {
            id: 8,
            indikator: "Varietas Tebu yang Responsif Terhadap Kondisi Lahan",
            simbol: "D8",
            nilai: (response.varieTebuRespon * 100).toFixed(1),
            leverage: response.leverageVarieTebuRespon,
          },
          {
            id: 9,
            indikator:
              "Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan",
            simbol: "D9",
            nilai: (response.tingkatMekanis * 100).toFixed(1),
            leverage: response.leverageTingkatMekanis,
          },
          {
            id: 10,
            indikator: "Ketersediaan Teknologi Pengolahan Raw Sugar",
            simbol: "D10",
            nilai: (response.teknoOlahGula * 100).toFixed(1),
            leverage: response.leverageTeknoOlahGula,
          },
        ];

        const spiderData = dataTable.map((item) => ({
          subject: item.simbol,
          A: item.nilai,
        }));

        setDataSDAM(dataTable);
        setDataSpiderSDAM(spiderData);
        setNilaiDimensiSDAM(response.nilaiDimenSDAM);
      } catch (error) {
        console.error("Error fetching dimensi SDAM data:", error);
      }
    };

    fetchSDAMData();
  }, [sesiId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <OpsiDetail />
      <div className="mb-8">
        <SpiderGraph data={dataSpiderSDAM} />
      </div>

      {/* Tabel responsif */}
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-x-auto border border-white/40 shadow-xl rounded-2xl bg-white/60 backdrop-blur-lg">
            <table className="min-w-[720px] w-full text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-green-600 to-green-400 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-lg border-b border-green-700">
                    Indikator
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-lg border-b border-green-700">
                    Simbol
                  </th>

                  {/* Kolom Nilai (%) */}
                  <th
                    className="px-6 py-3 text-center font-semibold text-lg border-b border-green-700 cursor-pointer select-none hover:bg-green-700 transition"
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

                  {/* Kolom Prioritas Indikator */}
                  <th
                    className="px-6 py-3 text-center font-semibold text-lg border-b border-green-700 cursor-pointer select-none hover:bg-green-700 transition"
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
                {dataSDAM.map((data, index) => (
                  <tr
                    key={data.id}
                    className={`transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-green-50`}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {data.indikator}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {data.simbol}
                    </td>
                    <td
                      className={`px-6 py-4 border-b border-gray-200 text-center font-semibold ${getKategoriColor(
                        data.nilai
                      )}`}
                    >
                      {formatNumberToIndonesian(data.nilai)}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-left">
                      <div className="flex items-center justify-left">
                        <div
                          className="bg-ijoTebu h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (data.leverage / 20) * 100,
                              100
                            )}px`,
                          }}
                        ></div>
                        <span className="ml-2 text-gray-700 font-medium">
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
