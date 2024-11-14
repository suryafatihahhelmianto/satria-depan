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

export default function RendemenStatisticsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
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

  useEffect(() => {
    const fetchRendemenData = async () => {
      try {
        setLoading(true);
        const response = await fetchData(
          `/api/rendemen/statistics?month=${selectedMonth}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );

        console.log("ini respon statistik: ", response.data);
        setChartData(response.data);
      } catch (err) {
        setError("Gagal memuat data rendemen.");
      } finally {
        setLoading(false);
      }
    };

    fetchRendemenData();
  }, [selectedMonth]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Konten Utama */}
      <div className="flex-1">
        {/* Konten Utama */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Historis Rendemen (Prediksi)
              </h2>
              <div>
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
                <YAxis domain={[0, 12]} tickCount={13} allowDecimals={false} />
                <Tooltip labelFormatter={(label) => `Tanggal ${label}`} />
                <Legend />
                {/* Garis Prediksi Rendemen */}
                <Line
                  type="monotone"
                  dataKey="rendemen"
                  stroke="#00C49F" // Warna hijau
                  activeDot={{ r: 8 }}
                  name="Rendemen Prediksi"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
