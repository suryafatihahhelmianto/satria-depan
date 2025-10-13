"use client";

import { useState } from "react";
import { postData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { CheckCircle2, Factory, Loader2, MapPin, XCircle } from "lucide-react";

export default function InputPabrikPage() {
  const [formData, setFormData] = useState({
    namaPabrik: "",
    kecamatanPabrik: "",
    kabupatenPabrik: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const token = getCookie("token");

    try {
      await postData("/api/pabrik", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setFormData({
        namaPabrik: "",
        kecamatanPabrik: "",
        kabupatenPabrik: "",
      });
    } catch (err) {
      setError(
        "Terjadi kesalahan saat menyimpan data pabrik. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Factory className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Input Data Pabrik Gula
          </h1>
          <p className="mt-2 text-gray-500">
            Masukkan informasi pabrik gula untuk menambahkan ke database
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleFormSubmit}
          className="bg-white shadow-md rounded-xl p-6 space-y-6"
        >
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 p-3 rounded-lg">
              <CheckCircle2 className="h-5 w-5" />
              <span>Data pabrik berhasil disimpan!</span>
            </div>
          )}

          {/* Nama Pabrik */}
          <div>
            <label
              htmlFor="namaPabrik"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Pabrik
            </label>
            <div className="relative mt-1">
              <Factory className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="namaPabrik"
                type="text"
                name="namaPabrik"
                value={formData.namaPabrik}
                onChange={handleInputChange}
                placeholder="Contoh: PG Madukismo"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Kecamatan */}
          <div>
            <label
              htmlFor="kecamatanPabrik"
              className="block text-sm font-medium text-gray-700"
            >
              Kecamatan
            </label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="kecamatanPabrik"
                type="text"
                name="kecamatanPabrik"
                value={formData.kecamatanPabrik}
                onChange={handleInputChange}
                placeholder="Contoh: Kasihan"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Kabupaten */}
          <div>
            <label
              htmlFor="kabupatenPabrik"
              className="block text-sm font-medium text-gray-700"
            >
              Kabupaten
            </label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="kabupatenPabrik"
                type="text"
                name="kabupatenPabrik"
                value={formData.kabupatenPabrik}
                onChange={handleInputChange}
                placeholder="Contoh: Bantul"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Simpan Data Pabrik
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Pastikan semua informasi yang dimasukkan sudah benar sebelum menyimpan
        </p>
      </div>
    </div>
  );
}
