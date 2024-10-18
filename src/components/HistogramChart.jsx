import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const HistogramChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* Each Bar corresponds to a different dimension */}
        <Bar dataKey="Index Total" fill="#4CAF50" />
        <Bar dataKey="Dimensi Ekonomi" fill="#2196F3" />
        <Bar dataKey="Dimensi Sosial" fill="#FFC107" />
        <Bar dataKey="Dimensi Lingkungan" fill="#FF5722" />
        <Bar dataKey="Dimensi Sumber Daya" fill="#9C27B0" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HistogramChart;
