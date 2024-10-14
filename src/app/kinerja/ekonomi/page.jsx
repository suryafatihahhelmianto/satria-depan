'use client';

import { useState } from "react";

export default function DataKinerja() {
  const [formData, setFormData] = useState({
    tingkatRisikoRantaiPasok: 0, // Adding the specific E1 indicator
    polAmpas: 0, // E2 indicators
    polBlotong: 0,
    polTetes: 0,
    rendemenKebun: 0,
    rendemenGerbang: 0,
    rendemenNPP: 0,
    rendemenGula: 0,
  });

  const [finalizedData, setFinalizedData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),
    }));
  };

  const handleFinalize = (key) => {
    setFinalizedData((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <form className="mt-6">
        {/* Card Wrapper for E1 */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 mb-6">
          {/* Tingkat Risiko Rantai Pasok (E1) */}
          <h2 className="text-red-600 font-bold mb-4">Tingkat Risiko Rantai Pasok (E1)</h2>
          <div className="overflow-x-auto">
            <table
              className="min-w-full bg-green-100 border rounded-lg shadow-md"
              style={{ borderSpacing: "0 100px" }} // Adding spacing between rows
            >
              <thead className="bg-ijoKepalaTabel">
                <tr>
                  <th className="px-4 py-2 text-left">Sub Indikator</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-ijoIsiTabel">
                <tr className="border-b bg-ijoIsiTabel"> {/* Thick white gap between rows */}
                  <td className="px-4 py-2 font-bold">Tingkat Risiko Rantai Pasok</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      name="tingkatRisikoRantaiPasok"
                      value={formData.tingkatRisikoRantaiPasok}
                      onChange={handleInputChange}
                      className="border p-2 bg-ijoIsiTabel w-full"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleFinalize("tingkatRisikoRantaiPasok")}
                      className={`p-2 rounded ${
                        finalizedData.tingkatRisikoRantaiPasok ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-red-600 font-bold mb-4">Potensi Kehilangan Produksi (E2)</h2>
          <div className="overflow-x-auto">
            <table
              className="min-w-full bg-green-100 border rounded-lg shadow-md"
              style={{ borderSpacing: "0 500px" }} // Adding spacing between rows
            >
              <thead className="bg-ijoKepalaTabel">
                <tr>
                  <th className="px-4 py-2 text-left">Sub Indikator</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-ijoIsiTabel border-0">
                {[
                  { key: "polAmpas", label: "Kehilangan Pol Ampas" },
                  { key: "polBlotong", label: "Kehilangan Pol Blotong" },
                  { key: "polTetes", label: "Kehilangan Pol Tetes" },
                  { key: "rendemenKebun", label: "Kehilangan Rendemen Kebun" },
                  { key: "rendemenGerbang", label: "Kehilangan Rendemen Gerbang" },
                  { key: "rendemenNPP", label: "Kehilangan Rendemen NPP" },
                  { key: "rendemenGula", label: "Kehilangan Rendemen Gula" },
                ].map(({ key, label }) => (
                  <tr key={key} className="border-b bg-ijoIsiTabel"> {/* Thick white gap between rows */}
                    <td className="px-4 py-2 font-bold">{label}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="border p-2 bg-ijoIsiTabel w-full"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleFinalize(key)}
                        className={`p-2 rounded ${
                          finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        ✔️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}
