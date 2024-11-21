"use client";

import Skeleton from "@/components/common/Skeleton";
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
  const [sessions, setSessions] = useState([]); // State untuk menyimpan daftar sesi
  const [pabrikNames, setPabrikNames] = useState({});

  const [pabrikList, setPabrikList] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk loading
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
      setError(error.message); // Set error state
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
      // fetchSessions(); // Refresh sesi setelah menambah
    } catch (error) {
      console.error("Error creating session: ", error);
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

  if (error) {
    return <p>{error}</p>;
  }

  // Generate an array of years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 3; i <= currentYear + 1; i++) {
    years.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between gap-2 mb-8">
        <div className="flex gap-2">
          <AiFillPlusCircle
            className="text-2xl text-gray-500 cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Buka modal saat tombol diklik
          />
          <h1 className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
            Tambah Form Pengukuran Kinerja
          </h1>
        </div>

        <div className="flex justify-end font-bold gap-2 text-xl">
          <Link
            href={"/kinerja/statistics"}
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

              return (
                <tr key={session.id} className="hover:bg-gray-50 text-center">
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
                  <td className="py-2 px-4 border-b">
                    {session.InstrumenNilai.nilaiKinerja || "Belum Diisi"}
                  </td>
                  <td className={`py-2 px-4 border-b `}>
                    <div
                      className={`${
                        status === "BELUM SELESAI"
                          ? "bg-red-600 px-2 py-1 rounded-lg text-white"
                          : "bg-green-600 px-2 py-1 rounded-lg text-white"
                      }`}
                    >
                      <h1>{status}</h1>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center items-center gap-2 mx-auto">
                      <button
                        className="bg-gray-400 p-2 rounded-lg flex items-center justify-center hover:bg-gray-500"
                        onClick={() => {
                          setEditData({
                            id: session.id,
                            batasPengisian: session.batasPengisian,
                          });
                          setIsEditModalOpen(true);
                        }}
                      >
                        <AiFillEdit className="text-black" />
                      </button>
                      <Link
                        href={`/kinerja/${session.id}/sumber-daya`}
                        className="flex gap-2"
                      >
                        <button className="bg-gray-400 p-2 rounded-lg flex items-center justify-center hover:bg-gray-500">
                          <AiFillRead className="text-black" />
                        </button>
                      </Link>
                      <button
                        className="bg-red-500 p-2 rounded-lg flex items-center justify-center hover:bg-red-600 text-white"
                        onClick={() => handleDelete(session.id)}
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-1/3">
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
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${
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
          <div className="bg-white p-8 rounded-lg w-1/3 relative">
            <h2 className="text-xl font-bold mb-4">
              Tambah Form Pengukuran Kinerja
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Pilihan Pabrik</label>
                <select
                  name="pabrikId" // Mengganti nama menjadi pabrikId
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

                {/* Link untuk menambah pabrik baru */}
                {/* <Link
                  href="/admin/input-pabrik"
                  className="mt-2 inline-block text-blue-600 underline"
                >
                  Tambah Pabrik Baru
                </Link> */}
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
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  onClick={() => setIsModalOpen(false)} // Close modal on cancel
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${
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
    </div>
  );
}
