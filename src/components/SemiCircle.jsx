"use client";

export default function SemiCircle({ value, maxValue = 12 }) {
  const percentage = (value / maxValue) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  const getCategory = (val) => {
    if (val <= 4) return "Rendah";
    if (val <= 8) return "Sedang";
    return "Tinggi";
  };

  const getColor = (val) => {
    if (val <= 4) return "#ef4444";
    if (val <= 8) return "#eab308";
    return "#22c55e";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc - gradient from red to yellow to green */}
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="30"
            stroke={getColor(value)}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation} 100 90)`}
          />
          {/* Center circle */}
          <circle cx="100" cy="90" r="8" fill={getColor(value)} />
        </svg>
      </div>
      <div className="mt-2 text-xl font-semibold text-gray-700">
        {getCategory(value)}
      </div>
    </div>
  );
}
