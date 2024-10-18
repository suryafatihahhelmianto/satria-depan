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
      nilai: 0.892,
      kategori: "Berkelanjutan",
    },
    {
      id: 2,
      indikator: "Tingkat Luas Tanam TRI",
      simbol: "D2",
      nilai: 0.345,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 3,
      indikator: "Kompetensi Tenaga Kerja",
      simbol: "D3",
      nilai: 0.321,
      kategori: "Berkelanjutan",
    },
    {
      id: 4,
      indikator: "Kualitas Bahan Baku",
      simbol: "D4",
      nilai: 0.983,
      kategori: "Tidak Berkelanjutan",
    },
    {
      id: 5,
      indikator: "Overall Recovery",
      simbol: "D5",
      nilai: 0.292,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 6,
      indikator: "Kecukupan Bahan Baku",
      simbol: "D6",
      nilai: 0.929,
      kategori: "Berkelanjutan",
    },
    {
      id: 7,
      indikator: "Tingkat Ratoon Tebu",
      simbol: "D7",
      nilai: 0.299,
      kategori: "Berkelanjutan",
    },
    {
      id: 8,
      indikator: "Varietas Tebu yang Responsif Terhadap Kondisi Lahan",
      simbol: "D8",
      nilai: 0.929,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 9,
      indikator:
        "Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan",
      simbol: "D9",
      nilai: 0.922,
      kategori: "Berkelanjutan",
    },
    {
      id: 10,
      indikator: "Teknologi Pengolahan Raw Sugar",
      simbol: "D10",
      nilai: 0.822,
      kategori: "Berkelanjutan",
    },
    {
      id: 11,
      indikator: "Nilai Dimensi Sumber Daya Keseluruhan",
      simbol: "D",
      nilai: 74.421,
      kategori: "Cukup Berkelanjutan",
    },
  ];

  const dataSpider = [
    { subject: "E1", A: 60 },
    { subject: "E2", A: 75 },
    { subject: "E3", A: 90 },
    { subject: "E4", A: 85 },
    { subject: "E5", A: 70 },
    { subject: "E6", A: 70 },
  ];

  return (
    <div>
      <OpsiDetail />
      <SpiderGraph data={dataSpider} />
      <div className="min-h-screen bg-gray-100 mb-24">
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead className="bg-ijoKepalaTabel">
              <tr>
                <th className="px-4 py-2 text-left">Indikator</th>
                <th className="px-4 py-2 text-left">Simbol</th>
                <th className="px-4 py-2 text-left">Nilai</th>
                <th className="px-4 py-2 text-left">Kategori</th>
              </tr>
            </thead>
            <tbody className="bg-ijoIsiTabel">
              {dataSumberDaya.map((data) => (
                <tr key={data.id}>
                  <td className="px-4 py-2">{data.indikator}</td>
                  <td className="px-4 py-2">{data.simbol}</td>
                  <td className="px-4 py-2">{data.nilai}</td>
                  <td className="px-4 py-2">{data.kategori}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
