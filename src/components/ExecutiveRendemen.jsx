"use client";

import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import Battery from "./ExecutiveBattery";

export function RendemenGaugeCard({ rataRataRendemen, rendemenKemarin }) {
  const selisih = rataRataRendemen - rendemenKemarin;
  const isNaik = selisih >= 0;

  const isBelumIsi = rataRataRendemen === 0;

  // Dynamic color based on rendemen category
  const getRendemenColor = (val) => {
    if (val < 5) return "text-red-600";
    if (val < 8) return "text-amber-600";
    return "text-emerald-600";
  };

  return (
    <div className="border-t border-blue-200/70 pt-3 relative">
      {/* Badge jika belum mengisi */}
      {isBelumIsi && (
        <div className="mb-1 absolute right-0 top-0 -translate-y-2 bg-orange-100 text-orange-700 border border-orange-300 text-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4" />
          Belum Diisi Oleh QC
        </div>
      )}

      <div className="flex justify-between items-center gap-2">
        {/* Left section */}
        <div>
          {/* Nilai hari ini */}
          <div
            className={`text-xl font-bold leading-none ${
              isBelumIsi ? "text-slate-400" : getRendemenColor(rataRataRendemen)
            }`}
          >
            {formatNumberToIndonesian(rataRataRendemen)}%
          </div>

          {/* Insight naik/turun – hide if belum isi */}
          {!isBelumIsi && (
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold mt-2 px-2 py-[2px] rounded-full w-fit
              ${
                isNaik
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-red-700 bg-red-100"
              }`}
            >
              {isNaik ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {isNaik ? "Naik" : "Turun"}{" "}
              {formatNumberToIndonesian(Math.abs(selisih))}%
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="scale-[0.95] origin-right opacity-100 mt-6">
          <Battery value={rataRataRendemen} maxValue={12} />
        </div>
      </div>
    </div>
  );
}
