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

        // Persiapkan data untuk tabel
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

        // Persiapkan data untuk SpiderGraph
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
    <div>
      <OpsiDetail />
      <SpiderGraph data={dataSpiderLingkungan} />
      <div className="min-h-screen bg-gray-100 mb-24">
        <div className="overflow-x-auto mt-4">
          {/* <div className="flex justify-center mb-4">
            <div className="bg-ijoIsiTabel p-4 border border-black">
              <h1>Berkelanjutan</h1>
            </div>
          </div> */}
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead className="bg-ijoKepalaTabel">
              <tr>
                <th className="px-4 py-2 text-left">Indikator</th>
                <th className="px-4 py-2 text-left">Simbol</th>
                <th className="px-4 py-2 text-left">Nilai</th>
                <th className="px-4 py-2 text-left">Kontribusi</th>
              </tr>
            </thead>
            <tbody className="bg-ijoIsiTabel">
              {dataLingkungan.map((data) => (
                <tr key={data.id}>
                  <td className="px-4 py-2">{data.indikator}</td>
                  <td className="px-4 py-2">{data.simbol}</td>
                  <td className="px-4 py-2">{data.nilai}</td>
                  <td className="px-4 py-2">{data.kontribusi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
