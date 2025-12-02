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
          jenis: "Jenis/Kategori",
          masaTanam: "Masa Tanam",
          varietas: "Varietas",
          kemasakan: "Kemasakan",
          brix: "Brix",
          curahHujan: "Curah Hujan",
        }[key];
        errors.push(`${fieldLabel} belum diisi`);
      }
    });

    // Validasi numerik hanya kalau sudah diisi
    const brixValue = Number.parseFloat(formData.brix);
    const curahHujanValue = Number.parseFloat(formData.curahHujan);

    if (!isNaN(brixValue) && (brixValue < 0 || brixValue > 30)) {
      errors.push("Nilai Brix harus antara 0 dan 30");
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
    <div className="min-h-screen bg-grey-200 py-6 px-1 sm:py-12 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto bg-ijoDash rounded-lg sm:rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">
              Kalkulator Prediksi Rendemen
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-black">
              Hitung prediksi rendemen mudah, cepat, kapan saja dan di mana
              saja.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                icon={<FaSeedling className="text-orange-500 text-2xl" />}
                label="Blok Kebun"
                info="Nama blok kebun berdasarkan pembagian wilayah atau area di dalam kebun yang sudah disepakati"
                name="blokKebun"
                value={formData.blokKebun}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Blok"
              />
              <SelectField
                icon={<FaLeaf className="text-orange-500 text-2xl" />}
                label="Jenis/Kategori"
                info="Jenis mengacu pada kategori tebu yang ditanam, misalnya Plain Cane (PC), 1, 2, 3. Jika menanam tingkat yang lebih dari 3, isi saja RC"
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
                icon={<FaCalendarAlt className="text-orange-500 text-2xl" />}
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
                icon={<FaDna className="text-orange-500 text-2xl" />}
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

              <SelectField
                icon={<FaRegCalendarAlt className="text-orange-500 text-2xl" />}
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
              />
              <InputField
                icon={
                  <FaThermometerHalf className="text-orange-500 text-2xl" />
                }
                label="Brix"
                name="brix"
                info="Ukuran konsentrasi zat padat berupa gula pada tanaman tebu dalam 100 gram larutan"
                value={formData.brix}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Brix"
                type="number"
                step="0.1"
              />
              <InputField
                className="lg:col-start-2"
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
                {formatNumberToIndonesian(predictionValue)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {showValidationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 text-2xl mr-3 animate-pulse" />
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
              <p className="text-gray-700 mb-3">
                Terdapat nilai yang tidak valid pada input berikut:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li
                    key={index}
                    className="text-red-600 text-sm font-bold animate-pulse"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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

const InputField = ({ className = "", icon, label, info, ...props }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-lg font-medium text-black flex items-center mb-2">
      {icon}
      <span className="mx-2">{label}</span>
      {info && (
        <div className="relative flex items-center group ml-1">
          <FaInfoCircle className="cursor-pointer text-gray-600 hover:text-green-700" />
          <div
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white text-gray-900 text-sm rounded-lg shadow-lg p-4
    opacity-0 invisible group-hover:opacity-100 group-hover:visible
    transition-all duration-300 z-999 flex items-start gap-2"
          >
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
  </div>
);

const SelectField = ({ icon, label, info, options, ...props }) => (
  <div>
    <label className="text-lg font-medium text-black flex items-center mb-2">
      {icon}
      <span className="mx-2">{label}</span>
      {info && (
        <div className="relative flex items-center group ml-1">
          <FaInfoCircle className="cursor-pointer text-gray-600 hover:text-green-700" />
          <div
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white text-gray-900 text-sm rounded-lg shadow-lg p-4
    opacity-0 invisible group-hover:opacity-100 group-hover:visible
    transition-all duration-300 z-999 flex items-start gap-2"
          >
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
