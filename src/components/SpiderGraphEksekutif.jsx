import React from "react";
import {
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const SpiderGraphEksekutif = ({ data }) => {
  return (
    <ResponsiveContainer className="-z-30" width="100%" height={200}>
      <RadarChart outerRadius={40} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <Radar
          name="Kinerja"
          dataKey="A"
          stroke="#4472c4"
          strokeWidth={3}
          fillOpacity={0}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default SpiderGraphEksekutif;
