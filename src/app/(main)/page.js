"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import DatePicker from "react-datepicker";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsFillCircleFill } from "react-icons/bs";
import HistogramChart from "@/components/HistogramChart";
import InfoButton from "@/components/InfoButton";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";

import "react-circular-progressbar/dist/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import GridCardSkeleton from "@/components/common/GridCardSkeleton";
import { formatNumberToIndonesian } from "@/tools/formatNumber";

const getKategori = (nilaiKinerja) => {
  if (nilaiKinerja >= 0 && nilaiKinerja <= 25) {
    return "TIDAK BERKELANJUTAN";
  } else if (nilaiKinerja > 25 && nilaiKinerja <= 50) {
    return "KURANG BERKELANJUTAN";
  } else if (nilaiKinerja > 50 && nilaiKinerja <= 75) {
    return "CUKUP BERKELANJUTAN";
  } else if (nilaiKinerja > 75 && nilaiKinerja <= 100) {
    return "BERKELANJUTAN";
  } else {
    return "NILAI TIDAK VALID";
  }
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2021);
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState({});
  const [dashboardData, setDashboardData] = useState(null);
  const [sustainabilityData, setSustainabilityData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const router = useRouter();

  const handleFactoryChange = (factory) => {
    setSelectedFactory(factory);
    fetchDashboardData(factory.id);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    // fetchDashboardData(selectedFactory.id);
  };

  const fetchFactories = async () => {
    try {
      const response = await fetchData("/api/pabrik", {
        method: "GET",
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });

      if (response.length > 0) {
        setSelectedFactory(response[0]); // Set the first factory as default
        fetchDashboardData(response[0].id); // Fetch dashboard data for the first factory
      }

      setFactories(response);
    } catch (error) {
      console.error("Error fetching factories:", error);
    }
  };

  const fetchDashboardData = async (pabrikId) => {
    try {
      setLoading(true);
      const response = await fetchData(
        `/api/dashboard/${pabrikId}?tahun=${selectedYear}&startDate=${selectedDate.toISOString()}&endDate=${selectedDate.toISOString()}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getCookie("token")}` },
        }
      );

      setDashboardData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const fetchSesiPengisian = async () => {
    try {
      const response = await fetchData(
        `/api/sesi/sesiByPabrikId?tahun=${selectedYear}&pabrikId=${selectedFactory.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      return response.id;
    } catch (error) {
      console.error("Error fetching sesi pengisian:", error);
    }
  };

  const handleDetailClick = async () => {
    const sesiPengisianId = await fetchSesiPengisian();
    if (sesiPengisianId) {
      router.push(`/detail/${sesiPengisianId}/sumber-daya`);
    } else {
      alert("Sesi pengisian tidak ditemukan");
    }
  };

  useEffect(() => {
    fetchFactories();
  }, []);

  useEffect(() => {
    if (selectedFactory.id) {
      fetchDashboardData(selectedFactory.id);
    }
  }, [selectedFactory, selectedYear, selectedDate]);

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

  const { nilaiKinerjaKeberlanjutan, rataRataRendemen, informasi } =
    dashboardData;

  const histogramData = nilaiKinerjaKeberlanjutan.map((data) => ({
    year: data.tahun,
    "Index Total": data.nilaiKinerja,
    "Dimensi Ekonomi": data.dimensiEkonomi,
    "Dimensi Sosial": data.dimensiSosial,
    "Dimensi Lingkungan": data.dimensiLingkungan,
    "Dimensi Sumber Daya": data.dimensiSDAM,
  }));

  const selectedYearData = nilaiKinerjaKeberlanjutan.find(
    (data) => data.tahun === parseInt(selectedYear)
  );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-0 text-green-700">
          Kondisi Pabrik {selectedFactory.namaPabrik || "Pabrik"} saat ini
        </h1>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
          <label className="block text-lg font-semibold">Pilih Pabrik:</label>
          <div className="flex flex-wrap gap-2">
            {factories.map((factory) => (
              <label
                key={factory.id}
                className={`flex items-center cursor-pointer rounded-md p-2 transition-colors duration-300 ${
                  selectedFactory?.id === factory.id
                    ? "bg-gray-600 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
                onClick={() => handleFactoryChange(factory)}
              >
                {factory.namaPabrik}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-full mb-4">
            <h1 className="text-xl font-semibold">
              Nilai Kinerja Keberlanjutan Rantai Pasok
            </h1>
          </div>

          <div className="flex flex-col md:flex-row justify-around gap-5 w-full h-full">
            <div className="flex flex-col items-center justify-end mb-6 h-full">
              <div
                onClick={handleDetailClick}
                className="w-40 h-40 md:w-52 md:h-52 mb-2 hover:cursor-pointer"
              >
                <CircularProgressbar
                  value={selectedYearData?.nilaiKinerja.toFixed(2) || 0}
                  text={`${
                    formatNumberToIndonesian(selectedYearData?.nilaiKinerja) ||
                    0
                  }%`}
                  styles={buildStyles({
                    pathColor: "#4CAF50",
                    textColor: "#4CAF50",
                    trailColor: "#d6d6d6",
                  })}
                />
              </div>
              <div className="flex items-center justify-center">
                <p className="mt-2 text-gray-700 text-center font-semibold">
                  {getKategori(selectedYearData?.nilaiKinerja)}
                </p>
                <InfoButton />
              </div>
            </div>

            <div className="border-t-2 md:border-l-2 md:border-t-0 border-gray-300 w-full md:w-0 h-0 md:h-full my-4 md:my-0"></div>

            <div>
              <div className="font-semibold mb-4">
                <h1>Periode Perhitungan:</h1>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="bg-white border border-gray-300 rounded-md p-2 text-lg"
                >
                  <option value={2021}>2021</option>
                  <option value={2022}>2022</option>
                  <option value={2023}>2023</option>
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
              </div>
              <p className="font-bold text-gray-700 mb-4">
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
                    {nilaiKinerjaKeberlanjutan[0]?.status === "BELUM_FINAL" ? (
                      <div className="text-center">
                        <span>BELUM SELESAI</span>
                      </div>
                    ) : (
                      "SELESAI"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-full mb-4">
            <h1 className="text-xl font-semibold">Nilai Prediksi Rendemen</h1>
          </div>

          <div className="flex flex-col md:flex-row justify-around gap-5 w-full h-full">
            <div className="flex flex-col items-center justify-center mb-6 h-full">
              <div className="flex flex-col items-center justify-center mb-6 h-full">
                {/* Tampilkan nilai rata-rata rendemen */}
                <div className="text-5xl font-bold mb-4">
                  {formatNumberToIndonesian(rataRataRendemen) || 0}%
                </div>

                {/* Bar indikator */}
                <div className="relative w-full md:w-60 h-9 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 border-2 border-gray-700 bg-transparent"
                    style={{
                      left: `${
                        rataRataRendemen <= 4
                          ? (rataRataRendemen / 12) * 100 // Posisi untuk kategori rendah
                          : rataRataRendemen <= 8
                          ? (rataRataRendemen / 12) * 100 // Posisi untuk kategori sedang
                          : (rataRataRendemen / 12) * 100 // Posisi untuk kategori tinggi
                      }%`,
                      width: "30px",
                      height: "50px",
                    }}
                  ></div>
                </div>

                {/* Tampilkan label kategori */}
                <div className="mt-4 text-xl font-semibold text-gray-700">
                  {rataRataRendemen <= 4
                    ? "Rendah"
                    : rataRataRendemen <= 8
                    ? "Sedang"
                    : "Tinggi"}
                </div>
              </div>
            </div>

            <div className="border-t-2 md:border-l-2 md:border-t-0 border-gray-300 w-full md:w-0 h-0 md:h-full my-4 md:my-0"></div>

            <div className="flex flex-col items-center mb-6 h-full">
              <div className="font-semibold mb-4 text-black">
                <h1>Periode Perhitungan:</h1>
              </div>
              <div className="w-full">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    // fetchDashboardData(selectedFactory.id);
                  }}
                  inline
                  dateFormat="dd/MM/yyyy"
                  className="border border-white/20 rounded-md p-2 bg-white/40 text-green-700 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Kinerja Keberlanjutan Rantai Pasok PG{" "}
            {selectedFactory ? selectedFactory.namaPabrik : "Pabrik"}{" "}
            {/* {selectedYear} */}
          </h2>
          {/* <HistogramChart data={histogramData} /> */}
          <HistogramChart data={dashboardData.dataHistogram} />
        </div>

        <div className="relative bg-white border-l-8 border-gray-300 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(black, black 34px, #e0e0e0 36px)] rounded-xl pointer-events-none"></div>

          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <AiOutlineExclamationCircle className="mr-3 text-gray-500" />
              Informasi!
            </h2>
            {/* <ul className="text-gray-700 space-y-3">
              <li className="flex items-center">
                <BsFillCircleFill className="text-red-500 mr-3 animate-pulse" />
                Bagian SDM belum mengisi data
              </li>
              <li className="flex items-center">
                <BsFillCircleFill className="text-red-500 mr-3 animate-pulse" />
                Bagian TUK belum mengisi data
              </li>
            </ul> */}
            <ul className="text-gray-700 space-y-3">
              {informasi.map((info, index) => (
                <li key={index} className="flex items-center">
                  <BsFillCircleFill className="text-red-500 mr-3 animate-pulse" />
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
