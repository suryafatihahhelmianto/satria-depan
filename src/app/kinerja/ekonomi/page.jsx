"use client";

import OpsiDimensi from "@/components/OpsiDimensi";
import { useState } from "react";

export default function DataKinerja() {
  const [formData, setFormData] = useState({
    polAmpas: 0,
    polBlotong: 0,
    polTetes: 0,
    rendemenKebun: 0,
    rendemenGerbang: 0,
    rendemenNPP: 0,
    rendemenGula: 0,
    keuntunganEPtani: 0,
    keuntunganBUMDes: 0,
    hargaAcuan: 0,
    hargaLelangGula: 0,
    shs: 0,
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [finalizedData, setFinalizedData] = useState({}); // State to track finalized data

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value), // Convert input value to number
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  // Handle finalize data for each input
  const handleFinalize = (key) => {
    setFinalizedData((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Tabel Input */}
          <h2 className="text-red-600 font-bold mt-10">
            Tingkat Risiko Rantai Pasok (E1)
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left">Keterangan</th>
                  <th className="px-4 py-2 text-left">Nilai</th>
                  <th className="px-4 py-2 text-left">Finalisasi</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(formData).map((key) => (
                  <tr key={key} className="border-b">
                    <td className="px-4 py-2">{getLabel(key)}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="border p-2 bg-white"
                      />
                    </td>
                    <td className="px-4 py-2">
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

          <h2 className="text-red-600 font-bold">
            Tingkat Luas Tanam TRI (E2)
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left">Keterangan</th>
                  <th className="px-4 py-2 text-left">Nilai</th>
                  <th className="px-4 py-2 text-left">Finalisasi</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(formData).map((key) => (
                  <tr key={key} className="border-b">
                    <td className="px-4 py-2">{getLabel(key)}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="border p-2 bg-white"
                      />
                    </td>
                    <td className="px-4 py-2">
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

          {/* Submit Button */}
          {/* <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800"
            >
              Kirim Data
            </button>
          </div> */}
        </form>

        {/* Display Submitted Data */}
        {submittedData && (
          <div className="mt-8">
            <h2 className="text-xl font-bold">Submitted Data</h2>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to map key to readable label
function getLabel(key) {
  const labels = {
    polAmpas: "Kehilangan Pol Ampas",
    polBlotong: "Kehilangan Pol Blotong",
    polTetes: "Kehilangan Pol Tetes",
    rendemenKebun: "Kehilangan Rendemen Kebun",
    rendemenGerbang: "Kehilangan Rendemen Gerbang",
    rendemenNPP: "Kehilangan Rendemen NPP",
    rendemenGula: "Kehilangan Rendemen Gula",
    keuntunganEPtani: "Keuntungan ePtani",
    keuntunganBUMDes: "Keuntungan BUMDES",
    hargaAcuan: "Harga Acuan / Referensi",
    hargaLelangGula: "Harga Lelang Gula",
    shs: "SHS yang Dihasilkan Tahun Ini",
  };

  return labels[key] || key;
}
