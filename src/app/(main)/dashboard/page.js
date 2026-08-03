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
    <div className="min-h-screen p-4 bg-gray-100 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col mb-6 md:flex-row md:justify-between md:items-center">
        <h1 className="mb-4 text-2xl font-semibold text-green-700 md:text-3xl md:mb-0">
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
        <div className="col-span-5 p-4 bg-white rounded-lg shadow-md md:p-6">
          {/* Outer card: header + content */}

          {/* Judul (kiri) */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Nilai Kinerja Keberlanjutan Rantai Pasok
            </h2>

            <div className="relative">
              <BsBell className="text-2xl text-gray-700 cursor-pointer" />
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2">
                10
              </span>
            </div>
          </div>

          {/* Periode */}
          <div className="flex items-center gap-3 mb-4">
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
          <div className="grid items-stretch grid-cols-5 gap-4 mt-6">
            {/* LEFT: histogram (col-span-2) */}
            <div className="flex flex-col col-span-2 p-4 bg-white border border-gray-100 rounded-lg">
              {/* Card kecil di dalam kolom kiri (hilangkan max-w-md mx-auto) */}
              <h3 className="mb-2 text-sm font-semibold text-center text-gray-800">
                Kinerja Keberlanjutan Rantai Pasok PG Jatitujuh
              </h3>

              <div className="flex-1">
                <HistogramChart data={dashboardData.dataHistogram} />
              </div>

              <div className="flex items-center gap-3 mt-3">
                <label className="text-sm font-semibold whitespace-nowrap">
                  Pilih Dimensi Perhitungan:
                </label>
                <select
                  defaultValue="Index Total"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="Index Total">Index Total</option>
                  <option value="Dimensi Ekonomi">Dimensi Ekonomi</option>
                  <option value="Dimensi Sosial">Dimensi Sosial</option>
                  <option value="Dimensi Lingkungan">Dimensi Lingkungan</option>
                </select>
              </div>
            </div>

            {/* CENTER + RIGHT: col-span-3 */}
            <div className="flex items-center col-span-3 gap-6 p-4 bg-white rounded-lg">
              {/* Circular progress (kiri) */}
              <div className="flex items-center justify-center flex-1">
                <div className="w-48 h-48">
                  <CircularProgressbar
                    value={nilaiKinerjaKeberlanjutan[0].nilaiKinerja}
                    text={`${formatNumberToIndonesian(
                      nilaiKinerjaKeberlanjutan[0].nilaiKinerja,
                    )}%`}
                    styles={buildStyles({
                      pathColor: "#4CAF50",
                      textColor: "#4CAF50",
                      trailColor: "#d6d6d6",
                      textSize: "16px",
                    })}
                  />
                  <span className="absolute px-2 py-1 mb-1 text-xl text-white transition-opacity transform -translate-x-1/2 bg-black rounded-lg opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100">
                    Lihat Detail
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <p className="mt-2 font-semibold text-center text-gray-700">
                    Sangat Mantap
                  </p>
                  <div className="relative group">
                    <InfoButton />
                    <span className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-black rounded-lg opacity-0 pointer-events-none -top-3 left-1/2 group-hover:opacity-100 whitespace-nowrap">
                      Click Me!
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider vertikal */}
              <div className="w-px h-48 bg-gray-200"></div>

              {/* Status Perhitungan (kanan) */}
              <div className="flex flex-col w-72">
                <div className="w-full py-2 text-sm font-semibold text-center text-white bg-teal-500 shadow-lg rounded-t-md">
                  Status Perhitungan:
                </div>
                <div className="flex items-center justify-center flex-1 w-full p-4 bg-gray-100 rounded-b-md">
                  <div className="flex items-center justify-center w-48 h-48 text-xl font-bold text-white bg-green-500 rounded-full">
                    SELESAI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Yield Prediction */}
        <div className="max-w-xs col-span-1 p-3 ml-auto bg-white rounded-lg shadow-md md:p-4 w-fit">
          <h2 className="mb-4 text-lg font-semibold">
            Nilai Prediksi Rendemen
          </h2>

          {/* Nilai + Gauge */}
          <div className="flex flex-col items-center justify-center mt-10 mb-3">
            <div className="mt-6 mb-2 text-5xl font-bold text-gray-800">
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
            <p className="mb-2 text-sm font-semibold text-center text-gray-700">
              Periode Perhitungan:
            </p>
            <div className="flex justify-center mt-2">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-40 px-3 py-2 text-center border border-gray-300 rounded-md cursor-pointer"
                placeholderText="Pilih Tanggal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Section */}
      <div className="grid grid-cols-1 gap-2">
        <div className="relative p-6 bg-white border-l-8 border-gray-300 shadow-lg rounded-xl">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(black,black_34px,#e0e0e0_36px)] rounded-xl pointer-events-none"></div>
          <div className="relative">
            <h2 className="flex items-center mb-4 text-2xl font-bold text-gray-800">
              <AiOutlineExclamationCircle className="mr-3 text-gray-500" />
              Informasi!
            </h2>
            <ul className="space-y-3 text-gray-700">
              {informasi.map((info, index) => (
                <li key={index} className="flex items-center">
                  <BsFillCircleFill className="mr-3 text-red-500 animate-pulse" />
                  <p className="text-lg font-bold animate-pulse">
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
