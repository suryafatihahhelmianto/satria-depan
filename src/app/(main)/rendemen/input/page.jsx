"use client";

import { useState } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { useRouter } from "next/navigation";
import { GiSugarCane, GiBamboo, GiMolecule, GiFactory } from "react-icons/gi";
import { FaArrowLeft } from "react-icons/fa";

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    blokKebun: "",
    brix: "",
    pol: "",
    hk: "",
    nn: "",
    fk: "",
  });
  const [predictionValue, setPredictionValue] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCalculate = async () => {
    setIsLoading(true);
    const data = {
      pabrikGulaId: 1,
      ...formData,
      brix: parseFloat(formData.brix),
      pol: parseFloat(formData.pol),
      hk: parseFloat(formData.hk),
      nn: parseFloat(formData.nn),
      fk: parseFloat(formData.fk),
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
    <div className="min-h-screen bg-gradient-to-br from-white to-white flex items-center justify-center p-4 relative">
      <div className="bg-white rounded-xl p-8 w-full h-screen max-w-full">
        <button
          onClick={() => router.push("/rendemen")}
          className="absolute top-4 left-4 text-green-600 hover:text-red-500 transition-colors duration-300"
        >
          <FaArrowLeft size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-8 text-center text-green-800">
          Prediksi Rendemen
        </h2>

        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label className="block text-xl font-medium text-green-700 mb-1">
              {key === "blokKebun"
                ? "Blok Kebun"
                : key === "brix"
                ? "Brix"
                : key === "pol"
                ? "Pol"
                : key === "hk"
                ? "Harka Kemurnian (HK)"
                : key === "nn"
                ? "Nilai Nira (NN)"
                : "Faktor Kemasakan (FK)"}
            </label>
            <input
              type={key === "blokKebun" ? "text" : "number"}
              name={key}
              value={value}
              onChange={handleInputChange}
              className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              placeholder={key === "blokKebun" ? "Input Blok Kebun" : "0"}
            />
          </div>
        ))}

        <div className="flex justify-end mt-9">
          <button
            onClick={handleCalculate}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-300 transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Menghitung..." : "Hitung Prediksi"}
          </button>
        </div>

        {predictionValue !== null && (
          <div className="mt-8 bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Nilai Prediksi
            </h3>
            <p className="text-6xl font-bold text-white">{predictionValue}%</p>
          </div>
        )}
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-green-800">
              Konfirmasi
            </h2>
            <p className="mb-6 text-green-600">
              Apakah data sudah sesuai? Silakan periksa kembali sebelum
              melanjutkan perhitungan.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelCalculate}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmCalculate}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300"
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
