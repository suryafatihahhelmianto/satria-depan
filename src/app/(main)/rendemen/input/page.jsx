"use client";

import { useEffect, useState } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { usePathname, useRouter } from "next/navigation";

export default function PredictionPage() {
  const [blokKebun, setBlokKebun] = useState("");
  const [brix, setBrix] = useState("");
  const [pol, setPol] = useState("");
  const [hk, setHk] = useState("");
  const [nn, setNn] = useState("");
  const [fk, setFk] = useState("");
  const [predictionValue, setPredictionValue] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleCalculate = () => {
    // Open the confirmation modal
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCalculate = async () => {
    setIsLoading(true);
    const data = {
      pabrikGulaId: 1, // Ganti dengan ID pabrik yang sesuai jika diperlukan
      blokKebun: blokKebun,
      brix: parseFloat(brix),
      pol: parseFloat(pol),
      hk: parseFloat(hk),
      nn: parseFloat(nn),
      fk: parseFloat(fk),
    };

    try {
      const response = await fetchData(`/api/rendemen/input`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });

      // if (!response.ok) {
      //   throw new Error("Failed to update data");
      // }

      setPredictionValue(response.newRendemen.nilaiRendemen);
      router.push("/rendemen");
    } catch (error) {
      console.error("Error updating field: ", error);
    } finally {
      setIsLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  const handleCancelCalculate = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              Input Parameter Prediksi Rendemen
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Blok Kebun</label>
                <input
                  type="text"
                  value={blokKebun}
                  onChange={(e) => setBlokKebun(e.target.value)}
                  className="bg-green-100 w-full p-2 rounded"
                  placeholder="Input Blok Kebun"
                />
                {/* <select
                  value={blokKebun}
                  onChange={(e) => setBlokKebun(e.target.value)}
                  className="bg-green-100 w-full p-2 rounded"
                >
                  <option value="">-- Pilih --</option>
                  <option value="blok1">Blok 1</option>
                  <option value="blok2">Blok 2</option>
                </select> */}
              </div>

              <div>
                <label className="block text-gray-700">Brix</label>
                <input
                  type="number"
                  value={brix}
                  onChange={(e) => setBrix(e.target.value)}
                  className="bg-green-100 w-full p-2 rounded"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-gray-700">Pol</label>
                <input
                  type="number"
                  value={pol}
                  onChange={(e) => setPol(e.target.value)}
                  className="bg-green-100 w-full p-2 rounded"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-gray-700">
                  Harka Kemurnian (HK)
                </label>
                <input
                  type="number"
                  value={hk}
                  onChange={(e) => setHk(e.target.value)}
                  className="bg-green-100 w-full p-2 rounded"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-gray-700">Nilai Nira (NN)</label>
                <input
                  type="number"
                  value={nn}
                  onChange={(e) => setNn(e.target.value)}
                  className="bg-green-100 w-full p-2 rounded"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-gray-700">
                  Faktor Kemasakan (FK)
                </label>
                <input
                  type="number"
                  value={fk}
                  onChange={(e) => setFk(e.target.value)}
                  className="bg-green-100 w-full p-2 rounded"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCalculate}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Menghitung..." : "Hitung"}
              </button>
            </div>

            {predictionValue !== null && (
              <div className="mt-6">
                <h3 className="text-center bg-green-600 text-white py-2 rounded-t-lg">
                  Nilai Prediksi
                </h3>
                <div className="bg-green-100 p-8 rounded-b-lg">
                  <p className="text-center text-6xl font-bold">
                    {predictionValue}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Konfirmasi</h2>
            <p className="mb-6">
              Apakah data sudah sesuai? Silakan periksa kembali sebelum
              melanjutkan perhitungan.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelCalculate}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmCalculate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Menghitung..." : "Lanjut Hitung"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
