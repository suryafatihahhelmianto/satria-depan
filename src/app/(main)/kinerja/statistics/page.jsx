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

export default function KinerjaStatisticsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKinerjaData = async () => {
      try {
        setLoading(true);
        const response = await fetchData(`/api/sesi/statistics`, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });

        console.log("Ini respon statistik kinerja: ", response.data);
        // Transform data from API response
        setChartData(
          response.data.map((entry) => ({
            tahun: entry.tahun, // Using the `tahun` from the response
            nilaiIndeks: entry.instrumenNilai.nilaiKinerja, // Access `nilaiKinerja` from `instrumenNilai`
          }))
        );
      } catch (err) {
        setError("Gagal memuat data kinerja.");
      } finally {
        setLoading(false);
      }
    };

    fetchKinerjaData();
  }, [selectedYear]);

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

  return (
    <div className="min-h-screen flex">
      {/* Konten Utama */}
      <div className="flex-1">
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Statistik Kinerja</h2>
            </div>

            {/* Grafik */}
            {chartData.length === 0 ? (
              <p className="text-center text-gray-500">Data tidak tersedia</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="tahun"
                    tickFormatter={(tickItem, index) =>
                      index % 1 === 0 ? tickItem : ""
                    }
                    domain={["dataMin", "dataMax"]}
                    interval={0}
                  />
                  <YAxis
                    domain={[0, "dataMax"]}
                    tickCount={10}
                    allowDecimals={false}
                  />
                  <Tooltip labelFormatter={(label) => `Tahun ${label}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="nilaiIndeks"
                    stroke="#00C49F"
                    activeDot={{ r: 8 }}
                    name="Nilai Indeks Kinerja"
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
