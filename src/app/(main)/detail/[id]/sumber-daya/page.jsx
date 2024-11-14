"use client";

import OpsiDetail from "@/components/OpsiDetail";
import SpiderGraph from "@/components/SpiderGraph";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function DetailPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [dataSDAM, setDataSDAM] = useState([]);
  const [dataSpiderSDAM, setDataSpiderSDAM] = useState([]);
  const [nilaiDimensiSDAM, setNilaiDimensiSDAM] = useState(0);

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

        // Prepare data for the table
        const dataTable = [
          {
            id: 1,
            indikator: "Kemudahan Akses Sumber Daya Tenaga Kerja",
            simbol: "D1",
            nilai: (response.aksesTenagKerja * 100).toFixed(1),
          },
          {
            id: 2,
            indikator: "Tingkat Luas Tanam TRI",
            simbol: "D2",
            nilai: (response.luasTanamTRI * 100).toFixed(1),
          },
          {
            id: 3,
            indikator: "Kompetensi Tenaga Kerja",
            simbol: "D3",
            nilai: (response.kompeTenagKerja * 100).toFixed(1),
          },
          {
            id: 4,
            indikator: "Kualitas Bahan Baku",
            simbol: "D4",
            nilai: (response.kualiBahanBaku * 100).toFixed(1),
          },
          {
            id: 5,
            indikator: "Overall Recovery",
            simbol: "D5",
            nilai: (response.efesiensPabrik * 100).toFixed(1),
          },
          {
            id: 6,
            indikator: "Kecukupan Bahan Baku",
            simbol: "D6",
            nilai: (response.cukupBahanBaku * 100).toFixed(1),
          },
          {
            id: 7,
            indikator: "Tingkat Ratoon Tebu",
            simbol: "D7",
            nilai: (response.tingkatRatoon * 100).toFixed(1),
          },
          {
            id: 8,
            indikator: "Varietas Tebu yang Responsif Terhadap Kondisi Lahan",
            simbol: "D8",
            nilai: (response.varieTebuRespon * 100).toFixed(1),
          },
          {
            id: 9,
            indikator:
              "Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan",
            simbol: "D9",
            nilai: (response.tingkatMekanis * 100).toFixed(1),
          },
          {
            id: 10,
            indikator: "Teknologi Pengolahan Raw Sugar",
            simbol: "D10",
            nilai: (response.teknoOlahGula * 100).toFixed(1),
          },
        ];

        // Prepare data for SpiderGraph
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
      <div className="overflow-x-auto mt-4 px-12">
        <table className="min-w-full bg-white/50 border border-white/30 shadow-xl rounded-2xl backdrop-blur-lg">
          <thead className="bg-gradient-to-r from-green-600 to-green-400 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-lg border-b border-green-700">
                Indikator
              </th>
              <th className="px-6 py-3 text-left font-semibold text-lg border-b border-green-700">
                Simbol
              </th>
              <th className="px-6 py-3 text-center font-semibold text-lg border-b border-green-700">
                Nilai (%)
              </th>
              <th className="px-6 py-3 text-center font-semibold text-lg border-b border-green-700">
                Kontribusi
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
                <td className="px-6 py-4 border-b border-gray-200 text-center text-gray-800 font-semibold">
                  {data.nilai}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-center font-medium">
                  {/* Placeholder for potential contribution values */}
                  {data.kontribusi || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
