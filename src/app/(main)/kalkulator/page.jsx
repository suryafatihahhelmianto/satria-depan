"use client";

import { useState } from "react";
import {
  FaLeaf,
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaDna,
  FaSeedling,
  FaThermometerHalf,
  FaCloudRain,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import { HiOutlineLightBulb } from "react-icons/hi";

const kemasakanByVarietas = {
  0: "3", // BL -> Tengah Lambat
  1: "1", // Cening -> Awal Tengah
  2: "2", // GMP1 -> Tengah
  3: "3", // GMP2 -> Tengah Lambat
  4: "1", // GMP3 -> Awal Tengah
  5: "2", // KDS3 -> Tengah
  6: "1", // KENTUNG -> Awal Tengah
  7: "2", // KK -> Tengah
  8: "1", // LAMPUNG3 -> Awal Tengah
  9: "1", // PA0213 -> Awal Tengah
  10: "1", // PA0214 -> Awal Tengah
  11: "0", // PA022 -> Awal
  12: "0", // PA028 -> Awal
  13: "1", // PA1101 -> Awal Tengah
  14: "2", // PA1204 -> Tengah
  15: "2", // PA1301 -> Tengah
  16: "2", // PA1303 -> Tengah
  17: "2", // PA1401 -> Tengah
  18: "2", // PA1601 -> Tengah
  19: "2", // PA197 -> Tengah
  20: "1", // PS851 -> Awal Tengah
  21: "1", // PS862 -> Awal Tengah
  22: "3", // PS864 -> Tengah Lambat
  23: "1", // PS865 -> Awal Tengah
  24: "0", // PS881 -> Awal
  25: "1", // PS882 -> Awal Tengah
  26: "1", // PSJK922 -> Awal Tengah
  27: "2", // PSJT941 -> Tengah
  28: "1", // Mojo -> Awal Tengah
};

export default function KalkulatorPage() {
  const [formData, setFormData] = useState({
    blokKebun: "",
    jenis: "",
    masaTanam: "",
    varietas: "",
    brix: "",
    curahHujan: "",
  });
  const [predictionValue, setPredictionValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    const errors = [];

    // Cek kalau ada field yang masih kosong
    Object.entries(formData).forEach(([key, value]) => {
      if (value === "" || value === null) {
        const fieldLabel = {
          blokKebun: "Blok Kebun",
          jenis: "Kategori",
          masaTanam: "Masa Tanam",
          varietas: "Varietas",
          brix: "Brix",
          curahHujan: "Curah Hujan",
        }[key];
        errors.push(`${fieldLabel} belum diisi`);
      }
    });

    // Validasi numerik hanya kalau sudah diisi
    const kemasakan = kemasakanByVarietas[formData.varietas];
    if (formData.varietas !== "" && kemasakan === undefined) {
      errors.push("Kemasakan untuk varietas tersebut belum dikonfigurasi");
    }

    const brixValue = Number.parseFloat(formData.brix);
    const curahHujanValue = Number.parseFloat(formData.curahHujan);

    if (!isNaN(brixValue) && (brixValue < 13 || brixValue > 25)) {
      errors.push("Nilai Brix harus antara 13 dan 25");
    }

    if (
      !isNaN(curahHujanValue) &&
      (curahHujanValue < 0 || curahHujanValue > 5000)
    ) {
      errors.push("Nilai Curah Hujan harus antara 0 dan 5000 mm");
    }

    return errors;
  };

  const handleConfirmCalculate = async () => {
    const errors = validateInputs();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    setIsLoading(true);

    const { blokKebun, jenis, masaTanam, varietas, brix, curahHujan } =
      formData;
    const kemasakan = kemasakanByVarietas[varietas];

    const data = {
      blokKebun: blokKebun,
      jenis: Number.parseFloat(jenis),
      masaTanam: Number.parseFloat(masaTanam),
      varietas: Number.parseFloat(varietas),
      kemasakan: Number.parseFloat(kemasakan),
      brix: Number.parseFloat(brix),
      curahHujan: Number.parseFloat(curahHujan),
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
    <div className="min-h-screen px-1 py-6 overflow-x-hidden bg-grey-200 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto overflow-hidden rounded-lg shadow-xl bg-ijoDash sm:rounded-2xl">
        <div className="p-4 sm:p-6 md:p-10">
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-2xl font-bold text-black sm:text-3xl md:text-4xl">
              Kalkulator Prediksi Rendemen
            </h1>
            <p className="text-base text-black sm:text-lg md:text-xl">
              Hitung prediksi rendemen mudah, cepat, kapan saja dan di mana
              saja.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <InputField
                icon={<FaSeedling className="text-2xl text-orange-500" />}
                label="Blok Kebun"
                info="Nama blok kebun berdasarkan pembagian wilayah atau area di dalam kebun yang sudah disepakati"
                name="blokKebun"
                value={formData.blokKebun}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Blok"
              />
              <SelectField
                icon={<FaLeaf className="text-2xl text-orange-500" />}
                label="Kategori"
                info="Kategori mengacu pada tebu yang ditanam, misalnya Plain Cane (PC), 1, 2, 3. Jika menanam tingkat yang lebih dari 3, isi saja RC"
                name="jenis"
                value={formData.jenis}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Pilih Kategori" },
                  { value: "0", label: "PC" },
                  { value: "1", label: "R1" },
                  { value: "2", label: "R2" },
                  { value: "3", label: "R3" },
                  { value: "4", label: "RC" },
                ]}
                placeholder="Pilih Kategori"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "35px",
                    fontSize: "12px",
                  }),
                  menu: (base) => ({
                    ...base,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "4px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    padding: "4px",
                  }),
                  option: (base) => ({
                    ...base,
                    padding: "6px 8px",
                    fontSize: "12px",
                  }),
                }}
              />

              <SelectField
                icon={<FaCalendarAlt className="text-2xl text-orange-500" />}
                label="Masa Tanam"
                info="Periode waktu ketika tebu ditanam.Dituliskan 5A, 6B, dst yang menunjukkan bulan tebu ditanam"
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
                icon={<FaDna className="text-2xl text-orange-500" />}
                label="Varietas"
                info="Jenis dari tanaman tebu yang ditanam"
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
                  { value: "28", label: "Mojo" },
                ]}
              />

              {/* <SelectField
                icon={<FaRegCalendarAlt className="text-2xl text-orange-500" />}
                label="Kemasakan"
                info="Tingkat kematangan tanaman tebu yang optimal untuk dipanen"
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
              /> */}

              <InputField
                icon={
                  <FaThermometerHalf className="text-2xl text-orange-500" />
                }
                label="Brix"
                name="brix"
                info="Ukuran konsentrasi zat padat berupa gula pada tanaman tebu dalam 100 gram larutan"
                note="Minimum: 13 — Maksimum: 25"
                value={formData.brix}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Brix"
                type="number"
                step="0.1"
              />
              <InputField
                icon={<FaCloudRain className="text-2xl text-orange-500" />}
                label="Curah Hujan"
                info="Total curah hujan dari mulai tanam sampai pengukuran brix."
                name="curahHujan"
                note="Minimum: 0 — Maksimum: 5000 mm"
                value={formData.curahHujan}
                onChange={handleInputChange}
                placeholder="Masukkan nilai curah hujan"
                type="number"
              />
            </div>

            <div className="relative mt-10">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50 rounded-full">
                  <div className="w-8 h-8 border-4 border-orange-200 rounded-full border-t-orange-500 animate-spin"></div>
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
            <div className="p-4 mt-8 text-center rounded-lg sm:mt-12 bg-gradient-to-r from-ijoDash to-ijoWasis sm:rounded-2xl sm:p-6 md:p-8">
              <h3 className="mb-2 text-xl font-semibold text-white sm:text-2xl sm:mb-4">
                Nilai Prediksi Rendemen
              </h3>
              <p className="text-4xl font-bold text-white sm:text-5xl md:text-7xl">
                {formatNumberToIndonesian(predictionValue)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaExclamationTriangle className="mr-3 text-2xl text-red-500 animate-pulse" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Data Tidak Valid
                </h3>
              </div>
              <button
                onClick={() => setShowValidationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-gray-700">
                Terdapat nilai yang tidak valid pada input berikut:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li
                    key={index}
                    className="text-sm font-bold text-red-600 animate-pulse"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Kembali dan Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const InputField = ({ className = "", icon, label, info, note, ...props }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="flex items-center mb-2 text-lg font-medium text-black">
      {icon}
      <span className="mx-2">{label}</span>
      {info && (
        <div className="relative flex items-center ml-1 group">
          <FaInfoCircle className="text-gray-600 cursor-pointer hover:text-green-700" />
          <div className="absolute flex items-start invisible w-64 gap-2 p-4 mb-2 text-sm text-gray-900 transition-all duration-300 -translate-x-1/2 bg-white rounded-lg shadow-lg opacity-0 bottom-full left-1/2 group-hover:opacity-100 group-hover:visible z-999">
            <span className="text-yellow-500 mt-0.5">
              <HiOutlineLightBulb size={18} />
            </span>
            <span className="leading-snug">{info}</span>
          </div>
        </div>
      )}
    </label>
    <input
      {...props}
      className="mt-1 block w-full py-2 px-3 sm:py-2.5 sm:px-4 border border-green-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
    />
    {note && (
      <span className="mt-1 ml-1 text-xs italic text-gray-600">{note}</span>
    )}
  </div>
);

const SelectField = ({ icon, label, info, options, ...props }) => (
  <div>
    <label className="flex items-center mb-2 text-lg font-medium text-black">
      {icon}
      <span className="mx-2">{label}</span>
      {info && (
        <div className="relative flex items-center ml-1 group">
          <FaInfoCircle className="text-gray-600 cursor-pointer hover:text-green-700" />
          <div className="absolute flex items-start invisible w-64 gap-2 p-4 mb-2 text-sm text-gray-900 transition-all duration-300 -translate-x-1/2 bg-white rounded-lg shadow-lg opacity-0 bottom-full left-1/2 group-hover:opacity-100 group-hover:visible z-999">
            <span className="text-yellow-500 mt-0.5">
              <HiOutlineLightBulb size={18} />
            </span>
            <span className="leading-snug">{info}</span>
          </div>
        </div>
      )}
    </label>
    <select
      {...props}
      className="block w-full px-3 py-2 mt-1 text-base bg-white border border-green-300 rounded-lg shadow-sm sm:py-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-lg"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
