"use client";

import React, { useState } from "react";
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
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { fetchData } from "@/tools/api";
import { HiOutlineLightBulb } from "react-icons/hi";
import { getCookie } from "@/tools/getCookie";

export default function RendemenInputPage() {
  const [formData, setFormData] = useState({
    blokKebun: "",
    jenis: "",
    masaTanam: "",
    varietas: "",
    kemasakan: "",
    brix: "",
    curahHujan: "",
  });

  const [usedBlocks, setUsedBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [predictionValue, setPredictionValue] = useState(null);

  const router = useRouter();

  // ==================== HANDLER ====================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    const errors = [];
    if (!formData.blokKebun.trim()) errors.push("Blok Kebun harus diisi");
    if (formData.jenis === "") errors.push("Jenis harus dipilih");
    if (formData.masaTanam === "") errors.push("Masa Tanam harus dipilih");
    if (formData.varietas === "") errors.push("Varietas harus dipilih");
    if (formData.kemasakan === "") errors.push("Kemasakan harus dipilih");

    const brixValue = parseFloat(formData.brix);
    const curahValue = parseFloat(formData.curahHujan);

    if (isNaN(brixValue) || brixValue < 0 || brixValue > 30)
      errors.push("Nilai Brix harus antara 0 dan 30");
    if (isNaN(curahValue) || curahValue < 0 || curahValue > 5000)
      errors.push("Curah Hujan harus antara 0 dan 5000 mm");

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateInputs();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsValidationModalOpen(true);
      return;
    }

    const blok = formData.blokKebun.trim().toLowerCase();
    if (usedBlocks.includes(blok)) {
      setIsDuplicateModalOpen(true);
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleCancelCalculate = () => setIsConfirmModalOpen(false);

  const handleConfirmCalculate = async (allowDuplicate = false) => {
    setIsConfirmModalOpen(false);
    setIsLoading(true);

    try {
      const response = await fetchData(`/api/rendemen/input`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data: {
          ...formData,
          jenis: parseFloat(formData.jenis),
          masaTanam: parseFloat(formData.masaTanam),
          varietas: parseFloat(formData.varietas),
          kemasakan: parseFloat(formData.kemasakan),
          brix: parseFloat(formData.brix),
          curahHujan: parseFloat(formData.curahHujan),
          allowDuplicate,
        },
      });

      // === kalau backend mendeteksi duplikat ===
      if (
        response?.error === "DUPLICATE_BLOK" ||
        response?.message?.includes("hari ini sudah ada")
      ) {
        setIsDuplicateModalOpen(true);
        return;
      }

      // === sukses ===
      setUsedBlocks((prev) => [
        ...prev,
        formData.blokKebun.trim().toLowerCase(),
      ]);
      setPredictionValue(response.newRendemen?.nilaiRendemen);
      router.push("/rendemen");
    } catch (err) {
      console.error("Error submitting data:", err);

      const errorMsg = err?.response?.data?.message || err?.message || "";

      if (errorMsg.toLowerCase().includes("hari ini sudah ada")) {
        setIsDuplicateModalOpen(true);
      } else {
        setIsDuplicateModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateProceed = () => {
    setIsDuplicateModalOpen(false);
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-green-800 mb-2">
              Input Data Prediksi Rendemen Gula Tebu
            </h1>
            <p className="text-xl text-green-600">
              Masukkan data untuk prediksi rendemen gula tebu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField
                icon={<FaSeedling className="text-green-500 text-2xl" />}
                label="Blok Kebun"
                info="Nama blok kebun berdasarkan pembagian wilayah atau area di dalam kebun."
                name="blokKebun"
                value={formData.blokKebun}
                onChange={handleInputChange}
                placeholder="Masukkan nama Blok Kebun"
              />

              <SelectField
                icon={<FaLeaf className="text-green-500 text-2xl" />}
                label="Jenis / Kategori"
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
              />

              <SelectField
                icon={<FaCalendarAlt className="text-green-500 text-2xl" />}
                label="Masa Tanam"
                info="Periode waktu ketika tebu ditanam.Dituliskan 5A, 6B, dst yang menunjukkan bulan tebu ditanam"
                name="masaTanam"
                value={formData.masaTanam}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Pilih Masa Tanam" },
                  ...Array.from({ length: 16 }).map((_, i) => ({
                    value: i,
                    label: `${5 + Math.floor(i / 2)}${i % 2 === 0 ? "A" : "B"}`,
                  })),
                ]}
              />

              <SelectField
                icon={<FaDna className="text-green-500 text-2xl" />}
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
                icon={<FaRegCalendarAlt className="text-green-500 text-2xl" />}
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
                icon={<FaThermometerHalf className="text-green-500 text-2xl" />}
                label="Brix"
                info="Ukuran konsentrasi zat padat berupa gula pada tanaman tebu dalam 100 gram larutan"
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
                placeholder="Masukkan nilai Curah Hujan"
                type="number"
              />
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-sm text-xl font-medium text-white bg-green-600 hover:bg-green-700 transition"
                disabled={isLoading}
              >
                {isLoading ? "Menghitung..." : "Hitung Prediksi"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* === Modal Konfirmasi === */}
      {isConfirmModalOpen && (
        <Modal
          title="Konfirmasi Pengiriman"
          message="Apakah data sudah sesuai? Silakan periksa kembali sebelum melanjutkan perhitungan."
          onCancel={handleCancelCalculate}
          onConfirm={() => handleConfirmCalculate(false)}
          confirmLabel="Hitung!"
        />
      )}

      {/* === Modal Validasi === */}
      {isValidationModalOpen && (
        <Modal
          title="Data Tidak Valid"
          icon={<FaExclamationTriangle className="text-red-500 text-3xl" />}
          message={
            <>
              <p className="text-gray-700 mb-3">
                Terdapat nilai yang tidak valid pada input berikut:
              </p>
              <ul className="list-disc list-inside text-red-600 space-y-1">
                {validationErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </>
          }
          onConfirm={() => setIsValidationModalOpen(false)}
          confirmLabel="Kembali dan Perbaiki"
        />
      )}

      {/* === Modal Duplikat === */}
      {isDuplicateModalOpen && (
        <Modal
          icon={<FaExclamationTriangle className="text-red-500 text-3xl" />}
          title="Blok Kebun Sudah Pernah Dihitung"
          message="Anda sudah melakukan perhitungan rendemen pada blok kebun ini. ubah nama blok kebun dengan memberi keterangan angka / nama petani, contoh: Cukang Galeuh 1, Cukang Galeuh Budi."
          confirmLabel="Ubah Nama Blok Kebun"
          onConfirm={handleDuplicateProceed}
        />
      )}
    </div>
  );
}

// =============== REUSABLE COMPONENTS ===============

const Modal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "OK",
  cancelLabel,
  icon,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3">{icon}</div>}
        <h2 className="text-2xl font-bold text-green-800">{title}</h2>
      </div>
      <div className="mb-6 text-gray-700 text-lg">{message}</div>
      <div className="flex justify-end gap-3">
        {cancelLabel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            {cancelLabel}
          </button>
        )}
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

const InputField = ({ icon, label, info, ...props }) => (
  <div>
    <label className="text-lg font-medium text-green-700 flex items-center mb-2">
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
      className="mt-1 block w-full py-3 px-4 border border-green-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
    />
  </div>
);

const SelectField = ({ icon, label, options, info, ...props }) => (
  <div>
    <label className="text-lg font-medium text-green-700 flex items-center mb-2">
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
      className="mt-1 block w-full py-3 px-4 border border-green-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
