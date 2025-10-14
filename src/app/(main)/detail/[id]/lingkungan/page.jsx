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

  const [dataLingkungan, setDataLingkungan] = useState([]);
  const [dataSpiderLingkungan, setDataSpiderLingkungan] = useState([]);
  const [nilaiDimensiLingkungan, setNilaiDimensiLingkungan] = useState(0);
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

    setDataLingkungan((prev) => {
      const sorted = [...prev].sort((a, b) => {
        if (newOrder === "asc") return a[key] - b[key];
        return b[key] - a[key];
      });
      return sorted;
    });
  };

  useEffect(() => {
    const fetchLingkunganData = async () => {
      try {
        const response = await fetchData(
          `/api/dimensi/lingkungan?sesiPengisianId=${sesiId}`,
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
            indikator: "Tingkat Bau",
            simbol: "L1",
            nilai: (response.tingkatBau * 100).toFixed(1),
            leverage: response.leverageTingkatBau,
          },
          {
            id: 2,
            indikator: "Tingkat Debu",
            simbol: "L2",
            nilai: (response.tingkatDebu * 100).toFixed(1),
            leverage: response.leverageTingkatDebu,
          },
          {
            id: 3,
            indikator: "Emisi Listrik",
            simbol: "L3",
            nilai: (response.emisiListrik * 100).toFixed(1),
            leverage: response.leverageEmisiListrik,
          },
          {
            id: 4,
            indikator: "Kebisingan",
            simbol: "L4",
            nilai: (response.kebisingan * 100).toFixed(1),
            leverage: response.leverageKebisingan,
          },
          {
            id: 5,
            indikator: "Air Muka Tanah",
            simbol: "L5",
            nilai: (response.airMukaan * 100).toFixed(1),
            leverage: response.leverageAirMukaan,
          },
          {
            id: 6,
            indikator: "Udara Ambien",
            simbol: "L6",
            nilai: (response.udaraAmbien * 100).toFixed(1),
            leverage: response.leverageUdaraAmbien,
          },
          {
            id: 7,
            indikator: "Udara Ruangan",
            simbol: "L7",
            nilai: (response.udaraRuang * 100).toFixed(1),
            leverage: response.leverageUdaraRuang,
          },
        ];

        // Prepare data for SpiderGraph
        const spiderData = dataTable.map((item) => ({
          subject: item.simbol,
          A: item.nilai,
        }));

        setDataLingkungan(dataTable);
        setDataSpiderLingkungan(spiderData);
        setNilaiDimensiLingkungan(response.nilaiDimenLingku);
      } catch (error) {
        console.error("Error fetching dimensi lingkungan data:", error);
      }
    };

    fetchLingkunganData();
  }, [sesiId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <OpsiDetail />
      <div className="mb-8">
        <SpiderGraph data={dataSpiderLingkungan} />
      </div>
      {/* Tabel responsif */}
      <div className="overflow-x-auto flex justify-center mt-4">
        <table className="w-full max-w-6xl bg-white/60 border border-white/40 shadow-xl rounded-2xl backdrop-blur-lg">
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
            {dataLingkungan.map((data, index) => (
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
                        width: `${Math.min((data.leverage / 20) * 100, 100)}px`,
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
      <p className="mt-6 text-sm text-gray-700 max-w-5xl mx-auto">
        *Indikator dengan nilai leverage tinggi memiliki tingkat sensitivitas
        tinggi, indikator dengan nilai leverage tinggi dapat digunakan sebagai
        prioritas utama dalam pengembangan strategi peningkatan kinerja
        keberlanjutan rantai pasok.
      </p>
    </div>
  );
}
