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
      indikator: "Tingkat Luas Taman TRI",
      simbol: "D2",
      nilai: 0.1212,
      kategori: "Cukup Berkelanjutan",
    },
  ];

  return (
    <div>
      <OpsiDetail />
      <SpiderGraph />
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
