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

  const dataLingkungan = [
    {
      id: 1,
      indikator: "Tingkat Bau",
      simbol: "L1",
      nilai: 0.812,
      kategori: "Berkelanjutan",
    },
    {
      id: 2,
      indikator: "Tingkat Debu",
      simbol: "L2",
      nilai: 0.653,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 3,
      indikator: "Emisi Listrik",
      simbol: "L3",
      nilai: 0.415,
      kategori: "Tidak Berkelanjutan",
    },
    {
      id: 4,
      indikator: "Kebisingan",
      simbol: "L4",
      nilai: 0.73,
      kategori: "Cukup Berkelanjutan",
    },
    {
      id: 5,
      indikator: "Air Muka Tanah",
      simbol: "L5",
      nilai: 0.942,
      kategori: "Berkelanjutan",
    },
    {
      id: 6,
      indikator: "Udara Ambien",
      simbol: "L6",
      nilai: 0.867,
      kategori: "Berkelanjutan",
    },
    {
      id: 7,
      indikator: "Udara Ruangan",
      simbol: "L7",
      nilai: 0.775,
      kategori: "Cukup Berkelanjutan",
    },
  ];

  const dataSpiderLingkungan = [
    { subject: "L1", A: 81.2 },
    { subject: "L2", A: 65.3 },
    { subject: "L3", A: 41.5 },
    { subject: "L4", A: 73.0 },
    { subject: "L5", A: 94.2 },
    { subject: "L6", A: 86.7 },
    { subject: "L7", A: 77.5 },
  ];

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
              </tr>
            </thead>
            <tbody className="bg-ijoIsiTabel">
              {dataLingkungan.map((data) => (
                <tr key={data.id}>
                  <td className="px-4 py-2">{data.indikator}</td>
                  <td className="px-4 py-2">{data.simbol}</td>
                  <td className="px-4 py-2">{data.nilai}</td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 font-bold" colSpan={2}>
                  Total Nilai Dimensi Lingkungan
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
