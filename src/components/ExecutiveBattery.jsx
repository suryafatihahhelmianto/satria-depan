"use client";

export default function BatteryHorizontal({ value, maxValue = 12 }) {
  const percentage = (value / maxValue) * 100;

  const getColor = (val) => {
    if (val <= maxValue * 0.33) return "#ef4444"; // merah
    if (val <= maxValue * 0.66) return "#eab308"; // kuning
    return "#22c55e"; // hijau
  };

  const getKategori = (val) => {
    if (val <= maxValue * 0.33) return "RENDAH";
    if (val <= maxValue * 0.66) return "SEDANG";
    return "TINGGI";
  };

  return (
    <div className="flex flex-col items-center">
      {/* Battery container horizontal */}
      <div className="flex items-center">
        {/* Body battery */}
        <div className="w-40 h-10 border-2 border-gray-500 rounded-md flex items-center p-1">
          <div
            className="h-full rounded-sm transition-all duration-300"
            style={{
              width: `${percentage}%`,
              backgroundColor: getColor(value),
            }}
          ></div>
        </div>

        {/* Head */}
        <div className="w-2 h-5 bg-gray-500 rounded-r-md ml-1"></div>
      </div>

      {/* Kategori */}
      <p className="text-sm font-bold mt-1" style={{ color: getColor(value) }}>
        {getKategori(value)}
      </p>
    </div>
  );
}
