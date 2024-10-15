"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillPlusCircle,
  AiFillRead,
} from "react-icons/ai";

export default function RendemenPage() {
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk menyimpan error jika ada
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal
  const [formData, setFormData] = useState({
    pabrik: "",
    periode: "", // Change this to store the selected year
    batasPengisian: "",
  });

  const sessions = [
    { id: 1, periode: "2023", batasPengisian: "16/07/2024" },
    { id: 2, periode: "2022", batasPengisian: "17/07/2024" },
    { id: 3, periode: "2021", batasPengisian: "18/07/2024" },
    { id: 4, periode: "2020", batasPengisian: "19/07/2024" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center gap-2 my-5">
        <AiFillPlusCircle
          className="text-2xl text-gray-500 cursor-pointer"
          onClick={() => setIsModalOpen(true)} // Buka modal saat tombol diklik
        />
        <h1 className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          Tambah Form Pengukuran Rendemen
        </h1>
      </div>
      <h1 className="text-2xl font-bold mb-6">Riwayat Pengisian Sesi</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Pabrik</th>
            <th className="py-2 px-4 border-b">Periode</th>
            <th className="py-2 px-4 border-b">Batas Pengisian</th>
            <th className="py-2 px-4 border-b">Nilai Kinerja (%)</th>
            <th className="py-2 px-4 border-b">Status</th>
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
                <td className="py-2 px-4 border-b">{session.pabrik}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(session.tanggalMulai).getFullYear()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(session.tanggalSelesai).toLocaleDateString("id-ID")}
                </td>
                <td className="py-2 px-4 border-b">{}</td>
                <td className="py-2 px-4 border-b">{}</td>
                <td className="py-2 px-4">
                  <Link
                    className="text-black text-2xl p-2 rounded-lg justify-center flex gap-2"
                    href={`/kinerja/${session.id}/sumber-daya`}
                  >
                    <h1 className="bg-gray-400 p-2 rounded-lg">
                      <AiFillEdit />
                    </h1>
                    <h1 className="bg-gray-400 p-2 rounded-lg">
                      <AiFillRead />
                    </h1>
                    <h1 className="bg-gray-400 p-2 rounded-lg">
                      <AiFillDelete />
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
