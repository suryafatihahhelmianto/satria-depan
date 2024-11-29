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

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
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

        console.log("ini respon statistik: ", response.data);
        setChartData(
          response.data.map((entry) => ({
            day: new Date(entry.tanggal).getDate(),
            rendemen: entry.nilaiRendemen,
            // Dummy data for the second line (red line)
            rendemenDummy: Math.random() * 10 + 2, // Random data between 2 and 12
          }))
        );
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
                  <Line
                    type="monotone"
                    dataKey="rendemen"
                    stroke="#00C49F"
                    activeDot={{ r: 8 }}
                    name="Rendemen Pabrik Y (Dummy)"
                  />
                  {/* Line kedua berwarna merah (dummy data) */}
                  <Line
                    type="monotone"
                    dataKey="rendemenDummy"
                    stroke="red"
                    activeDot={{ r: 8 }}
                    name="Rendemen Pabrik X (Dummy)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
