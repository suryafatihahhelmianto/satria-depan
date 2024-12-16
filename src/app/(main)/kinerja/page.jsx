"use client";

import Skeleton from "@/components/common/Skeleton";
import { useUser } from "@/context/UserContext";
import { fetchData, postData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillPlusCircle,
  AiFillRead,
  AiOutlineDownload,
  AiOutlineLineChart,
} from "react-icons/ai";

export default function KinerjaPage() {
  const { isAdmin } = useUser();
  const [sessions, setSessions] = useState([]); // State untuk menyimpan daftar sesi
  const [pabrikNames, setPabrikNames] = useState({});

  const [pabrikList, setPabrikList] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk loading

  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [error, setError] = useState(null); // State untuk menyimpan error jika ada

  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal edit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pabrikId: 0, // Menggunakan pabrikId untuk menghubungkan sesi dengan pabrik
    periode: "",
    batasPengisian: "",
  });

  const [editData, setEditData] = useState({
    id: null,
    batasPengisian: "",
  });

  const fetchSessionAndPabrikNames = async () => {
    const cookie = getCookie("token");
    try {
      const response = await fetchData("/api/sesi/daftar", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });

      if (response) {
        setSessions(response.sesi);

        // Ambil nama pabrik untuk setiap sesi
        const pabrikPromises = response.sesi.map(async (session) => {
          const pabrikResponse = await fetchData(
            `/api/pabrik/${session.pabrikGulaId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${cookie}`,
              },
            }
          );
          return {
            id: session.pabrikGulaId,
            nama: pabrikResponse.namaPabrik, // Sesuaikan dengan struktur response
          };
        });

        const pabrikData = await Promise.all(pabrikPromises);

        // Simpan hasil nama pabrik ke state
        const names = {};
        pabrikData.forEach((pabrik) => {
          names[pabrik.id] = pabrik.nama;
        });
        setPabrikNames(names);
      }
    } catch (error) {
      console.error("Error fetching session and pabrik names: ", error);
      setError(error.response.data.message); // Set error state
    } finally {
      setLoading(false); // Set loading to false in the finally block
    }
  };

  const fetchPabrikList = async () => {
    const cookie = getCookie("token");
    try {
      const response = await fetchData("/api/pabrik", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });

      if (!response) {
        throw new Error("Gagal mengambil daftar pabrik");
      }

      setPabrikList(response); // Simpan daftar pabrik ke state
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCSVKinerja = async () => {
    try {
      const csvResponse = await fetchData("/api/sesi/csv", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      console.log("csv response: ", csvResponse);

      const kinerjaData = await csvResponse.data;

      const headers = [
        "Nama Pabrik",
        "Periode",
        "Nilai Dimensi Ekonomi",
        "Nilai Dimensi Lingkungan",
        "Nilai Dimensi Sosial",
        "Nilai Dimensi SDAM",
        "Nilai Indeks Kinerja",
        "Status Pengisian",
      ];

      const rows = kinerjaData.map((item) => [
        item.namaPabrik || "Tidak diketahui", // Nama pabrik
        item.periode,
        item.nilaiDimensiEkonomi,
        item.nilaiDimensiLingkungan,
        item.nilaiDimensiSosial,
        item.nilaiDimensiSDAM,
        item.nilaiIndeksKinerja,
        item.status,
      ]);

      const csvContent = [headers.join(",")] // Gabungkan header dengan koma
        .concat(rows.map((row) => row.join(","))) // Gabungkan setiap baris data
        .join("\n"); // Gabungkan semua baris dengan newline

      // Buat file Blob CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Buat elemen <a> untuk mengunduh file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "data_kinerja.csv"); // Nama file CSV
      document.body.appendChild(link);
      link.click(); // Klik otomatis
      document.body.removeChild(link); // Hapus elemen setelah unduhan
    } catch (error) {
      console.error("Error saat mengunduh data CSV:", error);
      alert("Gagal mengunduh data CSV.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = getCookie("token");
    try {
      await postData("/api/sesi", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset form dan tutup modal
      setFormData({ pabrikId: 0, periode: "", batasPengisian: "" });
      setIsModalOpen(false);
      fetchSessionAndPabrikNames();
      setSuccess("Sesi Pengisian berhasil dibuat");
      // fetchSessions(); // Refresh sesi setelah menambah
    } catch (error) {
      console.error("Error creating session: ", error);
      setError(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = getCookie("token");
    try {
      await fetchData(
        `/api/sesi/${editData.id}`,

        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          data: { batasPengisian: editData.batasPengisian },
        }
      );

      setEditData({ id: null, batasPengisian: "" });
      setIsEditModalOpen(false);
      fetchSessionAndPabrikNames();
    } catch (error) {
      console.error("Error updating session: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const token = getCookie("token");

    // Konfirmasi penghapusan
    if (confirm("Apakah Anda yakin ingin menghapus sesi ini?")) {
      try {
        // Panggil API delete untuk sesi
        await fetchData(`/api/sesi/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Refresh daftar sesi setelah penghapusan berhasil
        fetchSessionAndPabrikNames();
        alert("Sesi berhasil dihapus");
      } catch (error) {
        console.error("Error deleting session: ", error);
        alert("Gagal menghapus sesi");
      }
    }
  };

  useEffect(() => {
    // fetchSessions();
    fetchSessionAndPabrikNames();
    fetchPabrikList();
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton rows={3} />
      </div>
    );
  }

  // if (error) {
  //   return <p>{error}</p>;
  // }

  // Generate an array of years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 3; i <= currentYear + 1; i++) {
    years.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between gap-2 mb-8">
        <div className="flex items-center gap-1 p-4 w-full max-w-sm hover:bg-gray-100 hover:rounded-lg hover:shadow-md transition-all">
          {isAdmin && (
            <div className="flex w-full gap-2">
              <AiFillPlusCircle
                className="text-2xl text-green-800 hover:text-green-900 cursor-pointer"
                onClick={() => setIsModalOpen(true)} // Buka modal saat tombol diklik
              />
              <h1
                className="cursor-pointer hover:text-green-900"
                onClick={() => setIsModalOpen(true)}
              >
                Tambah Form Pengukuran Kinerja
              </h1>
            </div>
          )}
        </div>

        <div className="flex w-full justify-end font-bold gap-2 text-xl">
          <Link
            href={"/kinerja/statistics"}
            className="gap-2 bg-green-800 hover:bg-green-900 hover:cursor-pointer text-white p-2 rounded-lg flex items-center"
          >
            <p className="text-sm">Lihat Trend</p>
            <AiOutlineLineChart />
          </Link>
          <button
            className="flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white hover:cursor-pointer p-2 rounded-lg"
            onClick={fetchCSVKinerja}
          >
            <p className="text-sm">Unduh</p>
            <AiOutlineDownload />
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 flex items-center space-x-2">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md">
            <p className="font-bold">{success}</p>
            {/* <p>Your operation was successful!</p> */}
          </div>
        </div>
      )}
      <div className="overflow-x-auto shadow-lg rounded-lg border">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-ijoWasis to-ijoDash text-white">
              <th className="py-2 px-4 border-b">Pabrik</th>
              <th className="py-2 px-4 border-b">Periode</th>
              <th className="py-2 px-4 border-b">Batas Pengisian</th>
              {/* <th className="py-2 px-4 border-b">Nilai Kinerja (%)</th> */}
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-2 px-4 border-b text-center">
                  Tidak ada sesi yang tersedia
                </td>
              </tr>
            ) : (
              sessions.map((session) => {
                const today = new Date();
                const batasPengisian = new Date(session.tanggalSelesai);
                const status =
                  today > batasPengisian ? "SELESAI" : "BELUM SELESAI";

                const statusPengisian =
                  session.status === "FINAL" ? "SELESAI" : "BELUM SELESAI";

                return (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-200 text-center"
                  >
                    <td className="py-2 px-4 border-b">
                      {pabrikNames[session.pabrikGulaId] ||
                        "Nama Pabrik Tidak Ditemukan"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(session.tanggalMulai).getFullYear()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {batasPengisian.toLocaleDateString("id-ID")}
                    </td>
                    {/* <td className="py-2 px-4 border-b">
                    {session.InstrumenNilai.nilaiKinerja || "Belum Diisi"}
                  </td> */}
                    <td className={`py-2 px-4 border-b `}>
                      <div
                        className={`${
                          session.status === "BELUM_FINAL"
                            ? "bg-red-600 px-2 py-1 rounded-lg text-white"
                            : "bg-green-600 px-2 py-1 rounded-lg text-white"
                        }`}
                        // className={`${
                        //   status === "BELUM SELESAI"
                        //     ? "bg-red-600 px-2 py-1 rounded-lg text-white"
                        //     : "bg-green-600 px-2 py-1 rounded-lg text-white"
                        // }`}
                      >
                        {/* <h1>{status}</h1> */}
                        {/* <h1>{session.status}</h1> */}
                        <h1>{statusPengisian}</h1>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <div className="flex justify-center items-center gap-2 mx-auto ">
                        <div className="relative group">
                          {isAdmin && (
                            <button
                              className="bg-yellow-400 p-2 rounded-lg flex items-center justify-center hover:bg-yellow-500"
                              onClick={() => {
                                setEditData({
                                  id: session.id,
                                  batasPengisian: session.batasPengisian,
                                });
                                setIsEditModalOpen(true);
                              }}
                            >
                              <AiFillEdit className="text-white" />
                            </button>
                          )}
                          {isAdmin && (
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Edit
                            </span>
                          )}
                        </div>

                        <div className="relative group">
                          <Link
                            href={`/kinerja/${session.id}/sumber-daya`}
                            className="flex gap-2"
                          >
                            <button className="bg-blue-400 p-2 rounded-lg flex items-center justify-center hover:bg-blue-500">
                              <AiFillRead className="text-white" />
                            </button>
                          </Link>
                          {isAdmin && (
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Detail
                            </span>
                          )}
                        </div>

                        <div className="relative group">
                          {isAdmin && (
                            <button
                              className="bg-red-500 p-2 rounded-lg flex items-center justify-center hover:bg-red-600 text-white"
                              onClick={() => handleDelete(session.id)}
                            >
                              <AiFillDelete />
                            </button>
                          )}
                          {isAdmin && (
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Hapus
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit Component */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-screen-sm mx-4">
            <h2 className="text-xl font-bold mb-4">Edit Batas Pengisian</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Batas Pengisian</label>
                <input
                  type="date"
                  name="batasPengisian"
                  value={editData.batasPengisian}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  min={(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split("T")[0];
                  })()} // Hitung tanggal minimal "besok"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 ${
                    isSubmitting ? "bg-gray-500" : "bg-green-600"
                  } text-white`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-screen-sm mx-4">
            <h2 className="text-xl font-bold mb-4">
              Tambah Form Pengukuran Kinerja
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Pilihan Pabrik</label>
                <select
                  name="pabrikId"
                  value={formData.pabrikId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Pilih Pabrik</option>
                  {pabrikList?.length > 0 ? (
                    pabrikList.map((pabrik) => (
                      <option key={pabrik.id} value={pabrik.id}>
                        {pabrik.namaPabrik}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Tidak ada pabrik tersedia
                    </option>
                  )}
                </select>
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
                  className="px-4 py-2 bg-red-500 hover:bg-red-600  text-white rounded-lg"
                  onClick={() => setIsModalOpen(false)} // Close modal on cancel
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg hover:bg-green-700 ${
                    isSubmitting ? "bg-gray-500" : "bg-green-600"
                  } text-white`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
            {error && (
              <div className="mb-4 flex items-center space-x-2 mt-4">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
                  <p className="font-bold">{error}</p>
                  {/* <p>Something went wrong. Please try again.</p> */}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
