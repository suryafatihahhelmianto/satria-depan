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
  const [sessions, setSessions] = useState([]);
  const [pabrikNames, setPabrikNames] = useState({});
  const [pabrikList, setPabrikList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 🔽 State untuk filter pabrik
  const [selectedPabrik, setSelectedPabrik] = useState("semua");

  // 🔽 State untuk loading modal dengan animasi
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("");
  const [loadingMessages] = useState([
    "Menyiapkan data...",
    "Membangun template formulir...",
    "Menyusun komponen...",
    "Menginisialisasi validasi...",
    "Menyalakan mesin learning...",
    "Mempersiapkan antarmuka...",
    "Hampir selesai...",
  ]);

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 3; i <= currentYear + 1; i++) {
    years.push(i);
  }

  const [formData, setFormData] = useState({
    pabrikId: 0,
    periode: "",
    batasPengisian: "",
  });

  const [editData, setEditData] = useState({
    id: null,
    batasPengisian: "",
  });

  // 🔽 State untuk sorting
  const [sortField, setSortField] = useState("periode");
  const [sortOrder, setSortOrder] = useState("desc");

  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // ✅ Fungsi untuk menampilkan loading dengan animasi
  const startLoadingAnimation = () => {
    setIsLoadingModalOpen(true);
    setLoadingProgress(0);

    // Simulasi progress dengan interval
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Update loading step secara acak (simulasi)
    const stepInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setLoadingStep(loadingMessages[randomIndex]);
    }, 800);

    // Simpan interval untuk cleanup
    return { progressInterval: interval, stepInterval };
  };

  const stopLoadingAnimation = () => {
    setIsLoadingModalOpen(false);
    setLoadingProgress(100);
    setTimeout(() => {
      setLoadingProgress(0);
    }, 300);
  };

  // ✅ Ambil data sesi dan nama pabrik
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
        const sortedSessions = response.sesi.sort(
          (a, b) =>
            new Date(b.tanggalMulai).getFullYear() -
            new Date(a.tanggalMulai).getFullYear()
        );
        setSessions(sortedSessions);

        const pabrikPromises = sortedSessions.map(async (session) => {
          const pabrikResponse = await fetchData(
            `/api/pabrik/${session.pabrikGulaId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${cookie}`,
              },
            }
          );
          return { id: session.pabrikGulaId, nama: pabrikResponse.namaPabrik };
        });

        const pabrikData = await Promise.all(pabrikPromises);
        const names = {};
        pabrikData.forEach((pabrik) => {
          names[pabrik.id] = pabrik.nama;
        });
        setPabrikNames(names);
      }
    } catch (error) {
      console.error("Error fetching session and pabrik names: ", error);
      setError(
        error.response?.data?.message || "Terjadi kesalahan saat mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPabrikList = async () => {
    const cookie = getCookie("token");
    try {
      const response = await fetchData("/api/pabrik", {
        method: "GET",
        headers: { Authorization: `Bearer ${cookie}` },
      });
      if (!response) throw new Error("Gagal mengambil daftar pabrik");
      setPabrikList(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCSVKinerja = async () => {
    try {
      // Start loading animation
      const intervals = startLoadingAnimation();
      setLoadingStep("Menyiapkan data CSV...");

      const csvResponse = await fetchData("/api/sesi/csv", {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      const kinerjaData = await csvResponse.data;

      setLoadingStep("Membangun struktur CSV...");
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
        item.namaPabrik || "Tidak diketahui",
        item.periode,
        item.nilaiDimensiEkonomi,
        item.nilaiDimensiLingkungan,
        item.nilaiDimensiSosial,
        item.nilaiDimensiSDAM,
        item.nilaiIndeksKinerja,
        item.status,
      ]);

      setLoadingStep("Membuat file CSV...");
      const csvContent = [headers.join(",")]
        .concat(rows.map((row) => row.join(",")))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "data_kinerja.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      stopLoadingAnimation();
    } catch (error) {
      console.error("Error saat mengunduh data CSV:", error);
      stopLoadingAnimation();
      alert("Gagal mengunduh data CSV.");
    }
  };

  const fetchExcelKinerja = async () => {
    try {
      // Start loading animation
      const intervals = startLoadingAnimation();
      setLoadingStep("Menyiapkan data Excel...");

      const excelResponse = await fetchData("/api/sesi/csv", {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      const kinerjaData = excelResponse.data;

      setLoadingStep("Membangun struktur XML Excel...");
      const xmlHeader = `<?xml version="1.0"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
                xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:x="urn:schemas-microsoft-com:office:excel"
                xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
        <Worksheet ss:Name="Kinerja"><Table>`;

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
      const headerRow =
        `<Row>` +
        headers
          .map((h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`)
          .join("") +
        `</Row>`;

      setLoadingStep("Memproses data baris...");
      const dataRows = kinerjaData
        .map((item) => {
          const cells = [
            item.namaPabrik || "Tidak diketahui",
            item.periode,
            item.nilaiDimensiEkonomi,
            item.nilaiDimensiLingkungan,
            item.nilaiDimensiSosial,
            item.nilaiDimensiSDAM,
            item.nilaiIndeksKinerja,
            item.status,
          ].map(
            (value) =>
              `<Cell><Data ss:Type="${
                typeof value === "number" ? "Number" : "String"
              }">${value}</Data></Cell>`
          );
          return `<Row>${cells.join("")}</Row>`;
        })
        .join("");

      setLoadingStep("Membuat file Excel...");
      const xmlFooter = `</Table></Worksheet></Workbook>`;
      const xmlContent = xmlHeader + headerRow + dataRows + xmlFooter;

      const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "data_kinerja.xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      stopLoadingAnimation();
    } catch (error) {
      console.error("Error saat mengunduh data Excel XML:", error);
      stopLoadingAnimation();
      alert("Gagal mengunduh data Excel XML.");
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

  const handleDetailClick = (session) => {
    const batas = new Date(session.tanggalSelesai);
    const sekarang = new Date();

    if (sekarang > batas) {
      setSelectedSession(session);
      setShowDeadlineModal(true);
    } else {
      // Jika belum lewat, langsung buka halaman detail
      window.location.href = `/kinerja/${session.id}/sumber-daya`;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Start loading animation
    const intervals = startLoadingAnimation();
    setLoadingStep("Menyimpan formulir pengukuran kinerja...");

    setIsSubmitting(true);
    const token = getCookie("token");
    try {
      setLoadingStep("Mengirim data ke server...");
      await postData("/api/sesi", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLoadingStep("Memperbarui data tampilan...");
      setFormData({ pabrikId: 0, periode: "", batasPengisian: "" });
      setIsModalOpen(false);
      await fetchSessionAndPabrikNames();

      setSuccess("Sesi Pengisian berhasil dibuat");
      stopLoadingAnimation();
    } catch (error) {
      console.error("Error creating session: ", error);
      setError(error.response?.data?.message);
      stopLoadingAnimation();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Start loading animation
    const intervals = startLoadingAnimation();
    setLoadingStep("Memperbarui batas pengisian...");

    setIsSubmitting(true);

    const token = getCookie("token");
    try {
      setLoadingStep("Mengirim permintaan update...");
      await fetchData(`/api/sesi/${editData.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        data: { batasPengisian: editData.batasPengisian },
      });

      setLoadingStep("Memperbarui data lokal...");
      setSessions((prev) =>
        prev.map((item) =>
          item.id === editData.id
            ? { ...item, batasPengisian: editData.batasPengisian }
            : item
        )
      );

      setEditData({ id: null, batasPengisian: "" });
      setIsEditModalOpen(false);
      await fetchSessionAndPabrikNames();

      setLoadingStep("Selesai!");
      setSuccess("Batas pengisian berhasil diperbarui!");
      stopLoadingAnimation();
    } catch (error) {
      console.error("Error updating session: ", error);
      stopLoadingAnimation();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleDelete = async (id) => {
    const token = getCookie("token");
    if (confirm("Apakah Anda yakin ingin menghapus sesi ini?")) {
      // Start loading animation
      const intervals = startLoadingAnimation();
      setLoadingStep("Menghapus sesi pengisian...");

      try {
        await fetchData(`/api/sesi/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        setLoadingStep("Memperbarui tampilan...");
        await fetchSessionAndPabrikNames();

        setLoadingStep("Selesai!");
        alert("Sesi berhasil dihapus");
        stopLoadingAnimation();
      } catch (error) {
        console.error("Error deleting session: ", error);
        stopLoadingAnimation();
        alert("Gagal menghapus sesi");
      }
    }
  };

  // 🔽 Fungsi sorting
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...sessions].sort((a, b) => {
      if (field === "periode") {
        const aYear = new Date(a.tanggalMulai).getFullYear();
        const bYear = new Date(b.tanggalMulai).getFullYear();
        return order === "asc" ? aYear - bYear : bYear - aYear;
      } else if (field === "pabrik") {
        const nameA = (pabrikNames[a.pabrikGulaId] || "").toLowerCase();
        const nameB = (pabrikNames[b.pabrikGulaId] || "").toLowerCase();
        return order === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });

    setSessions(sorted);
  };

  // Fungsi untuk membuka modal dengan loading
  const openCreateModalWithLoading = () => {
    // Start loading animation
    const intervals = startLoadingAnimation();
    setLoadingStep("Menyiapkan formulir pengukuran kinerja...");

    // Simulasi loading selama 1.5 detik sebelum membuka modal
    setTimeout(() => {
      stopLoadingAnimation();
      setIsModalOpen(true);
    }, 1500);
  };

  useEffect(() => {
    fetchSessionAndPabrikNames();
    fetchPabrikList();
  }, []);

  if (loading) return <Skeleton rows={3} />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tombol atas: Lihat Trend, Download, dll */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-3xl font-semibold text-green-700">
          Rekapitulasi Perhitungan Kinerja
        </h1>
        <div className="flex items-center font-bold gap-2 text-xl">
          <Link
            href="/kinerja/statistics"
            className="gap-2 bg-green-800 hover:bg-green-900 hover:cursor-pointer text-white p-2 rounded-lg flex items-center"
          >
            <p className="text-sm">Lihat Trend</p>
            <AiOutlineLineChart />
          </Link>

          <button
            className="flex items-center gap-2 bg-green-800 hover:bg-green-900 hover:cursor-pointer text-white p-2 rounded-lg"
            onClick={fetchCSVKinerja}
          >
            <p className="text-sm">Unduh CSV</p>
            <AiOutlineDownload />
          </button>

          <button
            className="flex items-center gap-2 bg-green-800 hover:bg-green-900 hover:cursor-pointer text-white p-2 rounded-lg"
            onClick={fetchExcelKinerja}
          >
            <p className="text-sm">Unduh XLS</p>
            <AiOutlineDownload />
          </button>
        </div>
      </div>

      {/* Bar bawah: Filter + Tambah Form */}
      <div className="flex items-center justify-between mt-3 mb-3">
        {/* Filter Pabrik */}
        <div className="flex items-center gap-3 ml-1">
          <label htmlFor="filterPabrik" className="font-semibold text-gray-700">
            Filter Pabrik:
          </label>
          <select
            id="filterPabrik"
            value={selectedPabrik}
            onChange={(e) => setSelectedPabrik(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="semua">Semua Pabrik</option>
            {Object.entries(pabrikNames).map(([id, nama]) => (
              <option key={id} value={id}>
                {nama}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Tambah Pengukuran */}
        {isAdmin && (
          <div className="flex justify-end mr-1">
            <button
              onClick={openCreateModalWithLoading}
              className="flex items-center gap-2 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:rounded-xl border-green-800 rounded-md p-2 hover:border-green-900"
            >
              <AiFillPlusCircle className="text-2xl text-green-800 hover:text-green-900 cursor-pointer" />
              <h1 className="cursor-pointer hover:text-green-600">
                Tambah Form Pengukuran Kinerja
              </h1>
            </button>
          </div>
        )}
      </div>

      {/* ✅ Notifikasi Sukses */}
      {success && (
        <div className="mb-4 flex items-center space-x-2">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md">
            <p className="font-bold">{success}</p>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {isLoadingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Sedang Memproses...
              </h2>
              <p className="text-gray-600 mb-6">{loadingStep}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-700 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Loading Messages Animation */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center space-x-2 animate-pulse">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Harap tunggu sebentar, proses sedang berjalan...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* tabel utama */}
      <div className="overflow-x-auto shadow-lg rounded-lg border">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-ijoWasis to-ijoDash text-white">
              <th
                className="py-2 px-4 border-b cursor-pointer hover:bg-green-700"
                onClick={() => handleSort("pabrik")}
              >
                Pabrik{" "}
                {sortField === "pabrik" && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer hover:bg-green-700"
                onClick={() => handleSort("periode")}
              >
                Periode{" "}
                {sortField === "periode" && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th className="py-2 px-4 border-b">Batas Pengisian</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {sessions.filter(
              (session) =>
                selectedPabrik === "semua" ||
                String(session.pabrikGulaId) === String(selectedPabrik)
            ).length === 0 ? (
              <tr>
                <td colSpan="6" className="py-2 px-4 border-b text-center">
                  Tidak ada sesi untuk pabrik ini
                </td>
              </tr>
            ) : (
              sessions
                .filter(
                  (session) =>
                    selectedPabrik === "semua" ||
                    String(session.pabrikGulaId) === String(selectedPabrik)
                )
                .map((session) => {
                  const batasPengisian = new Date(session.tanggalSelesai);
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
                      <td className="py-2 px-4 border-b">
                        <div
                          className={`${
                            session.status === "BELUM_FINAL"
                              ? "bg-red-600 px-2 py-1 rounded-lg text-white"
                              : "bg-green-600 px-2 py-1 rounded-lg text-white"
                          }`}
                        >
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
                                  // Start loading animation for edit
                                  const intervals = startLoadingAnimation();
                                  setLoadingStep("Menyiapkan form edit...");

                                  setTimeout(() => {
                                    stopLoadingAnimation();
                                    setEditData({
                                      id: session.id,
                                      batasPengisian: session.batasPengisian,
                                    });
                                    setIsEditModalOpen(true);
                                  }, 1000);
                                }}
                              >
                                <AiFillEdit className="text-white" />
                              </button>
                            )}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Edit
                            </span>
                          </div>

                          <div className="relative group">
                            <button
                              className="bg-blue-400 p-2 rounded-lg flex items-center justify-center hover:bg-blue-500"
                              onClick={() => handleDetailClick(session)}
                            >
                              <AiFillRead className="text-white" />
                            </button>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Detail
                            </span>
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
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Hapus
                            </span>
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

      {/*Modal Batas Pengisian Ea*/}
      {showDeadlineModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md mx-4 text-center shadow-lg">
            <h2 className="text-xl font-bold mb-3 text-red-700">
              Batas Pengisian Sudah Lewat
            </h2>
            <p className="text-gray-700 mb-6">
              Batas pengisian untuk periode{" "}
              <span className="font-semibold text-gray-900">
                {new Date(selectedSession.tanggalMulai).getFullYear()}
              </span>{" "}
              telah berakhir pada{" "}
              <span className="font-semibold text-gray-900">
                {new Date(selectedSession.tanggalSelesai).toLocaleDateString(
                  "id-ID"
                )}
              </span>
              .
            </p>

            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
                onClick={() => setShowDeadlineModal(false)}
              >
                Tutup
              </button>

              {isAdmin && (
                <button
                  className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg"
                  onClick={() => {
                    // Start loading animation
                    const intervals = startLoadingAnimation();
                    setLoadingStep("Menyiapkan form edit batas pengisian...");

                    setTimeout(() => {
                      stopLoadingAnimation();
                      setEditData({
                        id: selectedSession.id,
                        batasPengisian: selectedSession.batasPengisian,
                      });
                      setShowDeadlineModal(false);
                      setIsEditModalOpen(true);
                    }, 1000);
                  }}
                >
                  Ubah Batas Pengisian
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
