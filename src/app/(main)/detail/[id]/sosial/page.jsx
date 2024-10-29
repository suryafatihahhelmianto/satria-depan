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

  const [dataSosial, setDataSosial] = useState([]);
  const [dataSpiderSosial, setDataSpiderSosial] = useState([]);
  const [nilaiDimensiSosial, setNilaiDimensiSosial] = useState(0);

  useEffect(() => {
    const fetchSosialData = async () => {
      try {
        const response = await fetchData(
          `/api/dimensi/sosial?sesiPengisianId=${sesiId}`,
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
            indikator: "Dukungan Kelembagaan terhadap Rantai Pasok ",
            simbol: "S1",
            nilai: (response.dukunganLembaga * 100).toFixed(1),
          },
          {
            id: 2,
            indikator: "Ketersediaan Infrastruktur sebagai Penunjang Aktivitas",
            simbol: "S2",
            nilai: (response.tersediaaInfrast * 100).toFixed(1),
          },
          {
            id: 3,
            indikator: "Manfaat Corporate Sosial Responsibility bagi Sosial",
            simbol: "S3",
            nilai: (response.manfaatSosial * 100).toFixed(1),
          },
          {
            id: 4,
            indikator: "Keluhan Limbah Rantai Pasok Industri",
            simbol: "S4",
            nilai: (response.keluhanLimbah * 100).toFixed(1),
          },
          {
            id: 5,
            indikator: "Penyerapan Tenaga Kerja Lokal",
            simbol: "S5",
            nilai: (response.penyerapLokal * 100).toFixed(1),
          },
          {
            id: 6,
            indikator: "Peningkatan Keikutsertaan Stakeholder Kemitraan",
            simbol: "S6",
            nilai: (response.ikutMitra * 100).toFixed(1),
          },
        ];

        // Persiapkan data untuk SpiderGraph
        const spiderData = dataTable.map((item) => ({
          subject: item.simbol,
          A: item.nilai,
        }));

        setDataSosial(dataTable);
        setDataSpiderSosial(spiderData);
        setNilaiDimensiSosial(response.nilaiDimenSosial);
      } catch (error) {
        console.error("Error fetching dimensi Sosial data:", error);
      }
    };

    fetchSosialData();
  }, [sesiId]);

  return (
    <div>
      <OpsiDetail />
      <SpiderGraph data={dataSpiderSosial} />
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
              {dataSosial.map((data) => (
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
