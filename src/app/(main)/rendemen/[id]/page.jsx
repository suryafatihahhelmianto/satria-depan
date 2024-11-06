"use client";

import { useState } from "react";

// Import your Navbar and SideBar components
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";

export default function PredictionPage() {
  const [predictionValue, setPredictionValue] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleCalculate = () => {
    // Open the confirmation modal
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCalculate = () => {
    // Perform the calculation
    setPredictionValue(7.78); // Replace with actual prediction logic
    // Close the confirmation modal
    setIsConfirmModalOpen(false);
  };

  const handleCancelCalculate = () => {
    // Close the confirmation modal without calculating
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1">
        {/* Main Content */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              Input Parameter Prediksi Rendemen
            </h2>

            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Blok Kebun</label>
                  <select className="bg-green-100 w-full p-2 rounded">
                    <option value="">-- Pilih --</option>
                    <option value="blok1">Blok 1</option>
                    <option value="blok2">Blok 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700">Jenis Kebun</label>
                  <select className="bg-green-100 w-full p-2 rounded">
                    <option value="">-- Pilih --</option>
                    <option value="jenis1">Jenis 1</option>
                    <option value="jenis2">Jenis 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700">Masa Tanam</label>
                  <select className="bg-green-100 w-full p-2 rounded">
                    <option value="">-- Pilih --</option>
                    <option value="masa1">Masa 1</option>
                    <option value="masa2">Masa 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700">Varietas</label>
                  <select className="bg-green-100 w-full p-2 rounded">
                    <option value="">-- Pilih --</option>
                    <option value="var1">Varietas 1</option>
                    <option value="var2">Varietas 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700">Kemasakan</label>
                  <input
                    className="bg-green-100 w-full p-2 rounded"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Brix</label>
                  <input
                    className="bg-green-100 w-full p-2 rounded"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Pol Tebu</label>
                  <input
                    className="bg-green-100 w-full p-2 rounded"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Harka Kemurnian</label>
                  <input
                    className="bg-green-100 w-full p-2 rounded"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Nilai Nira</label>
                  <input
                    className="bg-green-100 w-full p-2 rounded"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    Faktor Kemasakan
                  </label>
                  <input
                    className="bg-green-100 w-full p-2 rounded"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Curah Hujan</label>
                  <input
                    className="bg-green-100 w-full p-2 rounded"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCalculate}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Hitung
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
              >
                Lanjut Hitung
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
