"use client";

import FieldInput from "@/components/FieldInput";
import OpsiDimensi from "@/components/OpsiDimensi";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function SumberDayaPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [formData, setFormData] = useState({
    nilaiRisiko: 0,
    polAmpas: 0,
    polBlotong: 0,
    polTetes: 0,
    rendemenKebun: 0,
    rendemenGerbang: 0,
    rendemenNPP: 0,
    rendemenGula: 0,
    untungPetani: 0,
    untungBUMDES: 0,
    hargaAcuan: 0,
    hargaLelang: 0,
    shsTahunIni: 0,
    shsTahunSebel: 0,
    bagiHasil: 0,
  });

  const handleCalculate = async () => {
    try {
      const dataToSend = {
        formData,
      };

      const response = await fetchData("/api/dimensi/ekonomi", {
        method: "POST", // menggunakan POST untuk membuat data baru
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data: formData,
      });

      console.log("Response dari server: ", response);
    } catch (error) {
      console.error("Error calculating dimensions: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      <h2 className="text-red-600 font-bold mt-5">
        Kemudahan Akses Sumber Daya Tenaga Kerja (D1)
      </h2>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-ijoKepalaTabel">
            <tr>
              <th className="px-4 py-2 text-left">Sub Indikator</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-ijoIsiTabel">
            {/* Tingkat Risiko Rantai Pasok */}
            <FieldInput
              label="Kemudahan akses sumber daya tenaga kerja"
              value={formData.nilaiRisiko}
              onChange={(e) =>
                setFormData({ ...formData, nilaiRisiko: e.target.value })
              }
              onSubmit={() => handleUpdate("nilaiRisiko", formData.nilaiRisiko)}
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-red-600 font-bold mt-5">
        Tingkat Luas Tanam TRI (D2)
      </h2>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-ijoKepalaTabel">
            <tr>
              <th className="px-4 py-2 text-left">Sub Indikator</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-ijoIsiTabel">
            {/* Kehilangan Pol Ampas */}
            <FieldInput
              label="Tingkat Luas Tanam TRI (%)"
              value={formData.polAmpas}
              onChange={(e) =>
                setFormData({ ...formData, polAmpas: e.target.value })
              }
              onSubmit={() => handleUpdate("polAmpas", formData.polAmpas)}
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-red-600 font-bold mt-5">
        Kompetensi Tenaga Kerja (D3)
      </h2>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-ijoKepalaTabel">
            <tr>
              <th className="px-4 py-2 text-left">Sub Indikator</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-ijoIsiTabel">
            <FieldInput
              label="Produktivitas Tenaga Kerja (%)"
              value={formData.untungPetani}
              onChange={(e) =>
                setFormData({ ...formData, untungPetani: e.target.value })
              }
              onSubmit={() =>
                handleUpdate("untungPetani", formData.untungPetani)
              }
            />

            <FieldInput
              label="Jumlah Jam Pelatihan (%)"
              value={formData.untungBUMDES}
              onChange={(e) =>
                setFormData({ ...formData, untungBUMDES: e.target.value })
              }
              onSubmit={() =>
                handleUpdate("untungBUMDES", formData.untungBUMDES)
              }
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-red-600 font-bold mt-5">Kualitas Bahan Baku (D4)</h2>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-ijoKepalaTabel">
            <tr>
              <th className="px-4 py-2 text-left">Sub Indikator</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-ijoIsiTabel">
            <FieldInput
              label="Produktivitas Tebu (Ton/Ha"
              value={formData.shsTahunIni}
              onChange={(e) =>
                setFormData({ ...formData, shsTahunIni: e.target.value })
              }
              onSubmit={() => handleUpdate("shsTahunIni", formData.shsTahunIni)}
            />

            <FieldInput
              label="Rendemen Tebu (%)"
              value={formData.shsTahunSebel}
              onChange={(e) =>
                setFormData({ ...formData, shsTahunSebel: e.target.value })
              }
              onSubmit={() =>
                handleUpdate("shsTahunSebel", formData.shsTahunSebel)
              }
            />

            <FieldInput
              label="MBS"
              value={formData.shsTahunSebel}
              onChange={(e) =>
                setFormData({ ...formData, shsTahunSebel: e.target.value })
              }
              onSubmit={() =>
                handleUpdate("shsTahunSebel", formData.shsTahunSebel)
              }
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-red-600 font-bold mt-5">Overall Recovery (D5)</h2>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-ijoKepalaTabel">
            <tr>
              <th className="px-4 py-2 text-left">Sub Indikator</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-ijoIsiTabel">
            <FieldInput
              label="Overall Recovery (%)"
              value={formData.bagiHasil}
              onChange={(e) =>
                setFormData({ ...formData, bagiHasil: e.target.value })
              }
              onSubmit={() => handleUpdate("bagiHasil", formData.bagiHasil)}
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-red-600 font-bold mt-5">Kecukupan Bahan Baku (D6)</h2>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-ijoKepalaTabel">
            <tr>
              <th className="px-4 py-2 text-left">Sub Indikator</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="bg-ijoIsiTabel">
            <FieldInput
              label="KIS (TCD)"
              value={formData.bagiHasil}
              onChange={(e) =>
                setFormData({ ...formData, bagiHasil: e.target.value })
              }
              onSubmit={() => handleUpdate("bagiHasil", formData.bagiHasil)}
            />

            <FieldInput
              label="KES (TCD)"
              value={formData.bagiHasil}
              onChange={(e) =>
                setFormData({ ...formData, bagiHasil: e.target.value })
              }
              onSubmit={() => handleUpdate("bagiHasil", formData.bagiHasil)}
            />
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={handleCalculate}
          className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800"
        >
          Hitung
        </button>
      </div>
    </div>
  );
}
