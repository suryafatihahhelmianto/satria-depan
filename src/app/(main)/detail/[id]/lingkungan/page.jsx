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

  const [dataLingkungan, setDataLingkungan] = useState([]);
  const [dataSpiderLingkungan, setDataSpiderLingkungan] = useState([]);
  const [nilaiDimensiLingkungan, setNilaiDimensiLingkungan] = useState(0);

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
          },
          {
            id: 2,
            indikator: "Tingkat Debu",
            simbol: "L2",
            nilai: (response.tingkatDebu * 100).toFixed(1),
          },
          {
            id: 3,
            indikator: "Emisi Listrik",
            simbol: "L3",
            nilai: (response.emisiListrik * 100).toFixed(1),
          },
          {
            id: 4,
            indikator: "Kebisingan",
            simbol: "L4",
            nilai: (response.kebisingan * 100).toFixed(1),
          },
          {
            id: 5,
            indikator: "Air Muka Tanah",
            simbol: "L5",
            nilai: (response.airMukaan * 100).toFixed(1),
          },
          {
            id: 6,
            indikator: "Udara Ambien",
            simbol: "L6",
            nilai: (response.udaraAmbien * 100).toFixed(1),
          },
          {
            id: 7,
            indikator: "Udara Ruangan",
            simbol: "L7",
            nilai: (response.udaraRuang * 100).toFixed(1),
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
      <div className="overflow-x-auto">
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
                Nilai
              </th>
              <th className="px-6 py-3 text-center font-semibold text-lg border-b border-green-700">
                Kontribusi
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
                <td className="px-6 py-4 border-b border-gray-200 text-center text-gray-800 font-semibold">
                  {data.nilai}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-center font-medium">
                  {/* Conditional styling for contribution */}
                  <span
                    className={`${
                      data.kontribusi > 70
                        ? "text-green-600"
                        : data.kontribusi > 50
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {data.kontribusi || "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
