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

const FACTORY_COLORS = {
  "PG Jatitujuh": "#a855f7",
  "PG Tersana Baru": "#3b82f6",
  "PG Sindang Laut": "#f97316",
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-xl">
        <div className="font-mono text-xs text-blue-400 mb-2 opacity-70">
          Detail Nilai
        </div>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="text-sm mb-1 font-semibold"
            style={{ color: entry.color }}
          >
            {entry.name}:{" "}
            <span className="font-bold">{entry.value?.toFixed(1) || 0}%</span>
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
    <div className="w-full p-3 rounded-2xl">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={formattedData} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis dataKey="Dimensi" stroke="#475569" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />

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
