"use client";

import OpsiDetail from "@/components/OpsiDetail";
import SpiderGraph from "@/components/SpiderGraph";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function HasilPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [dataHasil, setDataHasil] = useState([]);
  const [dataSpiderHasil, setDataSpiderHasil] = useState([]);

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

      console.log("ini respon hasil: ", response);

      // Persiapkan data untuk tabel
      const dataTable = [
        {
          dimensi: "Sumberdaya (D)",
          nilai: response.nilaiDimenSDAM?.toFixed(1),
          kategori: "Kurang Berkelanjutan",
        },
        {
          dimensi: "Ekonomi (E)",
          nilai: response.nilaiDimenEkono?.toFixed(1),
          kategori: "Kurang Berkelanjutan",
        },
        {
          dimensi: "Lingkungan (L)",
          nilai: response.nilaiDimenLingku?.toFixed(1),
          kategori: "Berkelanjutan",
        },
        {
          dimensi: "Sosial (S)",
          nilai: response.nilaiDimenSosial?.toFixed(1),
          kategori: "Cukup Berkelanjutan",
        },
        {
          dimensi: "Total Nilai Kinerja",
          nilai: response.nilaiKinerja?.toFixed(1),
          kategori: "Berkelanjutan",
        },
      ];

      // Persiapkan data untuk SpiderGraph
      const spiderData = dataTable.map((item) => ({
        subject: item.simbol,
        A: item.nilai,
      }));

      setDataHasil(dataTable);
      setDataSpiderHasil(spiderData);
    } catch (error) {
      console.error("Error fetching dimensi hasil data:", error);
    }
  };

  useEffect(() => {
    fetchHasilKinerja();
  }, [sesiId]);

  return (
    <div>
      <OpsiDetail />
      <SpiderGraph data={dataSpiderHasil} />
      <div className="flex justify-center">
        <table className="table-auto w-full max-w-4xl text-left border-collapse">
          <thead>
            <tr className="bg-ijoKepalaTabel">
              <th className="border border-black px-4 py-2">Dimensi</th>
              <th className="border border-black px-4 py-2 text-center">
                Nilai (%)
              </th>
              <th className="border border-black px-4 py-2 text-center">
                Kategori
              </th>
            </tr>
          </thead>
          <tbody>
            {dataHasil.map((row, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <td className="border border-black px-4 py-2">{row.dimensi}</td>
                <td className="border border-black px-4 py-2 text-center">
                  {row.nilai}
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  {row.kategori}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
