"use client";

import { useState } from "react";
import { postData } from "@/tools/api"; // Pastikan postData sesuai dengan API Anda
import { getCookie } from "@/tools/getCookie"; // Mengambil token dari cookie

export default function InputPabrikPage() {
  const [formData, setFormData] = useState({
    namaPabrik: "",
    kecamatanPabrik: "",
    kabupatenPabrik: "",
  });

  const [error, setError] = useState(null); // Untuk menyimpan error
  const [success, setSuccess] = useState(false); // Untuk menyimpan status sukses

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token"); // Mengambil token untuk autentikasi

    try {
      await postData("/api/pabrik", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setError(null);
      // Reset form setelah sukses
      setFormData({
        namaPabrik: "",
        kecamatanPabrik: "",
        kabupatenPabrik: "",
      });
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan data pabrik");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold mb-6">Input Pabrik Gula</h1>
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4">Data pabrik berhasil disimpan!</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Nama Pabrik</label>
          <input
            type="text"
            name="namaPabrik"
            value={formData.namaPabrik}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Kecamatan</label>
          <input
            type="text"
            name="kecamatanPabrik"
            value={formData.kecamatanPabrik}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Kabupaten</label>
          <input
            type="text"
            name="kabupatenPabrik"
            value={formData.kabupatenPabrik}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
