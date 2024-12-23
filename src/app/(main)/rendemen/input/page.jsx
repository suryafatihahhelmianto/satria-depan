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

export default function RendemenInputPage() {
  const [formData, setFormData] = useState({
    blokKebun: "",
    jenis: "",
    masaTanam: "",
    varietas: "",
    kemasakan: "",
    brix: "",
    // pol: "",
    curahHujan: "",
  });
  const [predictionValue, setPredictionValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const handleCancelCalculate = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirmCalculate = async () => {
    setIsLoading(true);
    setIsConfirmModalOpen(false);

    const {
      blokKebun,
      jenis,
      masaTanam,
      varietas,
      kemasakan,
      brix,
      // pol,
      curahHujan,
    } = formData;

    const data = {
      blokKebun: blokKebun,
      jenis: parseFloat(jenis),
      masaTanam: parseFloat(masaTanam),
      varietas: parseFloat(varietas),
      kemasakan: parseFloat(kemasakan),
      brix: parseFloat(brix),
      // pol: parseFloat(pol),
      curahHujan: parseFloat(curahHujan),
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
      console.error("Error submitting data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grey-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-green-800 mb-2">
              Input Data Prediksi Rendemen Gula Tebu
            </h1>
            {/* <p className="text-xl text-green-600">
              Masukkan data rendemen tebu untuk analisis prediksi.
            </p> */}
            <p className="text-xl text-green-600">
              Masukkan data untuk prediksi rendemen gula tebu.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField
                icon={<FaSeedling className="text-green-500 text-2xl" />}
                label="Blok Kebun"
                name="blokKebun"
                value={formData.blokKebun}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Blok"
              />
              <SelectField
                icon={<FaLeaf className="text-green-500 text-2xl" />}
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
                icon={<FaCalendarAlt className="text-green-500 text-2xl" />}
                label="Masa Tanam"
                name="masaTanam"
                value={formData.masaTanam}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Pilih Masa Tanam" },
                  { value: "0", label: "5.0" },
                  { value: "1", label: "5.5" },
                  { value: "2", label: "6.0" },
                  { value: "3", label: "6.5" },
                  { value: "4", label: "7.0" },
                  { value: "5", label: "7.5" },
                  { value: "6", label: "8.0" },
                  { value: "7", label: "8.5" },
                  { value: "8", label: "9.0" },
                  { value: "9", label: "9.5" },
                  { value: "10", label: "10.0" },
                  { value: "11", label: "10.5" },
                  { value: "12", label: "11.0" },
                  { value: "13", label: "11.5" },
                  { value: "14", label: "12.0" },
                  { value: "15", label: "12.5" },
                ]}
              />

              <SelectField
                icon={<FaDna className="text-green-500 text-2xl" />}
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
                icon={<FaRegCalendarAlt className="text-green-500 text-2xl" />}
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
                icon={<FaThermometerHalf className="text-green-500 text-2xl" />}
                label="Brix"
                name="brix"
                value={formData.brix}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Brix"
                type="number"
              />
              <InputField
                icon={<FaCloudRain className="text-green-500 text-2xl" />}
                label="Curah Hujan"
                info="Total curah hujan dari mulai tanam sampai pengukuran brix."
                name="curahHujan"
                value={formData.curahHujan}
                onChange={handleInputChange}
                placeholder="Masukkan nilai curah hujan"
                type="number"
              />
            </div>
            <div className="mt-10">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-sm text-xl font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Menghitung..." : "Hitung Prediksi"}
              </button>
            </div>
          </form>
          {predictionValue !== null && (
            <div className="mt-12 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Nilai Prediksi Rendemen
              </h3>
              <p className="text-7xl font-bold text-white">
                {predictionValue}%
              </p>
            </div>
          )}
        </div>
      </div>
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-2xl w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-6 text-green-800">
              Konfirmasi Pengiriman
            </h2>
            <p className="mb-8 text-xl text-green-600">
              Apakah data sudah sesuai? Silakan periksa kembali sebelum
              melanjutkan perhitungan.
            </p>
            <div className="flex justify-end gap-6">
              <button
                onClick={handleCancelCalculate}
                className="px-8 py-3 bg-red-500 text-white rounded-full text-lg hover:bg-red-600 transition duration-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmCalculate}
                className="px-8 py-3 bg-green-500 text-white rounded-full text-lg hover:bg-green-600 transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Menghitung..." : "Hitung!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const InputField = ({ icon, label, info, ...props }) => (
  <div>
    <label className="text-lg font-medium text-green-700 flex items-center mb-2">
      {icon}
      <span className="mx-2">{label}</span>
      {info && (
        <div className="relative">
          <span className="text-green-500 cursor-pointer group">
            <FaInfoCircle />
            <div className="absolute bottom-full mb-2 left-0 w-64 bg-white text-green-700 text-sm rounded-lg shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10">
              {info}
            </div>
          </span>
        </div>
      )}
    </label>
    <input
      {...props}
      className="mt-1 block w-full py-3 px-4 border border-green-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
    />
  </div>
);

const SelectField = ({ icon, label, options, ...props }) => (
  <div>
    <label className="text-lg font-medium text-green-700 flex items-center mb-2">
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <select
      {...props}
      className="mt-1 block w-full py-3 px-4 border border-green-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
