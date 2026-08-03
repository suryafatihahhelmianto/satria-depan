"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import DatePicker from "react-datepicker";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsFillCircleFill } from "react-icons/bs";
import HistogramChart from "@/components/HistogramChart";
import InfoButton from "@/components/InfoButton";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { FaExclamationTriangle } from "react-icons/fa";
import { useUser } from "@/context/UserContext";

import "react-circular-progressbar/dist/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import GridCardSkeleton from "@/components/common/GridCardSkeleton";
import { formatNumberToIndonesian } from "@/tools/formatNumber";

const getKategori = (nilaiKinerja) => {
  if (nilaiKinerja >= 0 && nilaiKinerja <= 25) return "TIDAK BERKELANJUTAN";
  if (nilaiKinerja > 25 && nilaiKinerja <= 50) return "KURANG BERKELANJUTAN";
  if (nilaiKinerja > 50 && nilaiKinerja <= 75) return "CUKUP BERKELANJUTAN";
  if (nilaiKinerja > 75 && nilaiKinerja <= 100) return "BERKELANJUTAN";
  return "NILAI TIDAK VALID";
};

export default function HomePage() {
  const router = useRouter();
  const { role, isLoading: userLoading } = useUser();

  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState(null);
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState({});
  const [dashboardData, setDashboardData] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableYears, setAvailableYears] = useState([]);

  // ---------------------------------------------------------------------------------------
  // 1. Redirect Role (must be placed BEFORE any conditional return)
  // ---------------------------------------------------------------------------------------
  useEffect(() => {
    if (userLoading) return;

    if (role === "DIREKSI") {
      router.replace("/executive-dashboard");
      return;
    }

    setAuthChecked(true);
  }, [userLoading, role, router]);

  // ---------------------------------------------------------------------------------------
  // 2. FETCH FUNCTIONS (all wrapped in useCallback)
  // ---------------------------------------------------------------------------------------

  const fetchFactories = useCallback(async () => {
    try {
      const response = await fetchData("/api/pabrik", {
        method: "GET",
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });

      setFactories(response);

      if (response.length > 0) {
        setSelectedFactory(response[0]); // default
      }
    } catch (error) {
      console.error("Error fetching factories:", error);
    }
  }, []);

  const fetchYears = useCallback(async () => {
    if (!selectedFactory.id) return;

    try {
      const response = await fetchData(
        `/api/sesi/tahun?pabrikId=${selectedFactory.id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getCookie("token")}` },
        },
      );

      setAvailableYears(response.data || []);
      setSelectedYear(response.data?.[0] || null);
    } catch (error) {
      console.error("Error fetching years:", error);
      setAvailableYears([]);
      setSelectedYear(null);
    }
  }, [selectedFactory.id]);

  const fetchDashboardData = useCallback(
    async (pabrikId) => {
      try {
        setLoading(true);

        const response = await fetchData(
          `/api/dashboard/${pabrikId}?tahun=${selectedYear}&startDate=${selectedDate.toISOString()}&endDate=${selectedDate.toISOString()}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${getCookie("token")}` },
          },
        );

        // Normalize roles
        response.informasi = response.informasi.map((item) => {
          let updated = item.role;
          if (updated === "QUALITYCONTROL") updated = "QUALITY CONTROL";
          if (updated === "KEPALAPABRIK")
            updated = "GENERAL MANAGER / KEPALA PABRIK";
          if (updated === "SDM") updated = "SDM dan UMUM";
          return { ...item, role: updated };
        });

        setDashboardData(response);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedYear, selectedDate],
  );

  const fetchSesiPengisian = useCallback(async () => {
    try {
      const response = await fetchData(
        `/api/sesi/sesiByPabrikId?tahun=${selectedYear}&pabrikId=${selectedFactory.id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getCookie("token")}` },
        },
      );
      return response.id;
    } catch (error) {
      console.error("Error fetching sesi pengisian:", error);
    }
  }, [selectedYear, selectedFactory.id]);

  // ---------------------------------------------------------------------------------------
  // 3. EFFECTS — all effects MUST be above any return statements
  // ---------------------------------------------------------------------------------------

  useEffect(() => {
    fetchFactories();
  }, [fetchFactories]);

  useEffect(() => {
    if (!selectedFactory.id) return;
    fetchYears();
  }, [selectedFactory.id, fetchYears]);

  useEffect(() => {
    if (!selectedFactory.id || !selectedYear) return;
    fetchDashboardData(selectedFactory.id);
  }, [selectedFactory.id, selectedYear, selectedDate, fetchDashboardData]);

  // ---------------------------------------------------------------------------------------
  // 4. CONDITIONAL RETURNS — AFTER ALL HOOKS
  // ---------------------------------------------------------------------------------------

  if (userLoading || role === "DIREKSI") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-green-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Memeriksa akses pengguna...</p>
        </div>
      </div>
    );
  }

  if (!authChecked) return null;

  if (loading) {
    return (
      <div>
        <GridCardSkeleton />
      </div>
    );
  }

  if (!dashboardData) {
    return <p>No data available for the selected factory.</p>;
  }

  // ---------------------------------------------------------------------------------------
  // 5. PAGE RENDER BELOW
  // ---------------------------------------------------------------------------------------

  const handleFactoryChange = (factory) => {
    setSelectedFactory(factory);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleDetailClick = async () => {
    const sesiPengisianId = await fetchSesiPengisian();
    if (sesiPengisianId) router.push(`/detail/${sesiPengisianId}/hasil`);
    else alert("Sesi pengisian tidak ditemukan");
  };

  const handleDetailRendemenClick = () => {
    router.push(`/rendemen`);
  };

  const { nilaiKinerjaKeberlanjutan, rataRataRendemen, informasi } =
    dashboardData;

  const selectedYearData = nilaiKinerjaKeberlanjutan.find(
    (d) => d.tahun === Number(selectedYear),
  );

  return (
    <div className="min-h-screen p-4 bg-gray-100 md:p-6">
      <div className="flex flex-col mb-6 md:flex-row md:justify-between">
        <h1 className="mb-4 text-2xl font-semibold text-green-700 md:text-3xl md:mb-0">
          Kondisi PG {selectedFactory.namaPabrik || "Pabrik"} saat ini
        </h1>
        <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center">
          <label className="block text-lg font-semibold">Pilih Pabrik:</label>
          <div className="flex flex-wrap gap-2">
            {factories.map((factory) => (
              <label
                key={factory.id}
                className={`flex items-center cursor-pointer rounded-md p-2 transition-colors duration-300 ${
                  selectedFactory?.id === factory.id
                    ? "bg-green-800 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                }`}
                onClick={() => handleFactoryChange(factory)}
              >
                {factory.namaPabrik}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md md:p-6">
          <div className="w-full mb-4">
            <h1 className="text-xl font-semibold">
              Nilai Kinerja Keberlanjutan Rantai Pasok
            </h1>
          </div>

          {availableYears.length > 0 ? (
            <div className="flex flex-col justify-around w-full h-full gap-5 md:flex-row">
              <div className="flex flex-col items-center justify-end h-full mb-6">
                <div className="relative group">
                  <div
                    onClick={handleDetailClick}
                    className="w-40 h-40 mb-2 md:w-52 md:h-52 hover:cursor-pointer"
                  >
                    <CircularProgressbar
                      value={
                        nilaiKinerjaKeberlanjutan[0].nilaiKinerja.toFixed(2) ||
                        0
                      }
                      text={`${
                        formatNumberToIndonesian(
                          nilaiKinerjaKeberlanjutan[0].nilaiKinerja,
                        ) || 0
                      }%`}
                      styles={buildStyles({
                        pathColor: "#4CAF50",
                        textColor: "#4CAF50",
                        trailColor: "#d6d6d6",
                      })}
                    />
                  </div>
                  <span className="absolute px-2 py-1 mb-1 text-xl text-white transition-opacity transform -translate-x-1/2 bg-black rounded-lg opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100">
                    Lihat Detail
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <p className="mt-2 font-semibold text-center text-gray-700">
                    {getKategori(selectedYearData?.nilaiKinerja)}
                  </p>
                  <div className="relative group">
                    <InfoButton />
                    <span className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-black rounded-lg opacity-0 pointer-events-none -top-3 left-1/2 group-hover:opacity-100 whitespace-nowrap">
                      Click Me!
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full h-0 my-4 border-t-2 border-gray-300 md:border-l-2 md:border-t-0 md:w-0 md:h-full md:my-0"></div>

              <div>
                <div className="mb-4 font-semibold">
                  <h1>Periode Perhitungan:</h1>
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="p-2 text-lg bg-white border border-gray-300 rounded-md"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mb-4 font-bold text-gray-700">
                  Status Perhitungan:
                </p>
                <div className="flex justify-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-24 h-24 rounded-full text-white font-bold ${
                      nilaiKinerjaKeberlanjutan[0]?.status === "FINAL"
                        ? `bg-green-500`
                        : `bg-red-500`
                    }`}
                  >
                    <p>
                      {nilaiKinerjaKeberlanjutan[0]?.status === "FINAL" ? (
                        "SELESAI"
                      ) : (
                        <div className="text-center">
                          <span>BELUM SELESAI</span>
                        </div>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-xl text-center text-gray-600">
                Belum ada sesi pengisian untuk pabrik ini.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md md:p-6">
          <div className="w-full mb-4">
            <h1 className="text-xl font-semibold">Nilai Prediksi Rendemen</h1>
          </div>

          <div className="flex flex-col justify-around w-full h-full gap-5 sm:flex-row">
            <div className="flex flex-col items-center justify-center h-full mb-6">
              {(rataRataRendemen === 0 || rataRataRendemen === null) && (
                <div className="flex items-center w-full max-w-sm gap-2 px-3 py-2 mb-4 text-center text-yellow-800 bg-yellow-100 border border-yellow-400 animate-pulse rounded-xl">
                  <FaExclamationTriangle className="text-4xl animate-pulse" />
                  <span>Hari ini QC belum melakukan perhitungan</span>
                </div>
              )}
              <div
                className="relative flex flex-col items-center cursor-pointer group"
                onClick={handleDetailRendemenClick}
              >
                <div className="mb-4 text-3xl font-bold xl:text-5xl">
                  {formatNumberToIndonesian(rataRataRendemen) || 0}%
                </div>

                <div
                  onClick={handleDetailRendemenClick}
                  className="relative w-32 h-6 rounded-full 2xl:w-52 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                >
                  <div
                    className="absolute w-3/4 h-auto transform -translate-x-1/2 -translate-y-1/2 bg-transparent border-2 border-gray-700 top-1/2 left-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4"
                    style={{
                      left: `${
                        rataRataRendemen <= 4
                          ? (rataRataRendemen / 12) * 100
                          : rataRataRendemen <= 8
                            ? (rataRataRendemen / 12) * 100
                            : (rataRataRendemen / 12) * 100
                      }%`,
                      width: "30px",
                      height: "50px",
                    }}
                  ></div>
                </div>

                <div className="mt-4 text-xl font-semibold text-gray-700">
                  {rataRataRendemen <= 4
                    ? "Rendah"
                    : rataRataRendemen <= 8
                      ? "Sedang"
                      : "Tinggi"}
                </div>
                <span className="absolute px-3 py-1 mb-2 text-sm text-white transition-opacity transform -translate-x-1/2 bg-black rounded-lg opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100">
                  Lihat Detail
                </span>
              </div>
            </div>

            <div className="w-full h-0 my-4 border-t-2 border-gray-300 md:border-l-2 md:border-t-0 md:w-0 md:h-full md:my-0"></div>

            <div className="flex flex-col items-center h-full mb-6">
              <div className="mb-4 font-semibold text-black">
                <h1>Periode Perhitungan:</h1>
              </div>
              <div className="w-full">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                  }}
                  inline
                  dateFormat="dd/MM/yyyy"
                  className="p-2 text-lg text-green-700 border rounded-md border-white/20 bg-white/40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-2">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-center">
            Kinerja Keberlanjutan Rantai Pasok PG{" "}
            {selectedFactory ? selectedFactory.namaPabrik : "Pabrik"}{" "}
          </h2>
          <HistogramChart data={dashboardData.dataHistogram} />
        </div>

        <div className="relative p-6 transition-shadow duration-300 bg-white border-l-8 border-gray-300 shadow-lg rounded-xl hover:shadow-2xl">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(black, black 34px, #e0e0e0 36px)] rounded-xl pointer-events-none"></div>

          <div className="relative">
            <h2 className="flex items-center mb-4 text-2xl font-bold text-gray-800">
              <AiOutlineExclamationCircle className="mr-3 text-gray-500" />
              Informasi!
            </h2>
            <ul className="space-y-3 text-gray-700">
              {informasi.map((info, index) => (
                <li key={index} className="flex items-center">
                  <BsFillCircleFill className="mr-3 text-red-500 animate-pulse" />
                  <div>
                    <p className="font-bold text-l animate-pulse">
                      {info.role === "GENERAL MANAGER / KEPALA PABRIK"
                        ? `${info.role} Belum Mengisi Data!`
                        : `Kepala Bagian ${info.role} Belum Mengisi Data!`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
