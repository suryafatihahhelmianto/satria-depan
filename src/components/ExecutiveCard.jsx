"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import HistogramChart from "@/components/ExecutiveSpider";
import { useRouter } from "next/navigation";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import Inpo from "@/components/InfoButton";

// Helper functions
const getKategori = (nilaiKinerja) => {
  if (nilaiKinerja >= 0 && nilaiKinerja <= 25) return "TIDAK BERKELANJUTAN";
  if (nilaiKinerja > 25 && nilaiKinerja <= 50) return "KURANG BERKELANJUTAN";
  if (nilaiKinerja > 50 && nilaiKinerja <= 75) return "CUKUP BERKELANJUTAN";
  if (nilaiKinerja > 75 && nilaiKinerja <= 100) return "BERKELANJUTAN";
  return "NILAI TIDAK VALID";
};

const getKategoriStyles = (kategori) => {
  const styles = {
    "TIDAK BERKELANJUTAN": {
      text: "text-red-600",
      bg: "bg-red-50",
      hover: "hover:border-red-300 hover:bg-red-50/80",
      gradient: "from-red-100/30 to-transparent",
    },
    "KURANG BERKELANJUTAN": {
      text: "text-amber-600",
      bg: "bg-amber-50",
      hover: "hover:border-amber-300 hover:bg-amber-50/80",
      gradient: "from-amber-100/30 to-transparent",
    },
    "CUKUP BERKELANJUTAN": {
      text: "text-green-600",
      bg: "bg-green-50",
      hover: "hover:border-green-300 hover:bg-green-50/80",
      gradient: "from-green-100/30 to-transparent",
    },
    BERKELANJUTAN: {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      hover: "hover:border-emerald-300 hover:bg-emerald-50/80",
      gradient: "from-emerald-100/30 to-transparent",
    },
  };
  return styles[kategori] || styles["TIDAK BERKELANJUTAN"];
};

