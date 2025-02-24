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
import { FaArrowLeft } from "react-icons/fa";

export default function RendemenPage() {
  const ITEMS_PER_PAGE = 5;
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const { role, isAdmin } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]); // State untuk menyimpan data sesi

  const [totalPages, setTotalPages] = useState(0);

  // const currentData = sessions.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE
  // );
  // const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchSessions(page); // Panggil ulang data dengan halaman baru
  };

  // Fungsi untuk mem-fetch data dari API
  const fetchSessions = async (page = currentPage, pageSize = itemsPerPage) => {
    try {
      setLoading(true);
      const token = getCookie("token");

      // Tambahkan parameter page dan pageSize
      const response = await fetchData(
        `/api/rendemen/list?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data, pagination } = await response; // Sesuaikan dengan respons API

      setSessions(data); // Simpan data dari API ke state sessions
      setTotalPages(pagination.totalPages); // Simpan total halaman dari API
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
        "No",
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

  const fetchXLSData = async () => {
    try {
      const xlsResponse = await fetchData("/api/rendemen/csv", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      const rendemenData = await xlsResponse.data;

      // Header untuk file .xls
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

      // Buat HTML table untuk file .xls
      const tableContent =
        `<table>` +
        `<thead><tr>${headers
          .map((h) => `<th>${h}</th>`)
          .join("")}</tr></thead>` +
        `<tbody>${rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
          )
          .join("")}</tbody>` +
        `</table>`;

      // Buat file Blob .xls
      const blob = new Blob(
        [
          `<html xmlns:x="urn:schemas-microsoft-com:office:excel">${tableContent}</html>`,
        ],
        { type: "application/vnd.ms-excel" }
      );

      // Buat elemen <a> untuk mengunduh file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "data_rendemen.xls"); // Nama file .xls
      document.body.appendChild(link);
      link.click(); // Klik otomatis
      document.body.removeChild(link); // Hapus elemen setelah unduhan
    } catch (error) {
      console.error("Error saat mengunduh data XLS:", error);
      alert("Gagal mengunduh data XLS.");
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
    fetchSessions(1, itemsPerPage); // Panggil fungsi fetchSessions saat komponen di-mount
  }, []);

  // Render tampilan
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-1 p-4 hover:bg-gray-100 hover:rounded-lg hover:shadow-md transition-all">
          <Link href={"/rendemen/input"} className="flex items-center gap-2">
            <AiFillPlusCircle className="text-2xl text-green-800 hover:text-green-900 cursor-pointer" />
            <h1 className="cursor-pointer hover:text-green-600 rounded-s">
              Tambah Prediksi Rendemen
            </h1>
          </Link>
        </div>
        <div className="flex justify-end font-bold gap-2 text-xl">
          <Link
            href={"/rendemen/statistics"}
            className="gap-2 bg-green-800 hover:bg-green-900 text-white hover:cursor-pointer p-2 rounded-lg flex items-center"
          >
            <p className="text-sm">Lihat Trend</p>
            <AiOutlineLineChart />
          </Link>
          <button
            className="flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white hover:cursor-pointer p-2 rounded-lg"
            onClick={fetchCSVData}
          >
            <p className="text-sm">Unduh CSV</p>
            <AiOutlineDownload />
          </button>
          <button
            className="flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white hover:cursor-pointer p-2 rounded-lg"
            onClick={fetchXLSData}
          >
            <p className="text-sm">Unduh XLS</p>
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
                <th className="py-2 px-4 border-b">No</th>
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
                sessions.map((session, index) => (
                  <tr
                    key={session.tanggal}
                    className="hover:bg-gray-200 text-center"
                  >
                    <td className="py-2 px-4 border-b">
                      {/* {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE} */}
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
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
                        <div className="relative group">
                          <Link
                            className="flex gap-2"
                            href={`/rendemen/${session.id}`}
                          >
                            <button className="bg-blue-300 p-2 rounded-lg flex items-center justify-center hover:bg-blue-500">
                              <AiOutlineSearch />
                            </button>
                          </Link>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Detail
                          </span>
                        </div>

                        <div className="relative group">
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(session.id)}
                              className="bg-red-500 p-2 rounded-lg flex items-center justify-center hover:bg-red-600 text-white"
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
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {/* {totalPages > 1 && ( */}
          {
            <div className="flex justify-center mt-4 gap-2">
              {/* Tombol Previous */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                }`}
              >
                {/* <FaArrowLeft /> */}
                Sebelumnya
              </button>
              {/* Nomor Halaman */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                const isFirstPage = page === 1;
                const isLastPage = page === totalPages;
                const isNearCurrentPage = Math.abs(page - currentPage) <= 1;

                if (isFirstPage || isLastPage || isNearCurrentPage) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === page
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }

                // Tampilkan "..." jika ada jeda antar halaman
                const showEllipsisBefore =
                  page < currentPage && page === currentPage - 2;
                const showEllipsisAfter =
                  page > currentPage && page === currentPage + 2;

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span
                      key={`ellipsis-${page}`}
                      className="px-4 py-2 text-gray-500 cursor-default"
                    >
                      ...
                    </span>
                  );
                }

                return null; // Jangan render tombol lainnya
              })}
              {/* Tombol Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                }`}
              >
                Berikutnya
              </button>
              <div className="flex justify-center items-center mt-4 gap-2">
                <label
                  htmlFor="itemsPerPage"
                  className="mr-2 text-sm font-medium text-gray-700"
                >
                  Jumlah rendemen per halaman:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => {
                    const newItemsPerPage = parseInt(e.target.value, 10);
                    setItemsPerPage(newItemsPerPage); // Ubah jumlah item per halaman
                    setCurrentPage(1); // Reset ke halaman pertama
                    fetchSessions(1, newItemsPerPage); // Fetch data dengan halaman pertama dan itemsPerPage baru
                  }}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          }
          <div className="text-center my-4">
            <p>
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
