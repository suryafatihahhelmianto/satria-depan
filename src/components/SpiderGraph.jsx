import React from "react";
import {
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const SpiderGraph = ({ data }) => {
  return (
    <ResponsiveContainer className="-z-30" width="100%" height={300}>
      <RadarChart outerRadius={90} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
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

export default SpiderGraph;
