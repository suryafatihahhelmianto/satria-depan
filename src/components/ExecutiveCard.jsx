"use client";

import { CheckCircle, AlertCircle, Calendar } from "lucide-react";
import HistogramChart from "@/components/ExecutiveSpider";
import { RendemenGaugeCard } from "./ExecutiveRendemen";

/* ------------------ KATEGORI NILAI ------------------ */
const getKategori = (nilaiKinerja) => {
  if (nilaiKinerja >= 0 && nilaiKinerja <= 25) return "TIDAK BERKELANJUTAN";
  if (nilaiKinerja > 25 && nilaiKinerja <= 50) return "KURANG BERKELANJUTAN";
  if (nilaiKinerja > 50 && nilaiKinerja <= 75) return "CUKUP BERKELANJUTAN";
  if (nilaiKinerja > 75 && nilaiKinerja <= 100) return "BERKELANJUTAN";
  return "NILAI TIDAK VALID";
};

export default function FactoryPerformanceCards({
  factories,
  allFactoriesData,
  selectedYear,
  setSelectedYear,
  selectedDate,
  setSelectedDate,
}) {
  /* =============================================================
     BUILD DATA PER PABRIK DENGAN TAHUN TERPILIH
  ============================================================= */
  const factoriesWithData = factories
    .map((factory) => {
      const dashboardData = allFactoriesData[factory.id];
      if (!dashboardData) return null;

      const { nilaiKinerjaKeberlanjutan, rataRataRendemen, informasi } =
        dashboardData;

      /* keluarkan data berdasarkan tahun terpilih */
      const selectedYearData = nilaiKinerjaKeberlanjutan.find(
        (data) => data.tahun === parseInt(selectedYear)
      );

      const nilaiKinerja = selectedYearData?.nilaiKinerja ?? 0;

      return {
        factory,
        dashboardData,
        selectedYearData,
        nilaiKinerja,
        rataRataRendemen,
        informasi,
        kategori: getKategori(nilaiKinerja),
      };
    })
    .filter(Boolean);

  /* ambil daftar tahun dari pabrik pertama untuk dropdown */
  const yearOptions =
    factoriesWithData[0]?.dashboardData.nilaiKinerjaKeberlanjutan ?? [];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================================
            LEFT — 2/3 WIDTH
        ============================================================ */}
        <div className="w-full mb-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Nilai Prediksi Kinerja</h3>

            {/* YEAR DROPDOWN */}
            <div className="flex items-center gap-4">
              <label className="font-semibold">Pilih Tahun:</label>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md p-2"
              >
                {yearOptions.map((data) => (
                  <option key={data.tahun} value={data.tahun}>
                    {data.tahun}
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
                    dimensiEkonomi: selectedYearData?.dimensiEkonomi || 0,
                    dimensiSosial: selectedYearData?.dimensiSosial || 0,
                    dimensiLingkungan: selectedYearData?.dimensiLingkungan || 0,
                    dimensiSDAM: selectedYearData?.dimensiSDAM || 0,
                  }))}
              />
            </div>

            {/* CARD NILAI PER PABRIK */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {factoriesWithData
                .slice(0, 3)
                .map(({ factory, selectedYearData, kategori }) => (
                  <div
                    key={factory.id}
                    className="bg-green-50 border border-green-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <p className="font-semibold text-slate-800">
                      {factory.namaPabrik}
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {selectedYearData?.nilaiKinerja?.toFixed(2) || 0}%
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      {kategori}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT — 1/3 WIDTH
        ============================================================ */}
        <div className="w-full mb-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Prediksi Rendemen Hari Ini
            </h3>

            {/* DATE PICKER TRIGGER */}
            <button
              onClick={() =>
                document.getElementById("rendemen-date-picker").showPicker()
              }
              className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-sm rounded-lg shadow flex items-center gap-2 transition"
            >
              <Calendar className="w-4 h-4" />
              {selectedDate.toLocaleDateString()}
            </button>

            <input
              type="date"
              id="rendemen-date-picker"
              className="hidden"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>

          {/* RENDERMEN CARDS */}
          <div className="space-y-4">
            {factoriesWithData.map(({ factory, rataRataRendemen }) => (
              <div
                key={`rendemen-${factory.id}`}
                className="bg-white rounded-xl border border-blue-200/70 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-4"
              >
                <h2 className="text-base font-bold text-slate-800 mb-4">
                  PG {factory.namaPabrik}
                </h2>

                <RendemenGaugeCard rataRataRendemen={rataRataRendemen} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