export default function FactoryPerformanceCards({
  factories = [],
  allFactoriesData = {},
  selectedYear,
  setSelectedYear,
  availableYears = [],
}) {
  const uniqueSortedYears = [...availableYears].sort((a, b) => a - b);
  const effectiveSelectedYear =
    selectedYear ?? (uniqueSortedYears.length ? uniqueSortedYears[0] : null);
  const router = useRouter();

  // Sync year
  if (
    selectedYear == null &&
    effectiveSelectedYear != null &&
    setSelectedYear
  ) {
    setSelectedYear(effectiveSelectedYear);
  }

  // Process data - hanya ambil 3 factory utama untuk compact view
  const mainFactories = factories
    .slice(0, 3)
    .map((factory) => {
      const dashboardData = allFactoriesData?.[factory.id];
      if (!dashboardData) return null;

      const nilaiKinerjaKeberlanjutan = Array.isArray(
        dashboardData.nilaiKinerjaKeberlanjutan
      )
        ? dashboardData.nilaiKinerjaKeberlanjutan
        : [];

      const selectedYearData = effectiveSelectedYear
        ? nilaiKinerjaKeberlanjutan.find(
            (data) => Number(data?.tahun) === Number(effectiveSelectedYear)
          )
        : null;

      const nilaiKinerja = Number(selectedYearData?.nilaiKinerja ?? 0);
      const informasi = selectedYearData?.informasi ?? [];
      const rolesBelumMengisi = informasi
        .filter((item) => item.unfilledColumns?.length > 0)
        .map((item) => item.role);
      const isFinal = selectedYearData?.status === "FINAL";
      const kategori = getKategori(nilaiKinerja);

      return {
        factory,
        selectedYearData,
        nilaiKinerja,
        kategori,
        rolesBelumMengisi,
        isFinal,
      };
    })
    .filter(Boolean);

  const handleDetailClick = async (factoryId) => {
    try {
      const response = await fetchData(
        `/api/sesi/sesiByPabrikId?tahun=${effectiveSelectedYear}&pabrikId=${factoryId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getCookie("token")}` },
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

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* HEADER COMPACT dengan efek */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="group">
          <h1 className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
            Nilai Kinerja Keberlanjutan Pabrik
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Tahun:</span>
          <div className="relative group/select">
            <select
              value={effectiveSelectedYear ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                const n = v === "" ? null : Number(v);
                if (setSelectedYear) setSelectedYear(n);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none pr-10 hover:border-gray-400 transition-all duration-300 cursor-pointer"
            >
              <option value="">Pilih tahun</option>
              {uniqueSortedYears.map((tahun) => (
                <option key={tahun} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-gray-600 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <Inpo />
        </div>
      </div>

      {/* MAIN CONTENT - 3 COLUMNS SIDE BY SIDE dengan efek premium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainFactories.map(
          ({
            factory,
            selectedYearData,
            nilaiKinerja,
            kategori,
            rolesBelumMengisi,
            isFinal,
          }) => {
            const styles = getKategoriStyles(kategori);

            // Spider chart data
            const spiderData = [
              {
                namaPabrik: factory.namaPabrik,
                dimensiEkonomi: Number(selectedYearData?.dimensiEkonomi ?? 0),
                dimensiSosial: Number(selectedYearData?.dimensiSosial ?? 0),
                dimensiLingkungan: Number(
                  selectedYearData?.dimensiLingkungan ?? 0
                ),
                dimensiSDAM: Number(selectedYearData?.dimensiSDAM ?? 0),
              },
            ];

            return (
              <div
                key={factory.id}
                onClick={() => handleDetailClick(factory.id)}
                className="group relative overflow-hidden"
              >
                {/* Background gradient effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Shine effect */}
                <div className="absolute -inset-x-20 -top-20 h-40 w-40 rotate-45 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Main Card */}
                <div
                  className={`
                  relative bg-white rounded-xl shadow-sm border border-gray-200 
                  overflow-hidden cursor-pointer
                  transform transition-all duration-500 ease-out
                  group-hover:scale-[1.02]
                  group-hover:shadow-xl
                  group-hover:border-gray-300
                `}
                >
                  {/* Factory Header dengan glow effect */}
                  <div
                    className={`${styles.bg} px-4 py-3 border-b ${styles.text} border-gray-200 relative overflow-hidden`}
                  >
                    {/* Animated underline */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                    <div className="flex items-center justify-between relative z-10">
                      <h3 className="font-bold text-gray-800 truncate group-hover:tracking-wide transition-all duration-300">
                        {factory.namaPabrik}
                      </h3>
                      {!isFinal && rolesBelumMengisi.length > 0 && (
                        <div className="relative group/warning">
                          <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse group-hover:animate-none transition-all" />
                          <div className="absolute -top-8 right-0 bg-amber-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/warning:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Ada data belum lengkap
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Performance Score dengan floating effect */}
                    <div className="flex items-center justify-between mb-4 relative">
                      <div className="group/score">
                        <div className="text-3xl font-bold text-gray-800 group-hover/score:scale-110 transition-transform duration-300 origin-left">
                          {formatNumberToIndonesian(nilaiKinerja)}%
                        </div>
                        <div
                          className={`text-sm font-semibold ${styles.text} group-hover/score:translate-x-1 transition-transform duration-300`}
                        >
                          {kategori}
                        </div>
                      </div>

                      {/* Status badge dengan bounce effect */}
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text} transform group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300 shadow-sm group-hover:shadow`}
                      >
                        {isFinal ? "FINAL" : "PROSES"}
                      </div>
                    </div>

                    {/* Spider Chart dengan zoom effect */}
                    <div className="mb-4 relative group/chart">
                      <div className="h-40 transform group-hover/chart:scale-105 transition-transform duration-500">
                        <HistogramChart data={spiderData} compact />
                      </div>

                      {/* Grid overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>

                    {/* Quick Stats dengan wave effect */}
                    <div className="grid grid-cols-4 gap-2 mt-3 text-center relative">
                      {/* Animated background bars */}
                      <div className="absolute inset-0 grid grid-cols-4 gap-2">
                        {["eko", "sos", "ling", "sdam"].map((item, idx) => (
                          <div
                            key={idx}
                            className={`h-full rounded bg-current opacity-0 group-hover:opacity-5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                          ></div>
                        ))}
                      </div>

                      {/* Stats items */}
                      {[
                        {
                          label: "Eko",
                          value: Number(selectedYearData?.dimensiEkonomi ?? 0),
                          delay: 0,
                        },
                        {
                          label: "Sos",
                          value: Number(selectedYearData?.dimensiSosial ?? 0),
                          delay: 100,
                        },
                        {
                          label: "Ling",
                          value: Number(
                            selectedYearData?.dimensiLingkungan ?? 0
                          ),
                          delay: 200,
                        },
                        {
                          label: "SDAM",
                          value: Number(selectedYearData?.dimensiSDAM ?? 0),
                          delay: 300,
                        },
                      ].map(({ label, value, delay }) => (
                        <div
                          key={label}
                          className="text-xs relative z-10 transform group-hover:-translate-y-1 transition-all duration-300"
                          style={{ transitionDelay: `${delay}ms` }}
                        >
                          <div className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                            {label}
                          </div>
                          <div
                            className={`font-bold ${styles.text} opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all`}
                          >
                            {formatNumberToIndonesian(value)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Status Info dengan slide up effect */}
                    <div className="border-t border-gray-100 pt-3 mt-4 relative overflow-hidden">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        {!isFinal && rolesBelumMengisi.length > 0 ? (
                          <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 group-hover:border-amber-300 transition-colors">
                            <div className="font-medium mb-1 flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3 animate-pulse" />
                              Menunggu data dari:
                            </div>
                            <div className="truncate group-hover:whitespace-normal transition-all">
                              {rolesBelumMengisi.slice(0, 2).join(", ")}
                            </div>
                            {rolesBelumMengisi.length > 2 && (
                              <div className="text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">
                                dan {rolesBelumMengisi.length - 2} lainnya
                              </div>
                            )}
                          </div>
                        ) : isFinal ? (
                          <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 group-hover:border-emerald-300 transition-colors">
                            <div className="flex items-center gap-2">
                              ✓ Data sudah lengkap dan difinalisasi
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200 group-hover:border-yellow-300 transition-colors">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                              Data belum lengkap
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Button dengan efek "PLEASE CLICK ME!" */}
                  <div className="px-4 py-3 bg-gradient-to-t from-gray-100 to-white border-t border-gray-200/50 relative overflow-hidden group/btn">
                    {/* Animated background particles */}
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-current rounded-full animate-ping"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: "50%",
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "1s",
                          }}
                        />
                      ))}
                    </div>

                    {/* Magnetic pull effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out"></div>

                    {/* Subtle vibration effect */}
                    <div className="relative transform group-hover/btn:animate-float">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetailClick(factory.id);
                        }}
                        className="relative w-full text-sm font-semibold text-gray-800 hover:text-gray-900 py-3 px-4 rounded-lg 
                          bg-gradient-to-r from-white to-gray-50
                          border border-gray-300/50
                          shadow-sm hover:shadow-md
                          transition-all duration-300 
                          flex items-center justify-center gap-2 
                          group-hover/btn:gap-3
                          group-hover/btn:scale-[1.02]
                          group-hover/btn:bg-gradient-to-r group-hover/btn:from-white group-hover/btn:to-gray-100
                          group-hover/btn:border-gray-400/50
                          active:scale-[0.98]
                          overflow-hidden"
                      >
                        {/* Glowing dot */}
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-current rounded-full opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-ping"></div>
                        </div>

                        <span className="relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-300">
                          Lihat Detail Laporan
                        </span>
                        <span
                          className="absolute inset-0 
                            bg-gradient-to-r from-transparent via-green-200 to-transparent 
                            opacity-0 
                            group-hover:opacity-100 
                            translate-x-[-200%] 
                            group-hover:translate-x-[200%] 
                            transition-all duration-1000 ease-in-out"
                        ></span>
                        <span
                          className="absolute inset-0 
                            bg-gradient-to-r from-transparent via-green-300 to-transparent 
                            opacity-0 
                            group-hover:opacity-100 
                            translate-x-[-250%] 
                            group-hover:translate-x-[250%] 
                            transition-all duration-1200 ease-in-out delay-100"
                        ></span>

                        {/* Arrow with trail effect */}
                        <div className="relative">
                          <ArrowRight
                            className="w-4 h-4 transform 
                              group-hover/btn:translate-x-1 
                              group-hover/btn:scale-110
                              transition-all duration-300"
                          />
                          {/* Arrow trail */}
                          <ArrowRight
                            className="absolute inset-0 w-4 h-4 transform 
                              opacity-0 group-hover/btn:opacity-30
                              group-hover/btn:translate-x-2
                              transition-all duration-200"
                          />
                          {/* Arrow trail */}
                          <ArrowRight
                            className="absolute inset-0 w-4 h-4 transform 
                              opacity-0 group-hover/btn:opacity-20
                              group-hover/btn:translate-x-3
                              transition-all duration-200"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Outer glow effect */}
                <div
                  className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${styles.gradient} blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10`}
                ></div>
              </div>
            );
          }
        )}
      </div>

      {/* QUICK OVERVIEW SECTION dengan efek */}
      {factories.length > 3 && (
        <div className="mt-8 relative group/section">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-500"></div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="group/title">
                <h3 className="font-semibold text-gray-800 group-hover/title:text-gray-900 transition-colors">
                  Pabrik Lainnya
                </h3>
                <div className="h-0.5 w-0 group-hover/title:w-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-300 mt-1"></div>
              </div>
              <span className="text-sm text-gray-600 group-hover/section:text-gray-800 transition-colors">
                {factories.length - 3} pabrik tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {factories.slice(3, 7).map((factory, idx) => {
                const dashboardData = allFactoriesData?.[factory.id];
                const nilaiKinerjaKeberlanjutan =
                  dashboardData?.nilaiKinerjaKeberlanjutan || [];
                const selectedYearData = effectiveSelectedYear
                  ? nilaiKinerjaKeberlanjutan.find(
                      (data) =>
                        Number(data?.tahun) === Number(effectiveSelectedYear)
                    )
                  : null;
                const nilaiKinerja = Number(
                  selectedYearData?.nilaiKinerja ?? 0
                );
                const kategori = getKategori(nilaiKinerja);
                const styles = getKategoriStyles(kategori);

                return (
                  <div
                    key={factory.id}
                    onClick={() => handleDetailClick(factory.id)}
                    className="group/item relative overflow-hidden"
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    {/* Card background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 transform group-hover/item:scale-105 transition-transform duration-300"></div>

                    <div className="relative p-3 border border-gray-200 rounded-lg group-hover/item:border-gray-300 group-hover/item:shadow-md transition-all duration-300 cursor-pointer">
                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <span className="font-medium text-sm text-gray-800 truncate group-hover/item:text-gray-900 transition-colors">
                          {factory.namaPabrik}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${styles.bg} ${styles.text} transform group-hover/item:scale-110 group-hover/item:-translate-y-0.5 transition-all duration-300`}
                        >
                          {nilaiKinerja}%
                        </span>
                      </div>
                      <div
                        className={`text-xs font-medium ${styles.text} group-hover/item:translate-x-1 transition-transform duration-300`}
                      >
                        {kategori}
                      </div>

                      {/* Arrow indicator */}
                      <ArrowRight className="absolute bottom-2 right-2 w-3 h-3 text-gray-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all duration-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
