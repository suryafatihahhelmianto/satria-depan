"use client";

import { useState } from "react";
import {
  FaLeaf,
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaDna,
  FaSeedling,
  FaThermometerHalf,
  FaVial,
  FaCloudRain,
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
    pol: "",
    curahHujan: "",
  });
  const [predictionValue, setPredictionValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    const errors = [];
    const brixValue = Number.parseFloat(formData.brix);
    const curahHujanValue = Number.parseFloat(formData.curahHujan);

    if (isNaN(brixValue) || brixValue < 0 || brixValue > 30) {
      errors.push("Nilai Brix harus antara 0-30");
    }

    if (
      isNaN(curahHujanValue) ||
      curahHujanValue < 0 ||
      curahHujanValue > 5000
    ) {
      errors.push("Nilai Curah Hujan harus antara 0-5000mm");
    }

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
    setIsConfirmModalOpen(true);
  };

  const handleCancelCalculate = () => {
    setIsConfirmModalOpen(false);
  };

  const handleCloseValidationModal = () => {
    setIsValidationModalOpen(false);
    setValidationErrors([]);
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
      pol,
      curahHujan,
    } = formData;

    const data = {
      blokKebun: blokKebun,
      jenis: Number.parseFloat(jenis),
      masaTanam: Number.parseFloat(masaTanam),
      varietas: Number.parseFloat(varietas),
      kemasakan: Number.parseFloat(kemasakan),
      brix: Number.parseFloat(brix),
      pol: Number.parseFloat(pol),
      curahHujan: Number.parseFloat(curahHujan),
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
    } catch (error) {
      console.error("Error submitting data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-green-800 mb-2">
              Input Data Rendemen Tebu
            </h1>
            <p className="text-xl text-green-600">
              Masukkan data rendemen tebu untuk analisis prediksi.
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
                  { value: "0", label: "Mandiri" },
                  { value: "1", label: "PC" },
                  { value: "2", label: "R1" },
                  { value: "3", label: "R2" },
                  { value: "4", label: "R3" },
                  { value: "5", label: "RC" },
                  { value: "6", label: "TRS I KM B" },
                  { value: "7", label: "TRS I KM C" },
                  { value: "8", label: "TRS I KM E" },
                  { value: "9", label: "TRS II KM B" },
                  { value: "10", label: "TRS II KM C" },
                  { value: "11", label: "TRS II KM D" },
                  { value: "12", label: "TRS II KM E" },
                  { value: "13", label: "TRS II KM K" },
                  { value: "14", label: "TRT I KM B" },
                  { value: "15", label: "TRT I KM K" },
                  { value: "16", label: "TRT II KM B" },
                  { value: "17", label: "TRT II KM C" },
                  { value: "18", label: "TRT II KM K" },
                  { value: "19", label: "TRT III KM C" },
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
                icon={<FaCalendarAlt className="text-green-500 text-2xl" />}
                label="Masa Tanam"
                name="masaTanam"
                value={formData.masaTanam}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Pilih Masa Tanam" },
                  { value: "1", label: "10A" },
                  { value: "2", label: "10B" },
                  { value: "3", label: "11A" },
                  { value: "4", label: "11B" },
                  { value: "5", label: "12A" },
                  { value: "6", label: "12B" },
                  { value: "7", label: "13A" },
                  { value: "8", label: "5A" },
                  { value: "9", label: "5B" },
                  { value: "10", label: "6A" },
                  { value: "11", label: "6B" },
                  { value: "12", label: "7A" },
                  { value: "13", label: "7B" },
                  { value: "14", label: "8A" },
                  { value: "15", label: "8B" },
                  { value: "16", label: "9A" },
                  { value: "17", label: "9B" },
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
                  { value: "1", label: "CENING" },
                  { value: "2", label: "GMP1" },
                  { value: "3", label: "GMP2" },
                  { value: "4", label: "GMP3" },
                  { value: "5", label: "KK" },
                  { value: "6", label: "KENTUNG" },
                  { value: "7", label: "LAMPUNG3" },
                  { value: "8", label: "PA8213" },
                  { value: "9", label: "PA8218" },
                  { value: "10", label: "PA822" },
                  { value: "11", label: "PA822 (KB II)" },
                  { value: "12", label: "PA828" },
                  { value: "13", label: "PA1301" },
                  { value: "14", label: "PA1303" },
                  { value: "15", label: "PA1401" },
                  { value: "16", label: "PA1601" },
                  { value: "17", label: "PA197" },
                  { value: "18", label: "PS851" },
                  { value: "19", label: "PS862" },
                  { value: "20", label: "PS864" },
                  { value: "21", label: "PS865" },
                  { value: "22", label: "PS881" },
                  { value: "23", label: "PS882" },
                  { value: "24", label: "PSJK922" },
                  { value: "25", label: "PSJT941" },
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
                icon={<FaVial className="text-green-500 text-2xl" />}
                label="Pol"
                name="pol"
                value={formData.pol}
                onChange={handleInputChange}
                placeholder="Masukkan nilai Pol"
                type="number"
              />
              <InputField
                icon={<FaCloudRain className="text-green-500 text-2xl" />}
                label="Curah Hujan"
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
                {isLoading ? "Menghitung..." : "Submit Data"}
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
      {isValidationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-2xl w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-6 text-red-800">
              Data Tidak Valid
            </h2>
            <div className="mb-8">
              <p className="text-xl text-red-600 mb-4">
                Terdapat nilai yang tidak sesuai:
              </p>
              <ul className="list-disc list-inside space-y-2">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-lg text-red-500">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseValidationModal}
                className="px-8 py-3 bg-blue-500 text-white rounded-full text-lg hover:bg-blue-600 transition duration-300"
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

const InputField = ({ icon, label, ...props }) => (
  <div>
    <label className="text-lg font-medium text-green-700 flex items-center mb-2">
      {icon}
      <span className="ml-2">{label}</span>
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
