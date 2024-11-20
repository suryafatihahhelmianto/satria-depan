"use client";

import { useState } from "react";
import { BarChart2, TrendingUp } from "lucide-react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";

export default function TestInputPage() {
  const [indeks, setIndeks] = useState(0);
  const [rendemen, setRendemen] = useState(0);

  const [sustainabilityIndex, setSustainabilityIndex] = useState({
    ekonomi: "",
    lingkungan: "",
    sosial: "",
    sdam: "",
  });

  const [yieldValues, setYieldValues] = useState({
    brix: "",
    pol: "",
    nn: "",
    hk: "",
    fk: "",
  });

  const [results, setResults] = useState({
    sustainabilityIndex: null,
    yield: null,
  });

  const [loading, setLoading] = useState({
    sustainability: false,
    yield: false,
  });

  const [error, setError] = useState({
    sustainability: null,
    yield: null,
  });

  const handleSustainabilityChange = (e) => {
    setSustainabilityIndex({
      ...sustainabilityIndex,
      [e.target.name]: e.target.value,
    });
  };

  const handleYieldChange = (e) => {
    setYieldValues({
      ...yieldValues,
      [e.target.name]: e.target.value,
    });
  };

  const calculateSustainabilityIndex = async () => {
    setLoading((prev) => ({ ...prev, sustainability: true }));
    setError((prev) => ({ ...prev, sustainability: null }));

    console.log("ini data kriim: ", sustainabilityIndex);

    try {
      const response = await fetchData("/api/dimensi/calculate/anfis", {
        method: "POST",
        data: sustainabilityIndex,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      console.log("ini respon: ", response);

      // if (!response.ok) {
      //   throw new Error("Failed to calculate sustainability index");
      // }

      const data = await response.predicted_sustainability;
      console.log("ini data: ", data);
      setResults((prev) => ({ ...prev, sustainabilityIndex: data }));
      setIndeks(data);
    } catch (err) {
      setError((prev) => ({ ...prev, sustainability: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, sustainability: false }));
    }
  };

  const calculateYield = async () => {
    setLoading((prev) => ({ ...prev, yield: true }));
    setError((prev) => ({ ...prev, yield: null }));

    try {
      const response = await fetchData("/api/dimensi/calculate/rendemen", {
        method: "POST",
        data: yieldValues,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        // body: JSON.stringify(yieldValues),
      });

      const data = await response.predicted_rendemen;
      setResults((prev) => ({ ...prev, yield: data }));
    } catch (err) {
      setError((prev) => ({ ...prev, yield: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, yield: false }));
    }
  };

  const handleSustainabilitySubmit = (e) => {
    e.preventDefault();
    calculateSustainabilityIndex();
  };

  const handleYieldSubmit = (e) => {
    e.preventDefault();
    calculateYield();
  };

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
          Uji Input Indeks Keberlanjutan dan Rendemen
        </h1>

        <div className="space-y-8">
          <form
            onSubmit={handleSustainabilitySubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <BarChart2 className="mr-2" /> Indeks Keberlanjutan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="ekonomi"
                  className="block text-sm font-medium text-green-600"
                >
                  Dimensi Ekonomi
                </label>
                <input
                  type="text"
                  id="ekonomi"
                  name="ekonomi"
                  value={sustainabilityIndex.ekonomi}
                  onChange={handleSustainabilityChange}
                  required
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="lingkungan"
                  className="block text-sm font-medium text-green-600"
                >
                  Dimensi Lingkungan
                </label>
                <input
                  type="text"
                  id="lingkungan"
                  name="lingkungan"
                  value={sustainabilityIndex.lingkungan}
                  onChange={handleSustainabilityChange}
                  required
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="sosial"
                  className="block text-sm font-medium text-green-600"
                >
                  Dimensi Sosial
                </label>
                <input
                  type="text"
                  id="sosial"
                  name="sosial"
                  value={sustainabilityIndex.sosial}
                  onChange={handleSustainabilityChange}
                  required
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="sdam"
                  className="block text-sm font-medium text-green-600"
                >
                  Dimensi Sumber Daya
                </label>
                <input
                  type="text"
                  id="sdam"
                  name="sdam"
                  value={sustainabilityIndex.sdam}
                  onChange={handleSustainabilityChange}
                  required
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading.sustainability}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading.sustainability
                ? "Menghitung..."
                : "Hitung Indeks Keberlanjutan"}
            </button>
            {error.sustainability && (
              <p className="mt-2 text-red-600 text-sm">
                {error.sustainability}
              </p>
            )}
          </form>

          <form
            onSubmit={handleYieldSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <TrendingUp className="mr-2" /> Rendemen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {["brix", "pol", "nn", "hk", "fk"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-green-600 capitalize"
                  >
                    {field.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    id={field}
                    name={field}
                    value={yieldValues[field]}
                    onChange={handleYieldChange}
                    required
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading.yield}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading.yield ? "Menghitung..." : "Hitung Rendemen"}
            </button>
            {error.yield && (
              <p className="mt-2 text-red-600 text-sm">{error.yield}</p>
            )}
          </form>

          {(results.sustainabilityIndex !== null || results.yield !== null) && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-green-700 mb-4">
                Hasil Perhitungan
              </h2>
              {results.sustainabilityIndex !== null && (
                <p className="text-green-600">
                  Indeks Keberlanjutan:{" "}
                  <span className="font-bold">
                    {results.sustainabilityIndex}
                  </span>
                </p>
              )}
              {results.yield !== null && (
                <p className="text-green-600">
                  Rendemen: <span className="font-bold">{results.yield}</span>
                </p>
              )}
            </div>
          )}
          {/* <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Hasil Perhitungan
            </h2>

            <p className="text-green-600">
              Indeks Keberlanjutan: <span className="font-bold">{indeks}</span>
            </p>

            <p className="text-green-600">
              Rendemen: <span className="font-bold">{rendemen}</span>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
