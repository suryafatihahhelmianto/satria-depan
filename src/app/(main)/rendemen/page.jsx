"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchData } from "../../../tools/api";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillPlusCircle,
  AiFillRead,
  AiOutlineDownload,
  AiOutlineLineChart,
  AiOutlineSearch,
} from "react-icons/ai";

export default function RendemenPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]); // State untuk menyimpan data sesi

  // Fungsi untuk mem-fetch data dari API
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      const response = await fetchData("/api/rendemen/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.data;

      console.log("ini data rendemen: ", data);
      setSessions(data); // Simpan data dari API ke state sessions
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(); // Panggil fungsi fetchSessions saat komponen di-mount
  }, []);

  // Render tampilan
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between mb-8">
        <Link href={"/rendemen/input"} className="flex items-center gap-2">
          <AiFillPlusCircle className="text-2xl text-gray-500 cursor-pointer" />
          <h1 className="cursor-pointer">Tambah Prediksi Rendemen</h1>
        </Link>
        <div className="flex justify-end font-bold gap-2 text-xl">
          <Link
            href={"/rendemen/statistics"}
            className="bg-gray-400 p-2 rounded-lg flex items-center"
          >
            <AiOutlineLineChart />
          </Link>
          <div className="flex items-center gap-2 bg-gray-400 p-2 rounded-lg">
            <p>Unduh</p>
            <AiOutlineDownload />
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Pabrik</th>
              <th className="py-2 px-4 border-b">Tanggal Prediksi</th>
              <th className="py-2 px-4 border-b">Blok Kebun</th>
              <th className="py-2 px-4 border-b">Nilai Prediksi (%)</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-2 px-4 border-b text-center">
                  Tidak ada data rendemen yang tersedia
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr
                  key={session.tanggal}
                  className="hover:bg-gray-50 text-center"
                >
                  <td className="py-2 px-4 border-b">
                    {session.pabrikGula.namaPabrik}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(session.tanggal).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-2 px-4 border-b">{session.blokKebun}</td>
                  <td className="py-2 px-4 border-b">
                    {session.nilaiRendemen}
                  </td>
                  <td className="py-2 px-4">
                    <Link
                      className="text-black text-2xl p-2 rounded-lg justify-center flex gap-2"
                      href={`/rendemen/${session.id}`}
                    >
                      <h1 className="bg-gray-400 p-2 rounded-lg">
                        <AiOutlineSearch />
                      </h1>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
