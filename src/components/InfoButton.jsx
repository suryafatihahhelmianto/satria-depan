import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

const InfoButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTable = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <AiOutlineInfoCircle
        onClick={toggleTable}
        className="ml-2 font-semibold cursor-pointer"
      />

      {isOpen && (
        <div className="absolute bg-white p-4 shadow-lg rounded-md mt-2 z-10">
          <table className="min-w-full table-auto border-collapse mt-2">
            <thead>
              <tr>
                <th className="bg-ijoKepalaTabel px-4 py-2 text-left">
                  Nilai Indeks
                </th>
                <th className="bg-ijoKepalaTabel px-4 py-2 text-left">
                  Kategori
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { nilai: "0.00 - 25.00", kategori: "Tidak Berkelanjutan" },
                { nilai: "25.01 - 50.00", kategori: "Kurang Berkelanjutan" },
                { nilai: "50.01 - 75.00", kategori: "Cukup Berkelanjutan" },
                { nilai: "75.01 - 100.00", kategori: "Berkelanjutan" },
              ].map((row, index) => (
                <tr key={index} className="bg-ijoIsiTabel">
                  <td className="border border-gray-300 px-4 py-2">
                    {row.nilai}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
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
