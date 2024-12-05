"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import SkeletonCardBig from "@/components/common/SkeletonCardBig";

export default function RendemenStatisticsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = [
    { value: 0, label: "Januari" },
    { value: 1, label: "Februari" },
    { value: 2, label: "Maret" },
    { value: 3, label: "April" },
    { value: 4, label: "Mei" },
    { value: 5, label: "Juni" },
    { value: 6, label: "Juli" },
    { value: 7, label: "Agustus" },
    { value: 8, label: "September" },
    { value: 9, label: "Oktober" },
    { value: 10, label: "November" },
    { value: 11, label: "Desember" },
  ];

  const COLORS = {
    "Tersana Baru": "#FF5733",
    Jatitujuh: "#33A1FF",
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // Fungsi untuk mengatur data default 0
  const setDefaultMissingData = (data, key) => {
    return data.map((entry) => ({
      ...entry,
      [key]: entry[key] !== null && entry[key] !== undefined ? entry[key] : 0,
    }));
  };

  useEffect(() => {
    const fetchRendemenData = async () => {
      try {
        setLoading(true);
        const response = await fetchData(
          `/api/rendemen/daily-average?month=${
            selectedMonth + 1
          }&year=${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );

        const responseData = response.data; // Data dari backend
        const pabrikNames = Object.keys(responseData);
        const allDays = Array.from(
          { length: new Date(selectedYear, selectedMonth + 1, 0).getDate() },
          (_, i) => i + 1
        );

        // Normalisasi data untuk semua hari
        let normalizedData = [];
        allDays.forEach((day) => {
          const entry = { day };

          pabrikNames.forEach((pabrik) => {
            const dataForPabrik = responseData[pabrik];
            const dataForDay = dataForPabrik.find(
              (d) => new Date(d.tanggal).getDate() === day
            );
            entry[pabrik] = dataForDay ? dataForDay.nilaiRendemen : null;
          });

          normalizedData.push(entry);
        });

        // Mengisi nilai default 0 untuk data yang hilang
        pabrikNames.forEach((pabrik) => {
          normalizedData = setDefaultMissingData(normalizedData, pabrik);
        });

        setChartData(normalizedData);
      } catch (err) {
        setError("Gagal memuat data rendemen.");
      } finally {
        setLoading(false);
      }
    };

    fetchRendemenData();
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div>
        <SkeletonCardBig />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Generate an array of years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 10; i <= currentYear; i++) {
    years.push(i);
  }

  return (
    <div className="min-h-screen flex">
      {/* Konten Utama */}
      <div className="flex-1">
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Trend Historis Nilai Rendemen Hasil Prediksi
              </h2>
              <div className="flex gap-2">
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="border border-gray-300 rounded p-2"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="border border-gray-300 rounded p-2"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grafik */}
            {chartData.length === 0 ? (
              <p className="text-center text-gray-500">
                Data tidak tersedia untuk bulan ini.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    tickFormatter={(tickItem, index) =>
                      index % 5 === 0 ? tickItem : ""
                    }
                    domain={[1, "dataMax"]}
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 12]}
                    tickCount={13}
                    allowDecimals={false}
                  />
                  <Tooltip labelFormatter={(label) => `Tanggal ${label}`} />
                  <Legend />
                  {Object.keys(COLORS).map((pabrik) => (
                    <Line
                      key={pabrik}
                      type="monotone"
                      dataKey={pabrik}
                      stroke={COLORS[pabrik]}
                      activeDot={{ r: 8 }}
                      name={`Rendemen ${pabrik}`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
