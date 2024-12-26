"use client";

import React, { useState } from "react";
import {
  FaLeaf,
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaDna,
  FaSeedling,
  FaThermometerHalf,
  FaVial,
  FaCloudRain,
  FaInfoCircle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";

export default function KalkulatorPage() {
  const [formData, setFormData] = useState({
    blokKebun: "",
    jenis: "",
    masaTanam: "",
    varietas: "",
    kemasakan: "",
    brix: "",
    curahHujan: "",
  });
  const [predictionValue, setPredictionValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmCalculate = async () => {
    setIsLoading(true);

    const {
      blokKebun,
      jenis,
      masaTanam,
      varietas,
      kemasakan,
      brix,
      curahHujan,
    } = formData;

    const data = {
      blokKebun: blokKebun,
      jenis: parseFloat(jenis),
      masaTanam: parseFloat(masaTanam),
      varietas: parseFloat(varietas),
      kemasakan: parseFloat(kemasakan),
      brix: parseFloat(brix),
      curahHujan: parseFloat(curahHujan),
    };

    try {
      const response = await fetchData(`/api/rendemen/input/calculator`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });

      setPredictionValue(response.nilaiRendemen);
    } catch (error) {
      console.error("Error submitting data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grey-200 py-6 px-2 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-ijoDash rounded-lg sm:rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">
              Kalkulator Rendemen
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-black">
              Hitung prediksi rendemen tanpa disimpan ke dalam sistem.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <InputField
                icon={<FaSeedling className="text-orange-500 text-2xl" />}
                label="Blok Kebun"
                name="blokKebun"
                value={formData.blokKebun}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Blok"
              />
              <SelectField
                icon={<FaLeaf className="text-orange-500 text-2xl" />}
                label="Jenis"
                name="jenis"
                value={formData.jenis}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Pilih Jenis" },
                  { value: "0", label: "PC" },
                  { value: "1", label: "R1" },
                  { value: "2", label: "R2" },
                  { value: "3", label: "R3" },
                  { value: "4", label: "RC" },
                ]}
                placeholder="Pilih Jenis"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "35px", // Kontrol lebih kecil
                    fontSize: "12px", // Font lebih kecil
                  }),
                  menu: (base) => ({
                    ...base,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))", // Atur jadi 3 kolom
                    gap: "4px", // Jarak antar opsi lebih kecil
                    maxHeight: "150px", // Dropdown lebih pendek
                    overflowY: "auto", // Scroll jika terlalu panjang
                    padding: "4px", // Padding antar opsi
                  }),
                  option: (base) => ({
                    ...base,
                    padding: "6px 8px", // Opsi lebih kecil
                    fontSize: "12px", // Ukuran font opsi
                  }),
                }}
              />

              <SelectField
                icon={<FaCalendarAlt className="text-orange-500 text-2xl" />}
                label="Masa Tanam"
                name="masaTanam"
                value={formData.masaTanam}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Pilih Masa Tanam" },
                  { value: "0", label: "5A" },
                  { value: "1", label: "5B" },
                  { value: "2", label: "6A" },
                  { value: "3", label: "6B" },
                  { value: "4", label: "7A" },
                  { value: "5", label: "7B" },
                  { value: "6", label: "8A" },
                  { value: "7", label: "8B" },
                  { value: "8", label: "9A" },
                  { value: "9", label: "9B" },
                  { value: "10", label: "10A" },
                  { value: "11", label: "10B" },
                  { value: "12", label: "11A" },
                  { value: "13", label: "11B" },
                  { value: "14", label: "12A" },
                  { value: "15", label: "12B" },
                ]}
              />

              <SelectField
                icon={<FaDna className="text-orange-500 text-2xl" />}
                label="Varietas"
                name="varietas"
                value={formData.varietas}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Pilih Varietas" },
                  { value: "0", label: "BL" },
                  { value: "1", label: "Cening" },
                  { value: "2", label: "GMP1" },
                  { value: "3", label: "GMP2" },
                  { value: "4", label: "GMP3" },
                  { value: "5", label: "KDS3" },
                  { value: "6", label: "KENTUNG" },
                  { value: "7", label: "KK" },
                  { value: "8", label: "LAMPUNG3" },
                  { value: "9", label: "PA0213" },
                  { value: "10", label: "PA0214" },
                  { value: "11", label: "PA022" },
                  { value: "12", label: "PA028" },
                  { value: "13", label: "PA1101" },
                  { value: "14", label: "PA1204" },
                  { value: "15", label: "PA1301" },
                  { value: "16", label: "PA1303" },
                  { value: "17", label: "PA1401" },
                  { value: "18", label: "PA1601" },
                  { value: "19", label: "PA197" },
                  { value: "20", label: "PS851" },
                  { value: "21", label: "PS862" },
                  { value: "22", label: "PS864" },
                  { value: "23", label: "PS865" },
                  { value: "24", label: "PS881" },
                  { value: "25", label: "PS882" },
                  { value: "26", label: "PSJK922" },
                  { value: "27", label: "PSJT941" },
                ]}
              />

              <SelectField
                icon={<FaRegCalendarAlt className="text-orange-500 text-2xl" />}
                label="Kemasakan"
                name="kemasakan"
                value={formData.kemasakan}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Pilih Kemasakan" },
                  { value: "0", label: "Awal" },
                  { value: "1", label: "Awal Tengah" },
                  { value: "2", label: "Tengah" },
                  { value: "3", label: "Tengah Lambat" },
                ]}
              />
              <InputField
                icon={
                  <FaThermometerHalf className="text-orange-500 text-2xl" />
                }
                label="Brix"
                name="brix"
                value={formData.brix}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Brix"
                type="number"
                step="0.1"
              />
              <InputField
                icon={<FaCloudRain className="text-orange-500 text-2xl" />}
                label="Curah Hujan"
                info="Total curah hujan dari mulai tanam sampai pengukuran brix."
                name="curahHujan"
                value={formData.curahHujan}
                onChange={handleInputChange}
                placeholder="Masukkan nilai curah hujan"
                type="number"
              />
            </div>

            {/* Loading Spinner */}
            <div className="relative mt-10">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-full z-10">
                  <div className="w-8 h-8 border-4 border-t-orange-500 border-orange-200 rounded-full animate-spin"></div>
                </div>
              )}
              <button
                type="button"
                onClick={handleConfirmCalculate}
                className={`w-full flex justify-center items-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent rounded-full shadow-sm text-lg sm:text-xl font-medium text-white ${
                  isLoading
                    ? "bg-orange-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-700"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Menghitung..." : "Hitung Prediksi"}
              </button>
            </div>
          </form>
          {predictionValue !== null && (
            <div className="mt-8 sm:mt-12 bg-gradient-to-r from-ijoDash to-ijoWasis rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-4">
                Nilai Prediksi Rendemen
              </h3>
              <p className="text-4xl sm:text-5xl md:text-7xl font-bold text-white">
                {predictionValue}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const InputField = ({ icon, label, info, ...props }) => (
  <div>
    <label className="text-lg font-medium text-black flex items-center mb-2">
      {icon}
      <span className="mx-2">{label}</span>
      {info && (
        <div className="relative">
          <span className="text- cursor-pointer group">
            <FaInfoCircle />
            <div className="absolute bottom-full mb-2 left-0 w-64 bg-white text-black text-sm rounded-lg shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10">
              {info}
            </div>
          </span>
        </div>
      )}
    </label>
    <input
      {...props}
      className="mt-1 block w-full py-2 sm:py-3 px-3 sm:px-4 border border-green-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base sm:text-lg"
    />
  </div>
);

const SelectField = ({ icon, label, options, ...props }) => (
  <div>
    <label className="text-lg font-medium text-black flex items-center mb-2">
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <select
      {...props}
      className="mt-1 block w-full py-2 sm:py-3 px-3 sm:px-4 border border-green-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base sm:text-lg"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
