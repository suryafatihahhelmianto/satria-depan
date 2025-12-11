"use client";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import InfoButton from "./InfoButton";
import { formatNumberToIndonesian } from "@/tools/formatNumber";

const FACTORY_COLORS = {
  "PG Jatitujuh": "#b8860b",
  "PG Tersana Baru": "#c4b7a6",
  "PG Sindang Laut": "#6b8e23",
};

// Custom render untuk axis label
const renderPolarAngleAxisTick = ({ x, y, payload }) => {
  const { value } = payload;
  let displayValue = value;

  // Split "Sumber Daya" menjadi 2 baris
  if (value === "Sumber Daya") {
    displayValue = (
      <tspan>
        <tspan x={x} dy="0em">
          Sumber
        </tspan>
        <tspan x={x} dy="1.2em">
          Daya
        </tspan>
      </tspan>
    );
  }

  return (
    <text
      x={x}
      y={y}
      fill="#475569"
      textAnchor="middle"
      fontSize={12}
      dy={value === "Sumber Daya" ? -10 : 0} // Adjust position for 2-line text
    >
      {displayValue}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-xl">
        <div className="font-mono text-xs text-emerald-600 mb-2 opacity-70">
          Detail Nilai
        </div>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="text-sm mb-1 font-semibold"
            style={{ color: entry.color }}
          >
            {entry.name}:{" "}
            <span className="font-bold">
              {formatNumberToIndonesian(entry.value) || 0}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function SpiderChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 rounded-xl border border-blue-200/50 bg-gradient-to-br from-white to-blue-50 shadow-lg">
        <div className="text-center">
          <div className="text-4xl mb-3 opacity-50">📊</div>
          <div className="text-gray-600 font-medium">
            Data spider chart tidak tersedia
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Silakan pilih periode yang valid
          </div>
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

    data.forEach((factory) => {
      entry[factory.namaPabrik || "Unknown"] = Math.round(
        ((factory[dimensionKey] || 0) * 10) / 10
      );
    });

    return entry;
  });

  return (
    <div className="relative w-full p-1 rounded-2xl">
      <div className="z-10 absolute top-3 right-3 cursor-pointer">
        <div className="relative group">
          <InfoButton />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Click Me!
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={formattedData} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis
            dataKey="Dimensi"
            stroke="#475569"
            tick={renderPolarAngleAxisTick}
          />
          <PolarRadiusAxis
            angle={45}
            domain={[0, 100]}
            tickCount={5}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            verticalAlign="top"
            align="left"
            wrapperStyle={{ top: 0, left: 0, padding: "10px" }}
          />

          {data.map((factory, index) => (
            <Radar
              key={factory.namaPabrik || index}
              name={factory.namaPabrik || `Factory ${index + 1}`}
              dataKey={factory.namaPabrik || `Factory ${index + 1}`}
              stroke={Object.values(FACTORY_COLORS)[index] || "#3b82f6"}
              fill={Object.values(FACTORY_COLORS)[index] || "#3b82f6"}
              fillOpacity={0.3}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
