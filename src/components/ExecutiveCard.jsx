"use client";

import { CheckCircle, AlertCircle, Calendar } from "lucide-react";
import HistogramChart from "@/components/ExecutiveSpider";
import { RendemenGaugeCard } from "./ExecutiveRendemen";
import { useRouter } from "next/navigation";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";

/* ------------------ KATEGORI NILAI ------------------ */
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
        kategori: getKategori(nilaiKinerja),

        /* ------------------ (C) STATUS PENGISIAN ------------------ */
        indikatorWajib: selectedYearData?.indikatorWajib ?? 0,
        indikatorTerisi: selectedYearData?.indikatorTerisi ?? 0,

        /* ------------------ (D) ORANG YG SUDAH / BELUM MENGISI ------------------ */
        requiredUsers: selectedYearData?.requiredUsers ?? [],
        filledUsers: selectedYearData?.filledUsers ?? [],
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
        router.push(`/detail/${response.id}/hasil`);
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
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
                    filledUsers,
                  }) => {
                    const nilai = Number(selectedYearData?.nilaiKinerja ?? 0);

                    /* ------------------ (C) STATUS PENGISIAN ------------------ */
                    const isComplete = indikatorTerisi >= indikatorWajib;
                    const status = isComplete ? "Selesai" : "Belum Selesai";

                    /* ------------------ (D) LIST ORANG BELUM MENGISI ------------------ */
                    const belumMengisi = requiredUsers.filter(
                      (u) => !filledUsers.includes(u)
                    );

                    return (
                      <div
                        key={factory.id}
                        onClick={() => handleDetailClick(factory.id)}
                        className={`
                        rounded-xl p-4 text-center shadow-sm border
                        hover:shadow-lg cursor-pointer transition-all duration-300 
                        active:scale-[0.98]
                        ${kategoriStyles[kategori]?.card ?? ""}
                      `}
                      >
                        <p className="font-semibold text-slate-800">
                          {factory.namaPabrik}
                        </p>

                        <p
                          className={`text-2xl font-bold ${
                            kategoriStyles[kategori]?.text ?? ""
                          }`}
                        >
                          {nilai.toFixed(2)}%
                        </p>

                        <p
                          className={`text-sm font-semibold ${
                            kategoriStyles[kategori]?.text ?? ""
                          }`}
                        >
                          {kategori}
                        </p>

                        {/* STATUS */}
                        <p
                          className={`text-sm mt-2 font-medium ${
                            isComplete ? "text-blue-600" : "text-red-600"
                          }`}
                        >
                          {status} ({indikatorTerisi}/{indikatorWajib})
                        </p>

                        {/* ORANG BELUM MENGISI */}
                        {!isComplete && (
                          <p className="text-xs text-red-500 mt-1">
                            Belum mengisi:{" "}
                            {belumMengisi.length > 0
                              ? belumMengisi.join(", ")
                              : "-"}
                          </p>
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
            <h3 className="text-xl font-semibold">
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
              className="hidden"
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
            {factoriesWithData.map(({ factory, rataRataRendemen }) => {
              const rr = Number(rataRataRendemen ?? 0);
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
