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

      // Persiapkan data untuk tabel
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

      // Persiapkan data untuk SpiderGraph
      const spiderData = dataTable.map((item) => ({
        subject: item.simbol,
        A: item.nilai,
      }));

      setDataSDAM(dataTable);
      setDataSpiderSDAM(spiderData);
      setNilaiDimensiSDAM(response.nilaiDimenSDAM);
    } catch (error) {
      console.error("Error fetching dimensi Sosial data:", error);
    }
  };

  useEffect(() => {
    fetchSDAMData();
  }, [sesiId]);

  return (
    <div>
      <OpsiDetail />
      <SpiderGraph data={dataSpiderSDAM} />
      <div className="min-h-screen bg-gray-100 mb-24">
        <div className="overflow-x-auto mt-4 px-12">
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
                <th className="px-4 py-2 text-left">Nilai (%)</th>
              </tr>
            </thead>
            <tbody className="bg-ijoIsiTabel">
              {dataSDAM.map((data) => (
                <tr key={data.id}>
                  <td className="px-4 py-2">{data.indikator}</td>
                  <td className="px-4 py-2">{data.simbol}</td>
                  <td className="px-4 py-2">{data.nilai}</td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 font-bold" colSpan={2}>
                  Total Nilai Dimensi Sumber Daya
                </td>
                <td className="px-4 py-2 font-bold">
                  {nilaiDimensiSDAM?.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
