"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import HistogramChart from "@/components/ExecutiveSpider";
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

  const fetchSesiPengisian = async (pabrikId) => {
    try {
      const response = await fetchData(
        `/api/sesi/sesiByPabrikId?tahun=${selectedYear}&pabrikId=${pabrikId}`,
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

  const handleDetailClick = async (pabrikId) => {
    const sesiPengisianId = await fetchSesiPengisian(pabrikId);
    if (sesiPengisianId) {
      router.push(`/detail/${sesiPengisianId}/hasil`);
    } else {
      alert("Sesi pengisian tidak ditemukan");
    }
  };

  const handleDetailRendemenClick = async () => {
    router.push(`/kinerja/statistics`);
  };

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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
              Dashboard Semua Pabrik
            </h1>
            <p className="text-gray-600 text-sm">
              Monitoring Performa Keberlanjutan Real-time
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

        {/* HISTOGRAM
        <div className="mt-14">
          <h3
            className="text-3xl font-extrabold mb-6 flex items-center gap-3
      bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent drop-shadow-sm"
          >
            <TrendingUp className="w-7 h-7 text-emerald-600" />
            Perbandingan Keberlanjutan 3 Pabrik
          </h3>

          <HistogramChart
            data={factories.map((factory) => {
              const dashboardData = allFactoriesData[factory.id];

              if (
                !dashboardData ||
                !dashboardData.nilaiKinerjaKeberlanjutan[0]
              ) {
                return { namaPabrik: factory.namaPabrik };
              }

              const kinerja = dashboardData.nilaiKinerjaKeberlanjutan[0];

              return {
                namaPabrik: factory.namaPabrik,
                dimensiEkonomi: kinerja.dimensiEkonomi || 0,
                dimensiSosial: kinerja.dimensiSosial || 0,
                dimensiLingkungan: kinerja.dimensiLingkungan || 0,
                dimensiSDAM: kinerja.dimensiSDAM || 0,
              };
            })}
          />
        </div> */}
      </div>
    </div>
  );
}
