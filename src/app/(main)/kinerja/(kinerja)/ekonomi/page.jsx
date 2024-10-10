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
    <div className="min-h-screen bg-gray-100 mb-24">
      <div>
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Tabel Input */}
          <h2 className="text-red-600 font-bold">
            Tingkat Risiko Rantai Pasok (E1)
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead className="bg-ijoKepalaTabel">
                <tr>
                  <th className="px-4 py-2 text-left">Sub Indikator</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-ijoIsiTabel">
                <tr className="border-b">
                  <td className="px-4 py-2">Tingkat Risiko Rantai Pasok</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      // value={formData}
                      onChange={handleInputChange}
                      className="border p-2 bg-ijoIsiTabel border-none"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleFinalize(key)}
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* E2 */}
          <h2 className="text-red-600 font-bold mt-5">
            Tingkat Luas Tanam TRI (E2)
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border rounded-lg shadow-md">
              <thead className="bg-ijoKepalaTabel">
                <tr>
                  <th className="px-4 py-2 text-left">Sub Indikator</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(formData).map((key) => (
                  <tr key={key} className="bg-ijoIsiTabel">
                    <td className="px-4 py-2">{getLabel(key)}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="p-2 bg-ijoIsiTabel"
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

          {/* E3 */}
          <h2 className="text-red-600 font-bold mt-5">
            Distribusi Keuntungan yang Adil (E3)
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead className="bg-ijoKepalaTabel">
                <tr>
                  <th className="px-4 py-2 text-left">Sub Indikator</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-ijoIsiTabel">
                <tr className="border-b">
                  <td className="px-4 py-2">Keuntungan Petani</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      // value={formData}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleFinalize(key)}
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Keuntungan BUMDES</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      // value={formData}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleFinalize(key)}
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* E4 */}
          <h2 className="text-red-600 font-bold mt-5">
            Harga Patokan Petani (E4)
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead className="bg-ijoKepalaTabel">
                <tr>
                  <th className="px-4 py-2 text-left">Sub Indikator</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-ijoIsiTabel">
                <tr className="border-b">
                  <td className="px-4 py-2">Harga Acuan/Referensi</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      // value={formData}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleFinalize(key)}
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Harga Lelang Gula</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      // value={formData}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleFinalize(key)}
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* E5 */}
          <h2 className="text-red-600 font-bold mt-5">
            Tingkat Ketangakasan (E5)
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead className="bg-ijoKepalaTabel">
                <tr>
                  <th className="px-4 py-2 text-left">Sub Indikator</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-ijoIsiTabel">
                <tr className="border-b">
                  <td className="px-4 py-2">SHS yang Dihasilkan Tahun Ini</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      // value={formData}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleFinalize(key)}
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
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
  };

  return labels[key] || key;
}
