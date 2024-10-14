"use client";

import { fetchData, postData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillEdit, AiFillPlusCircle } from "react-icons/ai";

export default function KinerjaPage() {
  const [sessions, setSessions] = useState([]); // State untuk menyimpan daftar sesi
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk menyimpan error jika ada
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal
  const [formData, setFormData] = useState({
    pabrik: "",
    periode: "", // Change this to store the selected year
    batasPengisian: "",
  });

  const fetchSessions = async () => {
    const cookie = getCookie("token");
    try {
      // Lakukan fetch ke API backend yang menampilkan daftar sesi
      const response = await fetchData("/api/sesi/daftar", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie}`, // Ambil token dari localStorage
        },
      });

      if (!response) {
        throw new Error("Gagal mengambil daftar sesi");
      }

      console.log("ini response sesi: ", response);

      setSessions(response.sesi); // Set data sesi dari API ke state
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log("ini data yang mau dikirim: ", JSON.stringify(formData));

    const token = getCookie("token");
    try {
      // Kirim data ke API untuk membuat sesi baru
      // await fetchData("/api/sesi", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      await postData("/api/sesi", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset form dan tutup modal
      setFormData({ pabrik: "", periode: "", batasPengisian: "" });
      setIsModalOpen(false);
      fetchSessions(); // Refresh sesi setelah menambah
    } catch (error) {
      console.error("Error creating session: ", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Jika terjadi error saat fetch data, tampilkan pesan error
  if (error) {
    return <p>{error}</p>;
  }

  // Generate an array of years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    years.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center gap-2 my-5">
        <AiFillPlusCircle
          className="text-2xl text-gray-500 cursor-pointer"
          onClick={() => setIsModalOpen(true)} // Buka modal saat tombol diklik
        />
        <h1 className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          Tambah Form Pengukuran Kinerja
        </h1>
      </div>
      <h1 className="text-2xl font-bold mb-6">Riwayat Pengisian Sesi</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Periode</th>
            <th className="py-2 px-4 border-b">Tanggal Mulai</th>
            <th className="py-2 px-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length === 0 ? (
            <tr>
              <td colSpan="3" className="py-2 px-4 border-b text-center">
                Tidak ada sesi yang tersedia
              </td>
            </tr>
          ) : (
            sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50 text-center">
                <td className="py-2 px-4 border-b">
                  {new Date(session.tanggalMulai).getFullYear()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(session.tanggalMulai).toLocaleDateString("id-ID")}
                </td>
                <td className="py-2 px-4">
                  <Link
                    className="text-black text-2xl p-2 rounded-lg justify-center flex"
                    href={`/kinerja/${session.id}/sumber-daya`}
                  >
                    <h1 className="bg-gray-400 p-2 rounded-lg">
                      <AiFillEdit />
                    </h1>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-1/3 relative">
            <h2 className="text-xl font-bold mb-4">
              Tambah Form Pengukuran Kinerja
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Pilihan Pabrik</label>
                <input
                  type="text"
                  name="pabrik"
                  value={formData.pabrik}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Masukkan pabrik"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Periode (Pilih Tahun)
                </label>
                <select
                  name="periode"
                  value={formData.periode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Pilih Tahun</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Batas Pengisian</label>
                <input
                  type="date"
                  name="batasPengisian"
                  value={formData.batasPengisian}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  onClick={() => setIsModalOpen(false)} // Close modal on cancel
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
