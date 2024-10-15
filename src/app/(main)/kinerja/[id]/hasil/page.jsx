"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchData } from "@/tools/api";

export default function LingkunganPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [instrumenNilai, setInstrumenNilai] = useState({}); // State untuk menyimpan data dari API
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error

  // Fungsi untuk fetch data dari API instrumen-nilai
  const fetchInstrumenNilai = async () => {
    try {
      const response = await fetchData(`/api/instrumen-nilai/${sesiId}`);
      console.log("ini response: ", response[0]);
      setInstrumenNilai(response[0]); // Set data instrumen nilai dari API
      setLoading(false);
    } catch (err) {
      setError("Gagal mengambil data instrumen nilai.");
      setLoading(false);
    }
  };

  // Memanggil fetchInstrumenNilai saat komponen pertama kali di-mount
  useEffect(() => {
    fetchInstrumenNilai();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mt-5 bg-gray-100">
      <div>
        {/* Dimensi and Kinerja Dimensi Table */}
        <div>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="bg-ijoKepalaTabel px-4 py-2 text-left">
                  Dimensi
                </th>
                <th className="bg-ijoKepalaTabel px-4 py-2 text-left">
                  Kinerja Dimensi
                </th>
              </tr>
            </thead>
            <tbody>
              {instrumenNilai ? (
                <>
                  <tr className="bg-ijoIsiTabel">
                    <td className="border border-gray-300 px-4 py-2">
                      Sumber Daya
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {instrumenNilai.nilaiDimenSDAM || "Data tidak tersedia"}
                    </td>
                  </tr>
                  <tr className="bg-ijoIsiTabel">
                    <td className="border border-gray-300 px-4 py-2">
                      Ekonomi
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {instrumenNilai.nilaiDimenEkono || "Data tidak tersedia"}
                    </td>
                  </tr>
                  <tr className="bg-ijoIsiTabel">
                    <td className="border border-gray-300 px-4 py-2">
                      Lingkungan
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {instrumenNilai.nilaiDimenLingku || "Data tidak tersedia"}
                    </td>
                  </tr>
                  <tr className="bg-ijoIsiTabel">
                    <td className="border border-gray-300 px-4 py-2">Sosial</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {instrumenNilai.nilaiDimenSosial || "Data tidak tersedia"}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Hitung Button */}
          <div className="mt-8 text-end">
            <button className="bg-gray-400 px-6 py-2 rounded-lg">Hitung</button>
          </div>
        </div>

        {/* Nilai Indeks Table */}
        <div className="grid grid-cols-2 gap-5 mt-5">
          <table className="min-w-full table-auto border-collapse mt-8">
            <thead>
              <tr>
                <th className="bg-ijoKepalaTabel px-4 py-2 text-left">
                  Nilai Indeks
                </th>
                <th className="bg-ijoKepalaTabel px-4 py-2 text-left">
                  Kategori
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { nilai: "0.00 - 25.00", kategori: "Tidak Berkelanjutan" },
                { nilai: "25.01 - 50.00", kategori: "Kurang Berkelanjutan" },
                { nilai: "50.01 - 75.00", kategori: "Cukup Berkelanjutan" },
                { nilai: "75.01 - 100.00", kategori: "Berkelanjutan" },
              ].map((row, index) => (
                <tr key={index} className="bg-ijoIsiTabel">
                  <td className="border border-gray-300 px-4 py-2">
                    {row.nilai}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.kategori}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-ijoIsiTabel">
            <h2 className="bg-ijoKepalaTabel">Kinerja Rantai Pasok</h2>
            <p className="text-gray-400 text-center py-20">Nilai Prediksi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
