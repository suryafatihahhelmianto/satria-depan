import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

const InfoButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTable = () => setIsOpen(!isOpen);

  const getColor = (kategori) => {
    switch (kategori) {
      case "Tidak Berkelanjutan":
        return "text-red-600 border-red-500/40 bg-red-500/10";
      case "Kurang Berkelanjutan":
        return "text-yellow-600 border-yellow-500/40 bg-yellow-500/10";
      case "Cukup Berkelanjutan":
        return "text-green-600 border-green-500/40 bg-green-500/10";
      case "Berkelanjutan":
        return "text-emerald-600 border-emerald-500/40 bg-emerald-500/10";
      default:
        return "";
    }
  };

  return (
    <div className="relative inline-block group">
      {/* Tooltip "Click Me!" */}
      <div
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                      bg-black text-white text-xs px-2 py-1 rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity 
                      pointer-events-none whitespace-nowrap z-30"
      >
        Click Me!
      </div>

      <AiOutlineInfoCircle
        size={20}
        onClick={toggleTable}
        className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer 
                   transition-colors duration-200"
      />

      {isOpen && (
        <div
          className="absolute right-0 mt-2 z-20 p-4 rounded-xl shadow-xl
                     bg-white/20 backdrop-blur-xl border border-white/30 
                     min-w-[280px] w-[330px]"
        >
          <table className="w-full table-fixed border border-gray-300/50 rounded-lg overflow-hidden">
            <thead>
              <tr className="text-gray-800 text-xs">
                <th className="px-3 py-2 text-center font-semibold border-b border-gray-300/50">
                  Nilai Indeks
                </th>
                <th className="px-3 py-2 text-center font-semibold border-b border-gray-300/50">
                  Kategori
                </th>
              </tr>
            </thead>

            <tbody>
              {[
                { nilai: "0,00 - 25,00", kategori: "Tidak Berkelanjutan" },
                { nilai: "25,01 - 50,00", kategori: "Kurang Berkelanjutan" },
                { nilai: "50,01 - 75,00", kategori: "Cukup Berkelanjutan" },
                { nilai: "75,01 - 100,00", kategori: "Berkelanjutan" },
              ].map((row, index) => (
                <tr key={index} className="text-center text-xs">
                  <td
                    className={`px-3 py-2 border border-gray-300/40 font-medium ${getColor(
                      row.kategori
                    )}`}
                  >
                    {row.nilai}
                  </td>
                  <td
                    className={`px-3 py-2 border border-gray-300/40 font-medium ${getColor(
                      row.kategori
                    )}`}
                  >
                    {row.kategori}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InfoButton;
