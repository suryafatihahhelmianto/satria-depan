import React from "react";

export default function LingkunganPage() {
  return (
    <div className="mt-5 bg-gray-100">
      <div>
        {/* Dimensi and Kinerja Dimensi Table */}
        <div>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="bg-ijoKepalaTabel px-4 py-2 text-left">
                  Dimensi
                </th>
                <th className="bg-ijoKepalaTabel px-4 py-2 text-left">
                  Kinerja Dimensi
                </th>
              </tr>
            </thead>
            <tbody>
              {["Sumber Daya", "Ekonomi", "Lingkungan", "Sosial"].map(
                (dimensi, index) => (
                  <tr key={index} className="bg-ijoIsiTabel">
                    <td className="border border-gray-300 px-4 py-2">
                      {dimensi}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-400">
                      Data
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {/* Hitung Button */}
          <div className="mt-8 text-end">
            <button className="bg-gray-400 px-6 py-2 rounded-lg">Hitung</button>
          </div>
        </div>

        {/* Nilai Indeks Table */}
        <div className="grid grid-cols-2 gap-5 mt-5">
          <table className="min-w-full table-auto border-collapse mt-8">
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

          {/* Kinerja Rantai Pasok */}
          <div className="bg-ijoIsiTabel">
            <h2 className="bg-ijoKepalaTabel">Kinerja Rantai Pasok</h2>
            <p className="text-gray-400 text-center py-20">Nilai Prediksi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
