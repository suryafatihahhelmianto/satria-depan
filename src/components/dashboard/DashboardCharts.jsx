"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DIMENSIONS,
  formatValue,
  monthlyPredictionData,
} from "@/tools/dashboard";
import styles from "./Dashboard.module.css";
const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e6edf7",
  fontSize: 12,
  color: "#11165c",
};
const tick = {
  fill: "#6777a4",
  fontSize: 11,
};
const series = [
  ["Index Total", "Indeks Total", "#43b653"],
  ["Dimensi Ekonomi", "Dimensi Ekonomi", "#098bff"],
  ["Dimensi Sosial", "Dimensi Sosial", "#ffb400"],
  ["Dimensi Lingkungan", "Dimensi Lingkungan", "#ff7718"],
  ["Dimensi Sumber Daya", "Dimensi Sumber Daya", "#9425d6"],
];
export function SustainabilityTrend({ data }) {
  if (!data?.length)
    return <ChartEmpty text="Belum ada data kinerja untuk ditampilkan." />;
  return (
    <div
      className={styles.chart}
      role="img"
      aria-label="Grafik tren nilai keberlanjutan dan empat dimensi per tahun"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 12,
            right: 10,
            left: -22,
            bottom: 0,
          }}
          barGap={3}
        >
          <CartesianGrid strokeDasharray="2 3" vertical stroke="#e0e8f3" />
          <XAxis
            dataKey="year"
            tick={tick}
            tickLine={false}
            axisLine={{
              stroke: "#bdc9dc",
            }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={tick}
            tickLine={false}
            axisLine={{
              stroke: "#bdc9dc",
            }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => formatValue(value)}
            cursor={{
              fill: "#f2f7fd",
            }}
          />
          <Legend
            iconType="square"
            iconSize={9}
            wrapperStyle={{
              fontSize: 10,
              paddingTop: 8,
            }}
          />
          {series.map(([key, name, color]) => (
            <Bar
              key={key}
              dataKey={key}
              name={name}
              fill={color}
              maxBarSize={23}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function PredictionTrend({ data }) {
  if (!data?.some((item) => item.prediksi != null))
    return <ChartEmpty text="Belum ada prediksi rendemen pada tahun ini." />;
  return (
    <div
      className={styles.chart}
      role="img"
      aria-label="Grafik rata-rata prediksi rendemen bulanan"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={monthlyPredictionData(data)}
          margin={{
            top: 12,
            right: 12,
            left: -22,
            bottom: 2,
          }}
        >
          <CartesianGrid stroke="#e7edf5" />
          <XAxis
            dataKey="bulan"
            tick={tick}
            tickLine={false}
            axisLine={{
              stroke: "#bdc9dc",
            }}
          />
          <YAxis
            domain={[0, "auto"]}
            tick={tick}
            tickLine={false}
            axisLine={{
              stroke: "#bdc9dc",
            }}
            unit="%"
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${formatValue(value)}%`, "Prediksi (ML)"]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{
              fontSize: 11,
              paddingBottom: 10,
            }}
          />
          <Line
            type="linear"
            dataKey="prediksi"
            name="Prediksi (ML)"
            stroke="#09b845"
            strokeWidth={2}
            strokeDasharray="7 4"
            dot={{
              r: 3,
              fill: "#09b845",
              strokeWidth: 0,
            }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export function DimensionRadar({ data }) {
  if (!data) return <ChartEmpty text="Nilai per dimensi belum tersedia." />;
  return (
    <div
      className={styles.radar}
      role="img"
      aria-label="Diagram radar sumber daya, ekonomi, lingkungan, dan sosial"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={DIMENSIONS.map((dimension) => ({
            label: dimension.label,
            value: data[dimension.key] ?? 0,
          }))}
          outerRadius="65%"
        >
          <PolarGrid stroke="#e0e7f2" />
          <PolarAngleAxis
            dataKey="label"
            tick={{
              fill: "#5f70a4",
              fontSize: 10,
            }}
          />
          <PolarRadiusAxis
            angle={45}
            domain={[0, 100]}
            tick={{
              fill: "#a0adc3",
              fontSize: 9,
            }}
            ticks={[25, 50, 75, 100]}
            axisLine={false}
          />
          <Radar
            name="Nilai dimensi"
            dataKey="value"
            stroke="#0589ff"
            fill="#0589ff"
            fillOpacity={0.12}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => `${formatValue(value)}%`}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function ChartEmpty({ text }) {
  return (
    <div className={styles.chartEmpty}>
      <BarChartPlaceholder />
      <span>{text}</span>
    </div>
  );
}
function BarChartPlaceholder() {
  return (
    <svg
      width="48"
      height="38"
      viewBox="0 0 48 38"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3 3v31h42" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 29V18m11 11V8m11 21V13"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
