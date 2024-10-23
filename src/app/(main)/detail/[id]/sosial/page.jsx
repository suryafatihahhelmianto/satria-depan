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

  const dataSosial = [
    {
      id: 1,
      indikator: "Kesejahteraan Masyarakat Sekitar",
      simbol: "S1",
      nilai: 0.765,
      kategori: "Berkelanjutan",
    },
    {
      id: 2,
      indikator: "Partisipasi Masyarakat dalam Pengambilan Keputusan",
      simbol: "S2",
      nilai: 0.523,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 3,
      indikator: "Hubungan Sosial antara Pekerja dan Masyarakat",
      simbol: "S3",
      nilai: 0.672,
      kategori: "Berkelanjutan",
    },
    {
      id: 4,
      indikator: "Peran Serta Lembaga Sosial",
      simbol: "S4",
      nilai: 0.434,
      kategori: "Tidak Berkelanjutan",
    },
    {
      id: 5,
      indikator: "Akses terhadap Fasilitas Pendidikan",
      simbol: "S5",
      nilai: 0.893,
      kategori: "Berkelanjutan",
    },
    {
      id: 6,
      indikator: "Tingkat Kesehatan Masyarakat",
      simbol: "S6",
      nilai: 0.786,
      kategori: "Berkelanjutan",
    },
    {
      id: 7,
      indikator: "Tanggung Jawab Sial Perusahaan (CSR)",
      simbol: "S7",
      nilai: 0.91,
      kategori: "Berkelanjutan",
    },
    {
      id: 8,
      indikator: "Keadilan Gender dan Kesetaraan",
      simbol: "S8",
      nilai: 0.62,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 9,
      indikator: "Pengelolaan Konflik Sial",
      simbol: "S9",
      nilai: 0.542,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 10,
      indikator: "Penghormatan terhadap Budaya Lokal",
      simbol: "S10",
      nilai: 0.75,
      kategori: "Berkelanjutan",
    },
  ];

  const dataSpiderSosial = [
    { subject: "S1", A: 76.5 },
    { subject: "S2", A: 52.3 },
    { subject: "S3", A: 67.2 },
    { subject: "S4", A: 43.4 },
    { subject: "S5", A: 89.3 },
    { subject: "S6", A: 78.6 },
    { subject: "S7", A: 91.0 },
    { subject: "S8", A: 62.0 },
    { subject: "S9", A: 54.2 },
    { subject: "S10", A: 75.0 },
  ];

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
              </tr>
            </thead>
            <tbody className="bg-ijoIsiTabel">
              {dataSosial.map((data) => (
                <tr key={data.id}>
                  <td className="px-4 py-2">{data.indikator}</td>
                  <td className="px-4 py-2">{data.simbol}</td>
                  <td className="px-4 py-2">{data.nilai}</td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 font-bold" colSpan={2}>
                  Total Nilai Dimensi Sosial
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
