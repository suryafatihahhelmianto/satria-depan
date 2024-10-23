"use client";

import HistogramChart from "@/components/HistogramChart";
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

export default function HomePage() {
  const [selectedYear, setSelectedYear] = useState(2023);
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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Circular Progress for Kinerja */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          {/* <div className="flex w-full"> */}
          <button
            // href={"/detail/sumber-daya"}
            onClick={handleDetailClick}
            className="mb-2 font-semibold text-xl bg-gray-300 px-2 rounded-lg"
          >
            Detail
          </button>
          {/* </div> */}
          <div className="w-32 h-32 mb-2">
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
          {/* <p className="text-gray-700 font-semibold">Kinerja</p> */}
        </div>

        {/* Status Data */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="bg-white border border-gray-300 rounded-md p-2 text-lg"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </h2>
          <p className="font-bold text-gray-700 mb-2">STATUS DATA</p>
          <p className="text-gray-700">FINAL</p>
          <p className="mt-2 text-gray-700 font-semibold">
            NILAI KINERJA BERKELANJUTAN
          </p>
        </div>

        {/* Inline Calendar */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-center">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline // Makes the calendar always visible
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Circular Progress for SDM */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <div className="mb-2 flex flex-col gap-2">
            <div className="w-32 h-32 mb-2">
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
            <h2 className="text-xl font-semibold mb-2 text-center">Rendemen</h2>
          </div>
        </div>
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
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Informasi!</h2>
          <ul className="text-gray-700">
            <li>🔴 Bagian SDM belum mengisi data</li>
            <li>🔴 Bagian TUK belum mengisi data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
