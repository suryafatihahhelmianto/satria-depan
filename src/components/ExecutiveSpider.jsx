"use client";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import InfoButton from "./InfoButton";
import { formatNumberToIndonesian } from "@/tools/formatNumber";

// Warna hijau dalam berbagai shade
const GREEN_COLORS = {
  "PG Jatitujuh": "#15803d", // hijau dark
  "PG Tersana Baru": "#22c55e", // hijau medium
  "PG Sindang Laut": "#4ade80", // hijau light
};

// Variasi hijau lainnya untuk lebih banyak pabrik
const EXTRA_GREEN_COLORS = [
  "#16a34a", // green-600
  "#65a30d", // lime-600
  "#059669", // emerald-600
  "#0d9488", // teal-600
  "#0f766e", // teal-700
  "#047857", // emerald-700
  "#15803d", // green-700
];

// Custom render untuk axis label dengan Sumber Daya 2 baris
const renderPolarAngleAxisTick = ({ x, y, payload }) => {
  const { value } = payload;

  if (value === "Sumber Daya") {
    return (
      <text
        x={x}
        y={y}
        fill="#475569"
        textAnchor="middle"
        fontSize={13}
        dy={-5}
        dx={-20}
      >
        <tspan x={x} dy="0em">
          Sumber
        </tspan>
        <tspan x={x} dx={-20} dy="1.2em">
          Daya
        </tspan>
      </text>
    );
  }
  if (value === "Sosial") {
    return (
      <text
        x={x}
        y={y}
        fill="#475569"
        textAnchor="middle"
        fontSize={13}
        dx={14}
      >
        Sosial
      </text>
    );
  }
  if (value === "Lingkungan") {
    return (
      <text x={x} y={y} fill="#475569" textAnchor="middle" fontSize={13} dy={7}>
        Lingkungan
      </text>
    );
  }

  return (
    <text x={x} y={y} fill="#475569" textAnchor="middle" fontSize={13}>
      {" "}
      {/* DIBESARKAN LAGI */}
      {value}
    </text>
  );
};

export default function CompactSpiderChart({ data, compact = true }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="text-2xl mb-2 opacity-30">📊</div>
          <div className="text-gray-500 text-sm">No data available</div>
        </div>
      </div>
    );
  }

  const dimensions = ["Ekonomi", "Sosial", "Lingkungan", "Sumber Daya"];

  const formattedData = dimensions.map((dimension) => {
    const dimensionKey =
      dimension === "Ekonomi"
        ? "dimensiEkonomi"
        : dimension === "Sosial"
        ? "dimensiSosial"
        : dimension === "Lingkungan"
        ? "dimensiLingkungan"
        : "dimensiSDAM";

    const entry = { Dimensi: dimension };

    data.forEach((factory, index) => {
      entry[factory.namaPabrik || `Pabrik ${index + 1}`] = Math.round(
        ((factory[dimensionKey] || 0) * 10) / 10
      );
    });

    return entry;
  });

  if (compact) {
    return (
      <div className="relative w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={formattedData}
            cx="50%"
            cy="50%"
            outerRadius="90%" // DIBESARKAN LAGI dari 85%
            margin={{ top: 5, right: 5, bottom: 20, left: 5 }} // DIPERKECIL margin
          >
            <PolarGrid
              stroke="#e5e7eb"
              strokeWidth={0.5} // DIPERKECIL dari 1
              radialLines={false}
            />

            <PolarAngleAxis
              dataKey="Dimensi"
              stroke="#6b7280"
              tickLine={false}
              tick={renderPolarAngleAxisTick}
            />

            <PolarRadiusAxis
              angle={45}
              domain={[0, 100]}
              tickCount={4}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 11, fill: "#6b7280" }} // DIBESARKAN dikit
              axisLine={false}
              tickLine={false}
            />

            {data.map((factory, index) => {
              // Pilih warna hijau berdasarkan index
              const colorKey = factory.namaPabrik || `Pabrik ${index + 1}`;
              const color =
                GREEN_COLORS[colorKey] ||
                EXTRA_GREEN_COLORS[index % EXTRA_GREEN_COLORS.length];

              return (
                <Radar
                  key={factory.namaPabrik || index}
                  name={
                    factory.namaPabrik?.replace("PG ", "") ||
                    `Pabrik ${index + 1}`
                  }
                  dataKey={factory.namaPabrik || `Pabrik ${index + 1}`}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2} // DIPERKECIL opacity
                  strokeWidth={1.5} // DIPERKECIL dari 2.5
                  dot={false} // HAPUS DOT/BULETAN
                />
              );
            })}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Versi normal - juga disesuaikan
  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={formattedData}
          cx="50%"
          cy="50%"
          outerRadius="95%" // DIBESARKAN LAGI
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }} // DIPERKECIL margin
        >
          <PolarGrid
            stroke="#d1d5db"
            strokeWidth={0.5} // DIPERKECIL
            radialLines={false}
          />

          <PolarAngleAxis
            dataKey="Dimensi"
            stroke="#4b5563"
            fontSize={16} // DIBESARKAN LAGI
            tick={renderPolarAngleAxisTick}
          />

          <PolarRadiusAxis
            angle={45}
            domain={[0, 100]}
            tickCount={5}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 13, fill: "#4b5563" }} // DIBESARKAN
          />

          {data.map((factory, index) => {
            const colorKey = factory.namaPabrik || `Pabrik ${index + 1}`;
            const color =
              GREEN_COLORS[colorKey] ||
              EXTRA_GREEN_COLORS[index % EXTRA_GREEN_COLORS.length];

            return (
              <Radar
                key={factory.namaPabrik || index}
                name={
                  factory.namaPabrik?.replace("PG ", "") ||
                  `Pabrik ${index + 1}`
                }
                dataKey={factory.namaPabrik || `Pabrik ${index + 1}`}
                stroke={color}
                fill={color}
                fillOpacity={0.25} // DIPERKECIL
                strokeWidth={2} // DIPERKECIL dari 3
                dot={false} // HAPUS DOT/BULETAN
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend untuk versi normal */}
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        {data.map((factory, index) => {
          const colorKey = factory.namaPabrik || `Pabrik ${index + 1}`;
          const color =
            GREEN_COLORS[colorKey] ||
            EXTRA_GREEN_COLORS[index % EXTRA_GREEN_COLORS.length];

          return (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full" // DIPERKECIL
                style={{
                  backgroundColor: color,
                }}
              />
              <span className="text-sm font-medium text-gray-800">
                {factory.namaPabrik?.replace("PG ", "") ||
                  `Pabrik ${index + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
