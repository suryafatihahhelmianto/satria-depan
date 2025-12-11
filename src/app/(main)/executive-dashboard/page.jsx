"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DigitalClock from "@/components/ExecutiveClock";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import FactoryPerformanceCards from "@/components/ExecutiveCard";

import "react-circular-progressbar/dist/styles.css";
import GridCardSkeleton from "@/components/common/GridCardSkeleton";

const getAvailableYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2021;
  const years = [];

  for (let y = startYear; y <= currentYear; y++) {
    years.push(y);
  }

  return years;
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears] = useState(getAvailableYears());
  const [factories, setFactories] = useState([]);
  const [allFactoriesData, setAllFactoriesData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const router = useRouter();

  const fetchFactories = async () => {
    try {
      const response = await fetchData("/api/pabrik", {
        method: "GET",
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });

      setFactories(response);
    } catch (error) {
      console.error("Error fetching factories:", error);
    }
  };

  const fetchAllFactoriesDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const dataMap = {};

      for (const factory of factories) {
        const response = await fetchData(
          `/api/dashboard/${
            factory.id
          }?tahun=${selectedYear}&startDate=${selectedDate.toISOString()}&endDate=${selectedDate.toISOString()}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${getCookie("token")}` },
          }
        );

        const updatedInformasi = response.informasi.map((item) => {
          let updatedRole = item.role;
          if (updatedRole === "QUALITYCONTROL") updatedRole = "QUALITY CONTROL";
          if (updatedRole === "KEPALAPABRIK")
            updatedRole = "GENERAL MANAGER / KEPALA PABRIK";
          if (updatedRole === "SDM") updatedRole = "SDM dan UMUM";
          return { ...item, role: updatedRole };
        });

        response.informasi = updatedInformasi;
        dataMap[factory.id] = response;
      }

      setAllFactoriesData(dataMap);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  }, [factories, selectedYear, selectedDate]);

  useEffect(() => {
    fetchFactories();
  }, []);

  useEffect(() => {
    if (factories.length > 0 && selectedYear) {
      fetchAllFactoriesDashboardData();
    }
  }, [factories, selectedYear, selectedDate, fetchAllFactoriesDashboardData]);

  if (loading) {
    return (
      <div>
        <GridCardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-slate-100">
      {/* HEADER */}
      <div className="border-b border-gray-300/50 backdrop-blur-sm bg-white/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 bg-clip-text text-transparent mb-1 drop-shadow-sm">
              Selamat Datang Kembali
            </h1>
            <p className="text-gray-600 text-xs">
              Monitoring Performa Keberlanjutan dari Pabrik Anda
            </p>
          </div>
          <DigitalClock />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <FactoryPerformanceCards
          factories={factories}
          allFactoriesData={allFactoriesData}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableYears={availableYears}
        />
      </div>
    </div>
  );
}
