"use client";

import { CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import React, { useState } from "react";

import HistogramChart from "@/components/ExecutiveSpider";
import { RendemenGaugeCard } from "./ExecutiveRendemen";
import { useRouter } from "next/navigation";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { formatNumberToIndonesian } from "@/tools/formatNumber";

const getKategori = (nilaiKinerja) => {
  if (nilaiKinerja >= 0 && nilaiKinerja <= 25) return "TIDAK BERKELANJUTAN";
  if (nilaiKinerja > 25 && nilaiKinerja <= 50) return "KURANG BERKELANJUTAN";
  if (nilaiKinerja > 50 && nilaiKinerja <= 75) return "CUKUP BERKELANJUTAN";
  if (nilaiKinerja > 75 && nilaiKinerja <= 100) return "BERKELANJUTAN";
  return "NILAI TIDAK VALID";
};

export default function FactoryPerformanceCards({
  factories = [],
  allFactoriesData = {},
  selectedYear,
  setSelectedYear,
  selectedDate,
  setSelectedDate,
  availableYears = [],
}) {
  const uniqueSortedYears = [...availableYears].sort((a, b) => a - b);

  const effectiveSelectedYear =
    selectedYear ?? (uniqueSortedYears.length ? uniqueSortedYears[0] : null);

  const kategoriStyles = {
    "TIDAK BERKELANJUTAN": {
      card: "bg-red-50 border-red-200",
      text: "text-red-700",
    },
    "KURANG BERKELANJUTAN": {
      card: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-700",
    },
    "CUKUP BERKELANJUTAN": {
      card: "bg-green-50 border-green-200",
      text: "text-green-700",
    },
    BERKELANJUTAN: {
      card: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
    },
  };

  const factoriesWithData = factories
    .map((factory) => {
      const dashboardData = allFactoriesData?.[factory.id];
      if (!dashboardData) return null;

      const nilaiKinerjaKeberlanjutan = Array.isArray(
        dashboardData.nilaiKinerjaKeberlanjutan
      )
        ? dashboardData.nilaiKinerjaKeberlanjutan
        : [];

      const yearToMatch =
        effectiveSelectedYear !== null && effectiveSelectedYear !== undefined
          ? Number(effectiveSelectedYear)
          : null;

      const selectedYearData = yearToMatch
        ? nilaiKinerjaKeberlanjutan.find(
            (data) => Number(data?.tahun) === yearToMatch
          )
        : null;

      const nilaiKinerja = Number(selectedYearData?.nilaiKinerja ?? 0);
      const rataRataRendemen = dashboardData?.rataRataRendemen ?? 0;

      return {
        factory,
        dashboardData,
        selectedYearData,
        nilaiKinerja,
        rataRataRendemen,
        rataRataRendemenKemarin: dashboardData?.rataRataRendemenKemarin ?? 0,
        kategori: getKategori(nilaiKinerja),
        indikatorWajib: selectedYearData?.indikatorWajib ?? 0,
        indikatorTerisi: selectedYearData?.indikatorTerisi ?? 0,
        requiredUsers: selectedYearData?.requiredUsers ?? [],
        filledUsers: selectedYearData?.filledUsers ?? [],
        sessionStatus: selectedYearData?.status ?? null,
      };
    })
    .filter(Boolean);

  const yearOptions = uniqueSortedYears;

  const router = useRouter();

  const handleDetailClick = async (factoryId) => {
    try {
      const response = await fetchData(
        `/api/sesi/sesiByPabrikId?tahun=${effectiveSelectedYear}&pabrikId=${factoryId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response?.id) {
        router.push(`/detail-eksekutif/${response.id}/hasil`);
      } else {
        alert("Sesi pengisian tidak ditemukan.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal membuka detail.");
    }
  };

  /* ------------------ SYNC EFFECTIVE YEAR BACK TO PARENT ------------------ */
  if (selectedYear == null && effectiveSelectedYear != null) {
    if (typeof setSelectedYear === "function") {
      setSelectedYear(effectiveSelectedYear);
    }
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — 2/3 WIDTH */}
        <div className="w-full mb-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Nilai Kinerja Keberlanjutan
            </h3>

            {/* YEAR DROPDOWN */}
            <div className="flex items-center gap-4">
              <label className="font-semibold">Pilih Tahun:</label>

              <select
                value={effectiveSelectedYear ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  const n = v === "" ? null : Number(v);
                  if (typeof setSelectedYear === "function") setSelectedYear(n);
                }}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="">Pilih tahun</option>
                {yearOptions.map((tahun) => (
                  <option key={tahun} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SPIDER CHART */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-2 border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="w-full h-96">
              <HistogramChart
                data={factoriesWithData
                  .slice(0, 3)
                  .map(({ factory, selectedYearData }) => ({
                    namaPabrik: factory.namaPabrik,
                    dimensiEkonomi: Number(
                      selectedYearData?.dimensiEkonomi ?? 0
                    ),
                    dimensiSosial: Number(selectedYearData?.dimensiSosial ?? 0),
                    dimensiLingkungan: Number(
                      selectedYearData?.dimensiLingkungan ?? 0
                    ),
                    dimensiSDAM: Number(selectedYearData?.dimensiSDAM ?? 0),
                  }))}
              />
            </div>

            {/* CARD NILAI PER PABRIK */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              {factoriesWithData
                .slice(0, 3)
                .map(
                  ({
                    factory,
                    selectedYearData,
                    kategori,
                    nilaiKinerja,
                    indikatorWajib,
                    indikatorTerisi,
                    requiredUsers,
                  }) => {
                    const nilai = Number(selectedYearData?.nilaiKinerja ?? 0);

                    /* STATUS PENGISIAN */

                    /* LIST ORANG BELUM MENGISI  */

                    const informasi = selectedYearData?.informasi ?? [];

                    /* 1️⃣ AMBIL SEMUA ROLE YANG ADA DI INFORMASI */
                    const allRoles = informasi.map((i) => i.role);

                    /* 2️⃣ ROLE YANG BELUM MENGISI (langsung dari backend) */
                    const rolesBelumMengisi = informasi
                      .filter((item) => item.unfilledColumns?.length > 0)
                      .map((item) => item.role);

                    /* 3️⃣ HITUNG ROLE YANG SUDAH MENGISI */
                    const filledUsers = allRoles.filter(
                      (role) => !rolesBelumMengisi.includes(role)
                    );

                    /* 4️⃣ HITUNG PROGRESSNYA */
                    const totalRequiredUsers = allRoles.length;
                    const totalFilledUsers = filledUsers.length;

                    /* 5️⃣ STATUS BACKEND */
                    const isFinal = selectedYearData?.status === "FINAL";

                    /* 6️⃣ STATUS FRONTEND KITA */
                    const isComplete = totalFilledUsers >= totalRequiredUsers;

                    let statusDisplay = "";

                    if (isFinal) {
                      statusDisplay = "Perhitungan Selesai";
                    } else {
                      statusDisplay = isComplete
                        ? "Data Belum Lengkap"
                        : "Belum Selesai";
                    }

                    const progressUsersText = `(${totalFilledUsers}/${totalRequiredUsers})`;

                    // siapa yang belum isi
                    const belumMengisi = rolesBelumMengisi;

                    return (
                      <div
                        key={factory.id}
                        onClick={() => handleDetailClick(factory.id)}
                        className="
                            relative
                            rounded-xl p-4 text-center shadow-sm border
                            hover:shadow-lg cursor-pointer transition-all duration-300 
                            active:scale-[0.98]
                            group/card
                            overflow-visible
                          "
                      >
                        {/* TOOLTIP */}
                        <span className="absolute bottom-full left-[40%] -translate-x-1/2 mb-3 px-2 py-1 rounded-md bg-black text-white text-xs whitespace-nowrap opacity-0 group-hover/card:opacity-100 transition-all duration-200 pointer-events-none z-20">
                          Lihat Detail
                        </span>

                        <p className="text-xl font-semibold text-slate-800">
                          {factory.namaPabrik}
                        </p>

                        <p
                          className={`text-2xl font-bold ${
                            kategoriStyles[kategori]?.text ?? ""
                          }`}
                        >
                          {formatNumberToIndonesian(nilai)}%
                        </p>

                        <p
                          className={`text-sm font-semibold ${
                            kategoriStyles[kategori]?.text ?? ""
                          }`}
                        >
                          {kategori}
                        </p>

                        <p
                          className={`text-sm mt-2 font-medium animate-pulse ${
                            isFinal
                              ? "text-green-600"
                              : isComplete
                              ? "text-teal-600"
                              : "text-red-600"
                          }`}
                        >
                          {statusDisplay}
                        </p>

                        {!isFinal && belumMengisi.length > 0 && (
                          <p className="text-xs text-red-500 mt-1">
                            Belum mengisi: {belumMengisi.join(", ")}
                          </p>
                        )}

                        {!isFinal && (
                          <div
                            className="absolute top-[-14px] right-[-10px] z-30 group"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* ICON WARNING */}
                            <div className="bg-amber-700 hover:bg-red-700 text-white p-2 rounded-full shadow animate-pulse relative">
                              <AlertTriangle className="w-4 h-4" />
                            </div>

                            {/* TOOLTIP BESAR */}
                            <div
                              className="
        absolute right-0 mt-2 w-56
        bg-white text-black text-sm font-medium
        p-3 rounded-lg shadow-xl border border-amber-300
        opacity-0 group-hover:opacity-100
        pointer-events-none transition-all duration-200
        z-50
      "
                            >
                              ⚠️ <b>Peringatan</b>
                              <br />
                              Ada indikator yang belum diisi.
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>

        {/* RIGHT — 1/3 WIDTH */}
        <div className="w-full mb-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl md:xs font-semibold">
              Prediksi Rendemen Hari Ini
            </h3>

            {/* DATE PICKER */}
            <button
              onClick={() =>
                document.getElementById("rendemen-date-picker")?.showPicker?.()
              }
              className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-sm rounded-lg shadow flex items-center gap-2 transition"
            >
              <Calendar className="w-4 h-4" />
              {selectedDate?.toLocaleDateString
                ? selectedDate.toLocaleDateString()
                : ""}
            </button>

            <input
              type="date"
              id="rendemen-date-picker"
              className="sr-only"
              value={
                selectedDate ? selectedDate.toISOString().split("T")[0] : ""
              }
              onChange={(e) => {
                const d = e.target.value
                  ? new Date(e.target.value)
                  : new Date();
                if (typeof setSelectedDate === "function") setSelectedDate(d);
              }}
            />
          </div>

          {/* RENDERMEN CARDS */}
          <div className="space-y-4">
            {factoriesWithData.map(
              ({ factory, rataRataRendemen, rendemenKemarin }) => {
                const rr = Number(rataRataRendemen ?? 0);
                const rk = Number(rendemenKemarin ?? 0);

                return (
                  <div
                    key={`rendemen-${factory.id}`}
                    className="bg-white rounded-xl border border-blue-200/70 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-4"
                  >
                    <h2 className="text-base font-bold text-slate-800 mb-4">
                      PG {factory.namaPabrik}
                    </h2>
                    <RendemenGaugeCard rataRataRendemen={rr} />
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
