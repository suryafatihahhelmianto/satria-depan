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

        // Set data langsung dari respons API
        setChartData(response.data);
      } catch (err) {
        setError("Gagal memuat data kinerja.");
      } finally {
        setLoading(false);
      }
    };

    fetchKinerjaData();
  }, []);

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

  if (chartData.length === 0) {
    return <p className="text-center text-gray-500">Data tidak tersedia</p>;
  }

  // Ambil nama-nama pabrik untuk membuat garis
  const pabrikNames = Object.keys(chartData[0] || {}).filter(
    (key) => key !== "tahun"
  );

  // Warna tetap untuk pabrik
  const COLORS = ["#FF5733", "#33C4FF", "#FF33A6", "#33FF57", "#FFC300"];

  return (
    <div className="min-h-screen flex">
      <div className="flex-1">
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Statistik Kinerja</h2>
            </div>

            {/* Grafik */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="tahun"
                  tickFormatter={(tickItem) => `Tahun ${tickItem}`}
                  domain={["dataMin", "dataMax"]}
                />
                <YAxis
                  domain={[0, "dataMax"]}
                  tickCount={10}
                  allowDecimals={false}
                />
                <Tooltip labelFormatter={(label) => `Tahun ${label}`} />
                <Legend />

                {/* Buat Line untuk setiap pabrik */}
                {pabrikNames.map((pabrikName, index) => (
                  <Line
                    key={pabrikName}
                    type="monotone"
                    dataKey={pabrikName}
                    name={`Nilai Indeks - ${pabrikName}`}
                    stroke={COLORS[index % COLORS.length]} // Warna tetap
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
