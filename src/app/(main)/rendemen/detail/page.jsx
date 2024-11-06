"use client";

import { useState } from "react";
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

export default function PredictionPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11

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

  // Fungsi untuk mendapatkan jumlah hari dalam bulan
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Fungsi untuk menghitung trendline dari 'rendemen'
  const calculateTrendline = (data, key) => {
    const n = data.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    data.forEach((point) => {
      const x = point.day;
      const y = point[key];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const trendlineData = data.map((point) => {
      const x = point.day;
      const y = slope * x + intercept;
      return { day: x, [key + "_trend"]: y };
    });

    return trendlineData;
  };

  // Fungsi untuk menghasilkan data grafik
  const generateChartData = () => {
    const year = new Date().getFullYear();
    const daysInMonth = getDaysInMonth(selectedMonth, year);

    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      // Menghasilkan nilai rendemen acak antara 6 dan 12
      const rendemenValue = parseFloat((Math.random() * 6 + 6).toFixed(2));
      // Menghasilkan nilai actual acak antara 6 dan 12
      const actualValue = parseFloat((Math.random() * 6 + 6).toFixed(2));

      data.push({
        day: day,
        rendemen: rendemenValue,
        actual: actualValue,
      });
    }

    // Menghitung trendline untuk 'rendemen'
    const trendlineData = calculateTrendline(data, "rendemen");

    // Menggabungkan data trendline dengan data asli
    const mergedData = data.map((point, index) => ({
      ...point,
      rendemen_trend: trendlineData[index].rendemen_trend,
    }));

    return mergedData;
  };

  const chartData = generateChartData();

  return (
    <div className="min-h-screen flex">
      {/* Konten Utama */}
      <div className="flex-1">
        {/* Konten Utama */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Historis Rendemen</h2>
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
                {/* Garis Actual dengan warna hijau terang */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#32CD32" // Warna hijau terang
                  activeDot={{ r: 8 }}
                  name="Actual"
                />
                {/* Garis Rendemen dengan warna hijau */}
                <Line
                  type="monotone"
                  dataKey="rendemen"
                  stroke="#00C49F" // Warna hijau
                  activeDot={{ r: 8 }}
                  name="Rendemen"
                />
                {/* Garis Trendline dengan warna hijau lebih tua */}
                <Line
                  type="linear"
                  dataKey="rendemen_trend"
                  stroke="#006400" // Warna hijau lebih tua
                  dot={false}
                  strokeDasharray="5 5"
                  name="Trendline"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
