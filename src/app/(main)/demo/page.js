"use client";

import { fetchData } from "@/tools/api";
import { useState } from "react";

export default function Demo() {
  // State for inputs
  const [polAmpas, setPolAmpas] = useState(0.0);
  const [polBlotong, setPolBlotong] = useState(0.0);
  const [polTetes, setPolTetes] = useState(0.0);
  const [rendemenKebun, setRendemenKebun] = useState(0.0);
  const [rendemenGerbang, setRendemenGerbang] = useState(0.0);
  const [rendemenNPP, setRendemenNPP] = useState(0.0);
  const [rendemenGula, setRendemenGula] = useState(0.0);
  const [kehilanganRendemen, setKehilanganRendemen] = useState(0.0);
  const [loading, setLoading] = useState(false); // New state for loading animation

  // Handle form submission and API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set loading to true when the form is submitted
    setLoading(true);

    // Prepare the payload to send to the API
    const data = {
      pol_ampas: parseFloat(polAmpas),
      pol_blotong: parseFloat(polBlotong),
      pol_tetes: parseFloat(polTetes),
      rendemen_kebun: parseFloat(rendemenKebun),
      rendemen_gerbang: parseFloat(rendemenGerbang),
      rendemen_NPP: parseFloat(rendemenNPP),
      rendemen_gula: parseFloat(rendemenGula),
    };

    try {
      // Use fetchData to send the POST request
      const result = await fetchData("/process-input", {
        method: "POST",
        data, // Payload to send
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Set the API response to state and stop loading
      console.log("API result", result);
      setKehilanganRendemen(result.potensi_kehilangan_produksi || null);
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      // Stop loading after the API call completes
      setLoading(false);
    }
  };

  return (
    <div className="text-white min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-ijoWasis p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Form Input Kehilangan Produksi (E2)
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pol ampas */}
          <div>
            <label className="block font-bold mb-1" htmlFor="polAmpas">
              Pol ampas (%) (Stasiun Gilingan)
            </label>
            <input
              id="polAmpas"
              type="number"
              step="0.01"
              value={polAmpas}
              onChange={(e) => setPolAmpas(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-black"
              required
            />
          </div>

          {/* Pol blotong */}
          <div>
            <label className="block font-bold mb-1" htmlFor="polBlotong">
              Pol blotong (%) (Stasiun Pemurnian)
            </label>
            <input
              id="polBlotong"
              type="number"
              step="0.01"
              value={polBlotong}
              onChange={(e) => setPolBlotong(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-black"
              required
            />
          </div>

          {/* Pol tetes */}
          <div>
            <label className="block font-bold mb-1" htmlFor="polTetes">
              Pol tetes (%) (Stasiun Putar)
            </label>
            <input
              id="polTetes"
              type="number"
              step="0.01"
              value={polTetes}
              onChange={(e) => setPolTetes(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-black"
              required
            />
          </div>

          {/* Kehilangan rendemen */}
          <div>
            <label className="block font-bold mb-1">
              Kehilangan rendemen (%)
            </label>
          </div>

          {/* Rendemen Kebun */}
          <div>
            <label className="block font-medium mb-1" htmlFor="rendemenKebun">
              Rendemen Kebun
            </label>
            <input
              id="rendemenKebun"
              type="number"
              step="0.01"
              value={rendemenKebun}
              onChange={(e) => setRendemenKebun(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-black"
              required
            />
          </div>

          {/* Rendemen Gerbang */}
          <div>
            <label className="block font-medium mb-1" htmlFor="rendemenGerbang">
              Rendemen Gerbang
            </label>
            <input
              id="rendemenGerbang"
              type="number"
              step="0.01"
              value={rendemenGerbang}
              onChange={(e) => setRendemenGerbang(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-black"
              required
            />
          </div>

          {/* Rendemen NPP */}
          <div>
            <label className="block font-medium mb-1" htmlFor="rendemenNPP">
              Rendemen NPP
            </label>
            <input
              id="rendemenNPP"
              type="number"
              step="0.01"
              value={rendemenNPP}
              onChange={(e) => setRendemenNPP(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-black"
              required
            />
          </div>

          {/* Rendemen Gula */}
          <div>
            <label className="block font-medium mb-1" htmlFor="rendemenGula">
              Rendemen Gula
            </label>
            <input
              id="rendemenGula"
              type="number"
              step="0.01"
              value={rendemenGula}
              onChange={(e) => setRendemenGula(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-black"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-ijoTebu text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Input Kehilangan Produksi (E2)
            </button>
          </div>
        </form>

        {/* Display Loading Spinner */}
        {loading && (
          <div className="mt-6 flex justify-center">
            <div className="loader"></div>
          </div>
        )}

        {/* Display Kehilangan Rendemen */}
        {!loading && kehilanganRendemen !== null && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold">
              Kehilangan Rendemen: {kehilanganRendemen.toFixed(3)}%
            </h2>
          </div>
        )}
      </div>

      {/* Loader styles */}
      <style jsx>{`
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
