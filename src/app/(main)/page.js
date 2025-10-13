"use client";

import { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import DatePicker from "react-datepicker";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsFillCircleFill, BsBell } from "react-icons/bs";
import HistogramChart from "@/components/NewHistChart";
import InfoButton from "@/components/InfoButton";
import SemiCircularGauge from "@/components/SemiCircle";
import { formatNumberToIndonesian } from "@/tools/formatNumber";

import "react-circular-progressbar/dist/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import GridCardSkeleton from "@/components/common/GridCardSkeleton";

const getKategori = (nilaiKinerja) => {
  if (nilaiKinerja >= 0 && nilaiKinerja <= 25) return "TIDAK BERKELANJUTAN";
  if (nilaiKinerja > 25 && nilaiKinerja <= 50) return "KURANG BERKELANJUTAN";
  if (nilaiKinerja > 50 && nilaiKinerja <= 75) return "CUKUP BERKELANJUTAN";
  if (nilaiKinerja > 75 && nilaiKinerja <= 100) return "BERKELANJUTAN";
  return "NILAI TIDAK VALID";
};

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2021);
  const [selectedFactory, setSelectedFactory] = useState({
    id: 1,
    namaPabrik: "Jatitujuh",
  });
  const [selectedDate, setSelectedDate] = useState(new Date("2021-09-29"));
  const [availableYears] = useState([2021, 2022, 2023, 2024, 2025]);

  // Mock dashboard data
  const dashboardData = {
    nilaiKinerjaKeberlanjutan: [
      {
        tahun: 2021,
        nilaiKinerja: 59.65,
        status: "FINAL",
        dimensiEkonomi: 65,
        dimensiSosial: 60,
        dimensiLingkungan: 55,
        dimensiSDAM: 58,
      },
    ],
    rataRataRendemen: 33.3,
    dataHistogram: [
      { year: 2021, "Index Total": 65 },
      { year: 2022, "Index Total": 65 },
      { year: 2023, "Index Total": 75 },
      { year: 2024, "Index Total": 70 },
      { year: 2025, "Index Total": 75 },
    ],
    informasi: [
      { role: "SDM dan UMUM", unfilledColumns: [] },
      { role: "TUK", unfilledColumns: [] },
    ],
  };

  const { nilaiKinerjaKeberlanjutan, rataRataRendemen, informasi } =
    dashboardData;

  if (loading) {
    return <GridCardSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-0 text-green-700">
          Kondisi PG {selectedFactory.namaPabrik} saat ini
        </h1>
        <div className="flex items-center gap-4">
          {/* Select Pabrik */}
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold">Pilih Pabrik:</label>
            <select
              value={selectedFactory.namaPabrik}
              onChange={(e) =>
                setSelectedFactory({ id: 1, namaPabrik: e.target.value })
              }
              className="w-[180px] rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="Jatitujuh">Jatitujuh</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID 3 COLUMN */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="col-span-5 bg-white p-4 md:p-6 rounded-lg shadow-md">
          {/* Outer card: header + content */}

          {/* Judul (kiri) */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Nilai Kinerja Keberlanjutan Rantai Pasok
            </h2>

            <div className="relative">
              <BsBell className="text-2xl text-gray-700 cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                10
              </span>
            </div>
          </div>

          {/* Periode */}
          <div className="mb-4 flex items-center gap-3">
            <label className="text-sm font-semibold whitespace-nowrap">
              Periode Perhitungan:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* GRID utama */}
          <div className="grid grid-cols-5 gap-4 mt-6 items-stretch">
            {/* LEFT: histogram (col-span-2) */}
            <div className="col-span-2 bg-white border border-gray-100 rounded-lg p-4 flex flex-col">
              {/* Card kecil di dalam kolom kiri (hilangkan max-w-md mx-auto) */}
              <h3 className="text-center font-semibold text-gray-800 mb-2 text-sm">
                Kinerja Keberlanjutan Rantai Pasok PG Jatitujuh
              </h3>

              <div className="flex-1">
                <HistogramChart data={dashboardData.dataHistogram} />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <label className="text-sm font-semibold whitespace-nowrap">
                  Pilih Dimensi Perhitungan:
                </label>
                <select
                  defaultValue="Index Total"
                  className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="Index Total">Index Total</option>
                  <option value="Dimensi Ekonomi">Dimensi Ekonomi</option>
                  <option value="Dimensi Sosial">Dimensi Sosial</option>
                  <option value="Dimensi Lingkungan">Dimensi Lingkungan</option>
                </select>
              </div>
            </div>

            {/* CENTER + RIGHT: col-span-3 */}
            <div className="col-span-3 bg-white rounded-lg p-4 flex items-center gap-6">
              {/* Circular progress (kiri) */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-48 h-48">
                  <CircularProgressbar
                    value={nilaiKinerjaKeberlanjutan[0].nilaiKinerja}
                    text={`${formatNumberToIndonesian(
                      nilaiKinerjaKeberlanjutan[0].nilaiKinerja
                    )}%`}
                    styles={buildStyles({
                      pathColor: "#4CAF50",
                      textColor: "#4CAF50",
                      trailColor: "#d6d6d6",
                      textSize: "16px",
                    })}
                  />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xl px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Lihat Detail
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <p className="mt-2 text-gray-700 text-center font-semibold">
                    Sangat Mantap
                  </p>
                  <div className="relative group">
                    <InfoButton />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Click Me!
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider vertikal */}
              <div className="w-px bg-gray-200 h-48"></div>

              {/* Status Perhitungan (kanan) */}
              <div className="w-72 flex flex-col">
                <div className="bg-teal-500 text-white shadow-lg text-sm font-semibold text-center py-2 rounded-t-md w-full">
                  Status Perhitungan:
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-b-md w-full p-4">
                  <div className="w-48 h-48 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                    SELESAI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Yield Prediction */}
        <div className="col-span-1 bg-white p-3 md:p-4 rounded-lg shadow-md w-fit max-w-xs ml-auto">
          <h2 className="text-lg font-semibold mb-4">
            Nilai Prediksi Rendemen
          </h2>

          {/* Nilai + Gauge */}
          <div className="flex flex-col items-center justify-center mb-3 mt-10">
            <div className="text-5xl font-bold mb-2 text-gray-800 mt-6">
              {formatNumberToIndonesian(rataRataRendemen)}%
            </div>
            <SemiCircularGauge
              value={rataRataRendemen}
              maxValue={12}
              className="mt-12"
            />
          </div>

          {/* Periode Perhitungan */}
          <div className="mt-12">
            <p className="text-sm font-semibold text-gray-700 mb-2 text-center">
              Periode Perhitungan:
            </p>
            <div className="flex justify-center mt-2">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="border border-gray-300 rounded-md px-3 py-2 w-40 text-center cursor-pointer"
                placeholderText="Pilih Tanggal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Section */}
      <div className="grid grid-cols-1 gap-2">
        <div className="relative bg-white border-l-8 border-gray-300 p-6 rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(black,black_34px,#e0e0e0_36px)] rounded-xl pointer-events-none"></div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <AiOutlineExclamationCircle className="mr-3 text-gray-500" />
              Informasi!
            </h2>
            <ul className="text-gray-700 space-y-3">
              {informasi.map((info, index) => (
                <li key={index} className="flex items-center">
                  <BsFillCircleFill className="text-red-500 mr-3 animate-pulse" />
                  <p className="font-bold text-lg animate-pulse">
                    {info.role === "GENERAL MANAGER / KEPALA PABRIK"
                      ? `${info.role} Belum Mengisi Data!`
                      : `Kepala Bagian ${info.role} Belum Mengisi Data!`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
