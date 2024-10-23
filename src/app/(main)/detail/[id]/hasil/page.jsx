"use client";

import OpsiDetail from "@/components/OpsiDetail";
import SpiderGraph from "@/components/SpiderGraph";
import React from "react";

export default function HasilPage() {
  const dataTable = [
    {
      dimensi: "Sumberdaya (D)",
      nilai: "92.7%",
      kategori: "Kurang Berkelanjutan",
    },
    {
      dimensi: "Ekonomi (E)",
      nilai: "78.4%",
      kategori: "Kurang Berkelanjutan",
    },
    { dimensi: "Lingkungan (L)", nilai: "62.4%", kategori: "Berkelanjutan" },
    { dimensi: "Sosial (S)", nilai: "56.5%", kategori: "Cukup Berkelanjutan" },
    {
      dimensi: "Total Nilai Kinerja",
      nilai: "81.3%",
      kategori: "Berkelanjutan",
    },
  ];

  const dataSpiderHasil = [
    { subject: "Ekonomi (E)", A: 76.5 },
    { subject: "Sosial (S)", A: 52.3 },
    { subject: "Lingkungan (L)", A: 67.2 },
    { subject: "Sumberdaya (D)", A: 43.4 },
  ];
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
            {dataTable.map((row, index) => (
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
