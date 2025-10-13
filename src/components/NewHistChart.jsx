"use client";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from "recharts";

export default function NewHistChart({ data }) {
  // Warna latar label angka
  const getLabelBg = (value) => {
    if (value >= 75) return "#2196F3"; // biru
    if (value >= 50) return "#4CAF50"; // hijau
    if (value >= 25) return "#FFC107"; // kuning
    return "#F44336"; // merah
  };

  // Custom label renderer
  const renderCustomLabel = (props) => {
    const { x, y, value } = props;
    const bg = getLabelBg(value);
    const textWidth = String(value).length * 6.5;
    const rectWidth = textWidth + 10;
    const rectX = x - rectWidth / 2 + 5;

    return (
      <g>
        <rect
          x={rectX}
          y={y - 22}
          width={rectWidth}
          height={16}
          rx={4}
          ry={4}
          fill={bg}
        />
        <text
          x={x + 5}
          y={y - 10}
          fill="#fff"
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart data={data}>
        {/* Grid utama */}
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

        {/* Garis bantu horizontal di 25, 50, 75, 100 */}
        <ReferenceLine y={25} stroke="#ccc" strokeDasharray="4 4" />
        <ReferenceLine y={50} stroke="#ccc" strokeDasharray="4 4" />
        <ReferenceLine y={75} stroke="#ccc" strokeDasharray="4 4" />
        <ReferenceLine y={100} stroke="#ccc" strokeDasharray="4 4" />

        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
        <Tooltip />

        {/* Legend di bawah tengah */}
        <Legend
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            fontSize: "12px",
            marginTop: "8px",
          }}
        />

        {/* Bar hijau */}
        <Bar dataKey="Index Total" fill="#4CAF50" barSize={35}>
          <LabelList
            dataKey="Index Total"
            content={renderCustomLabel}
            position="top"
          />
        </Bar>

        {/* Garis biru halus */}
        <Line
          type="monotone"
          dataKey="Index Total"
          stroke="#2196F3"
          strokeWidth={1.8}
          dot={{ fill: "#2196F3", r: 4 }}
          activeDot={{ r: 6 }}
          isAnimationActive={true}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
