
import React from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

interface LeadScorePolygonProps {
  scores: {
    engagement: number;
    firmographicFit: number;
    conversion: number;
  };
}

export const LeadScorePolygon = ({ scores }: LeadScorePolygonProps) => {
  const data = [
    { name: `Engagement`, value: scores.engagement },
    { name: `Firmographic Fit`, value: scores.firmographicFit },
    { name: `Conversion`, value: scores.conversion }
  ];

  const getScoreColor = (avgScore: number) => {
    if (avgScore >= 80) return "#22c55e"; // green-500
    if (avgScore >= 60) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  const averageScore = Math.round(
    (scores.engagement + scores.firmographicFit + scores.conversion) / 3
  );
  
  const scoreColor = getScoreColor(averageScore);

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="60%" outerRadius="90%" data={data}>
        <PolarGrid />
          <PolarAngleAxis
            dataKey="name"
            tick={(props) => {
              const { x, y, cx, cy, payload, index } = props;
              // Get the corresponding value for this category
              const value = data[index].value;

              return (
                <g>
                  {/* Category name */}
                  <text
                    x={x}
                    y={cy - y > 0?y:y+12}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize={12}
                  >
                    {payload.value}
                  </text>
                  {/* Value display - positioned below the category name */}
                  <text
                    x={x}
                    y={cy - y > 0?y - 16:y+28} // +16 places it below the category name
                    textAnchor="middle"
                    fill={scoreColor}
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {value}
                  </text>
                </g>
              );
            }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
          <Radar
            name="Score"
            dataKey="value"
            stroke={scoreColor}
            fill={scoreColor}
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};