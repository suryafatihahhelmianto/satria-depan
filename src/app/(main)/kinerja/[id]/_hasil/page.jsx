"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";

export default function HasilPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [instrumenNilai, setInstrumenNilai] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // State for result of API request

  useEffect(() => {
    const fetchInstrumenNilai = async () => {
      try {
        setLoading(true);
        const response = await fetchData(`/api/instrumen-nilai/${sesiId}`);
        setInstrumenNilai(response[0]);
        setLoading(false);
      } catch (err) {
        setError("Gagal mengambil data instrumen nilai.");
        setLoading(false);
      }
    };

    if (sesiId) {
      fetchInstrumenNilai();
    }
  }, [sesiId]);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchData("/api/dimensi/calculate/anfis", {
        method: "POST",
        data: {
          ekonomi: instrumenNilai.nilaiDimenEkono || 0,
          lingkungan: instrumenNilai.nilaiDimenLingku || 0,
          sosial: instrumenNilai.nilaiDimenSosial || 0,
          sdam: instrumenNilai.nilaiDimenSDAM || 0,
        },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      const data = await response.predicted_sustainability;
      setResult(data);
    } catch (err) {
      setError("Gagal menghitung indeks keberlanjutan.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mt-5 bg-gray-100">
      <div>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="bg-ijoKepalaTabel px-4 py-2 text-left">Dimensi</th>
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
                    {instrumenNilai.nilaiDimenSDAM?.toFixed(1) ||
                      "Data tidak tersedia"}
                  </td>
                </tr>
                <tr className="bg-ijoIsiTabel">
                  <td className="border border-gray-300 px-4 py-2">Ekonomi</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {instrumenNilai.nilaiDimenEkono?.toFixed(1) ||
                      "Data tidak tersedia"}
                  </td>
                </tr>
                <tr className="bg-ijoIsiTabel">
                  <td className="border border-gray-300 px-4 py-2">
                    Lingkungan
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {instrumenNilai.nilaiDimenLingku?.toFixed(1) ||
                      "Data tidak tersedia"}
                  </td>
                </tr>
                <tr className="bg-ijoIsiTabel">
                  <td className="border border-gray-300 px-4 py-2">Sosial</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {instrumenNilai.nilaiDimenSosial?.toFixed(1) ||
                      "Data tidak tersedia"}
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
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="bg-gray-400 px-6 py-2 rounded-lg"
          >
            {loading ? "Menghitung..." : "Hitung"}
          </button>
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
            <p className="text-center py-20">
              {result !== null ? (
                <div
                  className={`font-semibold ${
                    result <= 25
                      ? "text-red-600"
                      : result <= 50
                      ? "text-orange-500"
                      : result <= 75
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  <h1 className="text-7xl font-bold">{result.toFixed(2)}</h1>
                  <h1
                    className={`font-semibold ${
                      result <= 25
                        ? "text-red-600"
                        : result <= 50
                        ? "text-orange-500"
                        : result <= 75
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                  >
                    {result <= 25
                      ? "Tidak Berkelanjutan"
                      : result <= 50
                      ? "Kurang Berkelanjutan"
                      : result <= 75
                      ? "Cukup Berkelanjutan"
                      : "Berkelanjutan"}
                  </h1>
                </div>
              ) : (
                "Nilai Prediksi"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
