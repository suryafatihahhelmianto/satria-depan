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

export default function RendemenInputPage() {
  const [formData, setFormData] = useState({
    blokKebun: "",
    jenis: "",
    masaTanam: "",
    varietas: "",
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
    if (formData.jenis === "") errors.push("Kategori harus dipilih");
    if (formData.masaTanam === "") errors.push("Masa Tanam harus dipilih");
    if (formData.varietas === "") errors.push("Varietas harus dipilih");

    const kemasakan = kemasakanByVarietas[formData.varietas];
    if (formData.varietas !== "" && kemasakan === undefined)
      errors.push("Kemasakan untuk varietas tersebut belum dikonfigurasi");

    const brixValue = parseFloat(formData.brix);
    const curahValue = parseFloat(formData.curahHujan);

    if (isNaN(brixValue) || brixValue < 13 || brixValue > 25)
      errors.push("Nilai Brix harus antara 13 dan 25");
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

    // Ambil kemasakan berdasarkan varietas
    const kemasakan = kemasakanByVarietas[formData.varietas];

    // Pastikan mapping kemasakan tersedia
    if (kemasakan === undefined) {
      setValidationErrors([
        "Kemasakan untuk varietas yang dipilih belum dikonfigurasi.",
      ]);
      setIsValidationModalOpen(true);
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      jenis: parseFloat(formData.jenis),
      masaTanam: parseFloat(formData.masaTanam),
      varietas: parseFloat(formData.varietas),
      kemasakan: parseFloat(kemasakan),
      brix: parseFloat(formData.brix),
      curahHujan: parseFloat(formData.curahHujan),
      allowDuplicate,
    };

    console.log("PAYLOAD:", payload);

    try {
      const response = await fetchData(`/api/rendemen/input`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data: payload,
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

      // Jangan anggap semua error sebagai duplicate
      if (errorMsg.toLowerCase().includes("hari ini sudah ada")) {
        setIsDuplicateModalOpen(true);
      } else {
        setValidationErrors([
          errorMsg || "Terjadi kesalahan saat mengirim data.",
        ]);
        setIsValidationModalOpen(true);
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
    <div className="min-h-screen px-4 py-12 bg-gray-200 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto overflow-hidden bg-white shadow-xl rounded-2xl">
        <div className="p-10">
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-4xl font-bold text-green-800">
              Input Data Prediksi Rendemen Gula Tebu
            </h1>
            <p className="text-xl text-green-600">
              Masukkan data untuk prediksi rendemen gula tebu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <InputField
                icon={<FaSeedling className="text-2xl text-green-500" />}
                label="Blok Kebun"
                info="Nama blok kebun berdasarkan pembagian wilayah atau area di dalam kebun."
                name="blokKebun"
                value={formData.blokKebun}
                onChange={handleInputChange}
                placeholder="Masukkan nama Blok Kebun"
              />

              <SelectField
                icon={<FaLeaf className="text-2xl text-green-500" />}
                label="Kategori"
                info="kategori mengacu pada tebu yang ditanam, misalnya Plain Cane (PC), 1, 2, 3. Jika menanam tingkat yang lebih dari 3, isi saja RC"
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
              />

              <SelectField
                icon={<FaCalendarAlt className="text-2xl text-green-500" />}
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
                icon={<FaDna className="text-2xl text-green-500" />}
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
                icon={<FaRegCalendarAlt className="text-2xl text-green-500" />}
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
                icon={<FaThermometerHalf className="text-2xl text-green-500" />}
                label="Brix"
                info="Ukuran konsentrasi zat padat berupa gula pada tanaman tebu dalam 100 gram larutan"
                name="brix"
                value={formData.brix}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Brix"
                type="number"
                step="0.1"
                note="Minimum: 13 — Maksimum: 25"
              />

              <InputField
                icon={<FaCloudRain className="text-2xl text-green-500" />}
                label="Curah Hujan"
                info="Total curah hujan dari mulai tanam sampai pengukuran brix."
                name="curahHujan"
                value={formData.curahHujan}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Curah Hujan"
                type="number"
                note="Minimum: 0 — Maksimum: 5000 mm"
              />
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className="flex items-center justify-center w-full px-6 py-4 text-xl font-medium text-white transition bg-green-600 border border-transparent rounded-full shadow-sm hover:bg-green-700"
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
          icon={<FaExclamationTriangle className="text-3xl text-red-500" />}
          message={
            <>
              <p className="mb-3 text-gray-700">
                Terdapat nilai yang tidak valid pada input berikut:
              </p>
              <ul className="space-y-1 text-red-600 list-disc list-inside">
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
          icon={<FaExclamationTriangle className="text-3xl text-red-500" />}
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
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3">{icon}</div>}
        <h2 className="text-2xl font-bold text-green-800">{title}</h2>
      </div>
      <div className="mb-6 text-lg text-gray-700">{message}</div>
      <div className="flex justify-end gap-3">
        {cancelLabel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-800 transition bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            {cancelLabel}
          </button>
        )}
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

const InputField = ({ icon, label, info, note, ...props }) => (
  <div>
    <label className="flex items-center mb-2 text-lg font-medium text-green-700">
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
      className="block w-full px-4 py-3 mt-1 text-lg bg-white border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
    {note && (
      <span className="mt-1 ml-1 text-xs italic text-gray-600">{note}</span>
    )}
  </div>
);

const SelectField = ({ icon, label, options, info, ...props }) => (
  <div>
    <label className="flex items-center mb-2 text-lg font-medium text-green-700">
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
      className="block w-full px-4 py-3 mt-1 text-lg bg-white border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
