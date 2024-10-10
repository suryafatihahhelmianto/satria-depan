"use client";

import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";

export default function KinerjaPage() {
  const [sessions, setSessions] = useState([]); // State untuk menyimpan daftar sesi
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk menyimpan error jika ada

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

      console.log("ini response: ", response);
      console.log("ini data: ", response);
      if (!response) {
        throw new Error("Gagal mengambil daftar sesi");
      }

      setSessions(response.sesi); // Set data sesi dari API ke state
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-100">
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
    </div>
  );
}
