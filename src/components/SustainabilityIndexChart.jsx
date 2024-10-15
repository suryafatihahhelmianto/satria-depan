import React from "react";
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

const SustainabilityIndexChart = () => {
  const data = [
    { year: 2020, index: 40 },
    { year: 2021, index: 50 },
    { year: 2022, index: 30 },
    { year: 2023, index: 60 },
    { year: 2024, index: 40 },
  ];

  return (
    <div className="chart-container">
      <h2 className="text-xl font-semibold mb-4">
        Indeks Keberlanjutan (2020-2024)
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="index"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SustainabilityIndexChart;
