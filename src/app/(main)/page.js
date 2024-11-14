"use client";

import HistogramChart from "@/components/HistogramChart";
import InfoButton from "@/components/InfoButton";
import SustainabilityIndexChart from "@/components/SustainabilityIndexChart";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import CSS untuk Circular Progress Bar
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS
import { AiOutlineInfoCircle } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsFillCircleFill } from "react-icons/bs";

export default function HomePage() {
  const [selectedYear, setSelectedYear] = useState(2021);
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState({});
  const [sustainabilityData, setSustainabilityData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for the selected date

  const router = useRouter();

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const dataHistogram = [
    {
      year: 2022,
      "Index Total": 72.45,
      "Dimensi Ekonomi": 80,
      "Dimensi Sosial": 65,
      "Dimensi Lingkungan": 70,
      "Dimensi Sumber Daya": 75,
    },
    {
      year: 2023,
      "Index Total": 75,
      "Dimensi Ekonomi": 85,
      "Dimensi Sosial": 68,
      "Dimensi Lingkungan": 72,
      "Dimensi Sumber Daya": 78,
    },
    {
      year: 2024,
      "Index Total": 78,
      "Dimensi Ekonomi": 88,
      "Dimensi Sosial": 70,
      "Dimensi Lingkungan": 74,
      "Dimensi Sumber Daya": 80,
    },
  ];

  const progressKinerja = 72.45;

  const fetchFactories = async () => {
    const cookie = getCookie("token");
    try {
      const response = await fetchData("/api/pabrik", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie}`, // Ambil token dari localStorage
        },
      });

      console.log("ini pabrik: ", response);
      if (response.length > 0) {
        setSelectedFactory(response[0]); // Set sebagai objek pabrik
      }
      setFactories(response);
    } catch (error) {
      console.error("Error fetching pabrik", error);
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
      // Navigate to the detail page with the sesiPengisianId
      router.push(`/detail/${sesiPengisianId}/sumber-daya`);
    } else {
      alert("Sesi pengisian tidak ditemukan");
    }
  };

  useEffect(() => {
    fetchFactories();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold mb-6 text-green-700">
          Kondisi Pabrik{" "}
          {selectedFactory ? selectedFactory.namaPabrik : "Pabrik"} saat ini
        </h1>
        <div className="mb-4 flex justify-end items-center gap-2">
          <label className="block text-lg font-semibold">Pilih Pabrik:</label>
          <div className="flex space-x-4">
            {factories.map((factory) => (
              <label
                key={factory.id}
                className={`flex items-center cursor-pointer rounded-md p-2 transition-colors duration-300 ${
                  selectedFactory?.id === factory.id
                    ? "bg-gray-600 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                <input
                  type="radio"
                  value={factory.id}
                  checked={selectedFactory?.id === factory.id}
                  onChange={() => setSelectedFactory(factory)}
                  className="hidden" // Hide the default radio button
                />
                <span className="text-center">{factory.namaPabrik}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Gabungan Circular Progress Kinerja dan Status Data */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-full mb-4">
            <h1 className="text-xl font-semibold">
              Nilai Kinerja Keberlanjutan Rantai Pasok
            </h1>
          </div>

          {/* Bagian Kiri: Detail & Circular Progress */}
          <div className="flex justify-around gap-5 w-full h-full">
            {/* Bagian Kiri: Circular Progress */}
            <div className="flex flex-col items-center justify-end mb-6 h-full">
              {/* <button
      onClick={handleDetailClick}
      className="mb-4 font-semibold text-xl bg-gray-300 px-4 py-2 rounded-lg"
    >
      Detail
    </button> */}
              <div
                onClick={handleDetailClick}
                className="w-52 h-52 mb-2 hover:cursor-pointer"
              >
                <CircularProgressbar
                  value={progressKinerja}
                  text={`${progressKinerja}%`}
                  styles={buildStyles({
                    pathColor: "#4CAF50",
                    textColor: "#4CAF50",
                    trailColor: "#d6d6d6",
                  })}
                />
              </div>
              <div className="flex items-center justify-center">
                <p className="mt-2 text-gray-700 text-center font-semibold">
                  BERKELANJUTAN
                </p>
                <InfoButton /> {/* Replace the icon with InfoButton */}
              </div>
            </div>

            {/* Garis Pemisah */}
            <div className="border-l-2 border-gray-300 h-full"></div>

            {/* Bagian Kanan: Status Data */}
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
                {/* Lingkaran dengan tulisan FINAL */}
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-500 text-white font-bold">
                  <p>FINAL</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-full mb-4">
            <h1 className="text-xl font-semibold">Nilai Prediksi Rendemen</h1>
          </div>

          <div className="flex justify-around gap-5 w-full h-full">
            {/* Bagian Kiri: Circular Progress */}
            <div className="flex flex-col items-center justify-end mb-6 h-full">
              <div className="w-52 h-52 mb-2">
                <CircularProgressbar
                  value={6}
                  text={`${6}%`}
                  styles={buildStyles({
                    pathColor: "#4CAF50",
                    textColor: "#4CAF50",
                    trailColor: "#d6d6d6",
                  })}
                />
              </div>
              <p className="mt-2 text-gray-700 text-center font-semibold">
                RENDEMEN
              </p>
            </div>

            {/* Garis Pemisah */}
            <div className="border-l-2 border-gray-300 h-full"></div>

            {/* Bagian Kanan: Status Data */}
            <div>
              <div className="font-semibold mb-4">
                <h1>Periode Perhitungan:</h1>
              </div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline // Makes the calendar always visible
                dateFormat="dd/MM/yyyy"
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          {/* <div className="flex justify-around items-center w-full bg-blue-300">
            <div className="flex flex-col gap-2 bg-green-200 h-full justify-end">
              <div className="w-52 h-52 mb-2">
                <CircularProgressbar
                  value={6}
                  text={`${6}%`}
                  styles={buildStyles({
                    pathColor: "#4CAF50",
                    textColor: "#4CAF50",
                    trailColor: "#d6d6d6",
                  })}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-center">
                Rendemen
              </h2>
            </div>

            <div className="border-l-2 border-gray-300 h-full"></div>

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-left font-semibold w-full mb-2">
                Periode Perhitungan:
              </h1>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline // Makes the calendar always visible
                dateFormat="dd/MM/yyyy"
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          </div> */}
        </div>

        {/* Inline Calendar */}
        {/* <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-full mb-4">
            <h1 className="font-semibold">Nilai Prediksi Rendemen</h1>
          </div>
          <div className="flex justify-around items-center w-full bg-blue-300">
            <div className="flex flex-col gap-2 bg-green-200 h-full justify-end">
              <div className="w-44 h-44 mb-2">
                <CircularProgressbar
                  value={6}
                  text={`${6}%`}
                  styles={buildStyles({
                    pathColor: "#4CAF50",
                    textColor: "#4CAF50",
                    trailColor: "#d6d6d6",
                  })}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-center">
                Rendemen
              </h2>
            </div>

            <div className="border-l-2 border-gray-300 h-full"></div>

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-left font-semibold w-full mb-2">
                Periode Perhitungan:
              </h1>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline // Makes the calendar always visible
                dateFormat="dd/MM/yyyy"
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div> */}
      </div>

      {/* Lower Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-6">
        {/* Line Chart for Kinerja */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Kinerja Keberlanjutan Rantai Pasok{" "}
            {selectedFactory ? selectedFactory.namaPabrik : "Pabrik"}{" "}
            {selectedYear}
          </h2>
          <HistogramChart data={dataHistogram} />
        </div>

        {/* Informasi */}
        <div className="relative bg-white border-l-8 border-gray-300 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          {/* Enhanced Notebook lines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(black, black 34px, #e0e0e0 36px)] rounded-xl pointer-events-none"></div>

          {/* Content */}
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <AiOutlineExclamationCircle className="mr-3 text-gray-500" />
              Informasi!
            </h2>
            <ul className="text-gray-700 space-y-3">
              <li className="flex items-center">
                <BsFillCircleFill className="text-red-500 mr-3 animate-pulse" />
                Bagian SDM belum mengisi data
              </li>
              <li className="flex items-center">
                <BsFillCircleFill className="text-red-500 mr-3 animate-pulse" />
                Bagian TUK belum mengisi data
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
