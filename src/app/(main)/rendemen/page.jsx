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
import Skeleton from "@/components/common/Skeleton";
import { getCookie } from "@/tools/getCookie";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import { useUser } from "@/context/UserContext";

export default function RendemenPage() {
  const { role, isAdmin } = useUser();
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

  const fetchCSVData = async () => {
    try {
      // Panggil API untuk mendapatkan data JSON
      const csvResponse = await fetchData("/api/rendemen/csv", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      const rendemenData = await csvResponse.data;

      // Konversi data JSON ke format CSV
      const headers = [
        "Tanggal Prediksi",
        "Nama Pabrik",
        "Blok Kebun",
        "Brix",
        "FK",
        "HK",
        "NN",
        "Pol",
        "Nilai Prediksi Rendemen",
      ];

      // Format baris data
      const rows = rendemenData.map((item) => [
        new Date(item.tanggal).toLocaleDateString("id-ID"), // Format tanggal
        item.namaPabrik || "Tidak diketahui", // Nama pabrik
        item.blokKebun, // Blok kebun
        item.brix, // Nilai Brix
        item.fk, // Nilai FK
        item.hk, // Nilai HK
        item.nn, // Nilai NN
        item.pol, // Nilai Pol
        item.nilaiPrediksiRendemen, // Nilai prediksi rendemen
      ]);

      // Gabungkan header dengan data
      const csvContent = [headers.join(",")] // Gabungkan header dengan koma
        .concat(rows.map((row) => row.join(","))) // Gabungkan setiap baris data
        .join("\n"); // Gabungkan semua baris dengan newline

      // Buat file Blob CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Buat elemen <a> untuk mengunduh file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "data_rendemen.csv"); // Nama file CSV
      document.body.appendChild(link);
      link.click(); // Klik otomatis
      document.body.removeChild(link); // Hapus elemen setelah unduhan
    } catch (error) {
      console.error("Error saat mengunduh data CSV:", error);
      alert("Gagal mengunduh data CSV.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const token = getCookie("token");
        await fetchData(`/api/rendemen/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchSessions(); // Refresh data setelah penghapusan
      } catch (err) {
        console.error("Gagal menghapus data rendemen:", err);
        alert("Gagal menghapus data");
      }
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
          <AiFillPlusCircle className="text-2xl text-green-800 hover:text-green-900 cursor-pointer" />
          <h1 className="cursor-pointer hover:text-green-600 rounded-s">
            Tambah Prediksi Rendemen
          </h1>
        </Link>
        <div className="flex justify-end font-bold gap-2 text-xl">
          <Link
            href={"/rendemen/statistics"}
            className="bg-green-800 hover:bg-green-900 text-white hover:cursor-pointer p-2 rounded-lg flex items-center"
          >
            <AiOutlineLineChart />
          </Link>
          <button
            className="flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white hover:cursor-pointer p-2 rounded-lg"
            onClick={fetchCSVData}
          >
            <p className="text-sm">Unduh</p>
            <AiOutlineDownload />
          </button>
        </div>
      </div>

      {loading ? (
        <div>
          <Skeleton rows={4} />
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border">
          <table className="min-w-full  border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-ijoWasis to-ijoDash text-white">
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
                    className="hover:bg-gray-200 text-center"
                  >
                    <td className="py-2 px-4 border-b">
                      {session.pabrikGula.namaPabrik}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(session.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-2 px-4 border-b">{session.blokKebun}</td>
                    <td className="py-2 px-4 border-b">
                      {formatNumberToIndonesian(session.nilaiRendemen)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <div className="flex justify-center items-center gap-2 mx-auto">
                        <Link
                          className="flex gap-2"
                          href={`/rendemen/${session.id}`}
                        >
                          <button className="bg-blue-300 p-2 rounded-lg flex items-center justify-center hover:bg-blue-500">
                            <AiOutlineSearch />
                          </button>
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(session.id)}
                            className="bg-red-500 p-2 rounded-lg flex items-center justify-center hover:bg-red-600 text-white"
                          >
                            <AiFillDelete />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
