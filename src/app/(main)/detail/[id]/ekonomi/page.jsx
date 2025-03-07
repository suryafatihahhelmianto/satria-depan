"use client";

import OpsiDetail from "@/components/OpsiDetail";
import SpiderGraph from "@/components/SpiderGraph";
import { fetchData } from "@/tools/api";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import { getCookie } from "@/tools/getCookie";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function DetailPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [dataEkonomi, setDataEkonomi] = useState([]);
  const [dataSpiderEkonomi, setDataSpiderEkonomi] = useState([]);
  const [nilaiDimensiEkonomi, setNilaiDimensiEkonomi] = useState(0);

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

        // Prepare data for SpiderGraph
        const spiderData = dataTable.map((item) => ({
          subject: item.simbol,
          A: item.nilai,
        }));

        setDataEkonomi(dataTable);
        setDataSpiderEkonomi(spiderData);
        setNilaiDimensiEkonomi(response.nilaiDimenEkono);
      } catch (error) {
        console.error("Error fetching dimensi ekonomi data:", error);
      }
    };

    fetchEkonomiData();
  }, [sesiId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <OpsiDetail />
      <div className="mb-8">
        <SpiderGraph data={dataSpiderEkonomi} />
      </div>
      <div className="overflow-x-auto mt-4 px-12">
        <table className="min-w-full bg-white/50 border border-gray-300 shadow-lg rounded-2xl backdrop-blur-lg">
          <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white">
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
                Prioritas Indikator*
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
                <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                  {data.indikator}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                  {data.simbol}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-gray-800 font-semibold">
                  {formatNumberToIndonesian(data.nilai)}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-center">
                  {/* Bar horizontal untuk prioritas indikator */}
                  <div className="flex items-center">
                    <div
                      className="bg-ijoTebu h-2"
                      style={{
                        width: `${(data.leverage / 20) * 90}px`, // Panjang bar diatur proporsional, bisa disesuaikan
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
        <h1 className="mt-6">
          {" "}
          *Indikator dengan nilai leverage tinggi memiliki tingkat sensitivitas
          tinggi, indikator dengan nilai leverage tinggi dapat digunakan sebagai
          prioritas utama dalam pengembangan strategi peningkatan kinerja
          keberlanjutan rantai pasok
        </h1>
      </div>
    </div>
  );
}
