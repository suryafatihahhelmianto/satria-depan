"use client";

import OpsiDetail from "@/components/OpsiDetail";
import SpiderGraph from "@/components/SpiderGraph";
import React, { useState, useEffect } from "react";

export default function DetailPage() {
  const [formData, setFormData] = useState({
    nilaiRisiko: 0,
    polAmpas: 0,
    polBlotong: 0,
    polTetes: 0,
    rendemenKebun: 0,
    rendemenGerbang: 0,
    rendemenNPP: 0,
    rendemenGula: 0,
    kesenjanganRantai: 0,
    hargaAcuan: 0,
    hargaLelang: 0,
    shsTahunIni: 0,
    shsTahunSebel: 0,
    returnOE: 0,
  });

  const dataSumberDaya = [
    {
      id: 1,
      indikator: "Kemudahan Akses Sumber Daya Tenaga Kerja",
      simbol: "D1",
      nilai: 89.2,
      kategori: "Berkelanjutan",
    },
    {
      id: 2,
      indikator: "Tingkat Luas Tanam TRI",
      simbol: "D2",
      nilai: 34.5,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 3,
      indikator: "Kompetensi Tenaga Kerja",
      simbol: "D3",
      nilai: 32.1,
      kategori: "Berkelanjutan",
    },
    {
      id: 4,
      indikator: "Kualitas Bahan Baku",
      simbol: "D4",
      nilai: 98.3,
      kategori: "Tidak Berkelanjutan",
    },
    {
      id: 5,
      indikator: "Overall Recovery",
      simbol: "D5",
      nilai: 29.2,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 6,
      indikator: "Kecukupan Bahan Baku",
      simbol: "D6",
      nilai: 92.9,
      kategori: "Berkelanjutan",
    },
    {
      id: 7,
      indikator: "Tingkat Ratoon Tebu",
      simbol: "D7",
      nilai: 29.9,
      kategori: "Berkelanjutan",
    },
    {
      id: 8,
      indikator: "Varietas Tebu yang Responsif Terhadap Kondisi Lahan",
      simbol: "D8",
      nilai: 92.9,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 9,
      indikator:
        "Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan",
      simbol: "D9",
      nilai: 92.2,
      kategori: "Berkelanjutan",
    },
    {
      id: 10,
      indikator: "Teknologi Pengolahan Raw Sugar",
      simbol: "D10",
      nilai: 82.2,
      kategori: "Berkelanjutan",
    },
  ];

  const dataSpider = [
    { subject: "D1", A: 89.2 },
    { subject: "D2", A: 34.5 },
    { subject: "D3", A: 32.1 },
    { subject: "D4", A: 98.3 },
    { subject: "D5", A: 29.2 },
    { subject: "D6", A: 92.9 },
    { subject: "D7", A: 29.9 },
    { subject: "D8", A: 92.9 },
    { subject: "D9", A: 92.2 },
    { subject: "D10", A: 82.2 },
  ];

  return (
    <div>
      <OpsiDetail />
      <SpiderGraph data={dataSpider} />
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
              {dataSumberDaya.map((data) => (
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
                <td className="px-4 py-2 font-bold">73.2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
