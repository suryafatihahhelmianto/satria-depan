"use client";

import { fetchData } from "@/tools/api";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCookie } from "@/tools/getCookie";

export default function DataKinerja() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/); // Menangkap ID yang ada setelah /kinerja/
  const sesiId = idMatch ? idMatch[1] : null; // Ambil ID jika ada

  const [rantaiPasok, setRantaiPasok] = useState(0);
  const [polAmpas, setPolAmpas] = useState(0);
  const [polBlotong, setPolBlotong] = useState(0);
  const [polTetes, setPolTetes] = useState(0);
  const [rendemenKebun, setRendemenKebun] = useState(0);
  const [rendemenGerbang, setRendemenGerbang] = useState(0);
  const [rendemenNPP, setRendemenNPP] = useState(0);
  const [rendemenGula, setRendemenGula] = useState(0);
  const [keuntunganPetani, setKeuntunganPetani] = useState(0);
  const [keuntunganBumdes, setKeuntunganBumdes] = useState(0);
  const [hargaAcuan, setHargaAcuan] = useState(0);
  const [hargaLelang, setHargaLelang] = useState(0);
  const [produksiTahunIni, setProduksiTahunIni] = useState(0);
  const [produksiTahunLalu, setProduksiTahunLalu] = useState(0);
  const [penjualanGula, setTotalPenjualanGula] = useState(0);

  const [formDataE2, setFormDataE2] = useState({
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

  const fetchEkonomi = async () => {
    try {
      const response = await fetchData(`/api/masukkan/ekonomi/${sesiId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`, // Ambil token dari localStorage
        },
      }); // Replace with the correct endpoint
      console.log("ini data eknomi: ", response);

      setRantaiPasok(response.nilaiRisiko);
      setPolAmpas(response.polAmpas);
      setPolBlotong(response.polBlotong);
      setPolTetes(response.polTetes);
      setRendemenKebun(response.rendemenKebun);
      setRendemenGerbang(response.rendemenGerbang);
      setRendemenNPP(response.rendemenNPP);
      setRendemenGula(response.rendemenGUla);
      setKeuntunganPetani(response.untungPetani);
      setKeuntunganBumdes(response.untungBUMDES);
      setHargaAcuan(response.hargaAcuan);
      setHargaLelang(response.hargaLelang);
      setProduksiTahunIni(response.shsTahunIni);
      setProduksiTahunLalu(response.shsTahunSebel);
      setTotalPenjualanGula(response.bagiHasil);

      // setFormDataE2(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchEkonomi();
  }, [sesiId]);

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
                      value={rantaiPasok}
                      onChange={handleInputChange}
                      className="border p-2 bg-ijoIsiTabel border-none"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
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
          {/* <h2 className="text-red-600 font-bold mt-5">
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
                {Object.keys(formDataE2).map((key) => (
                  <tr key={key} className="bg-ijoIsiTabel">
                    <td className="px-4 py-2">{getLabel(key)}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name={key}
                        value={formDataE2[key]}
                        onChange={handleInputChange}
                        className="p-2 bg-ijoIsiTabel"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
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
          </div> */}

          {/* E2 */}
          <h2 className="text-red-600 font-bold mt-5">
            Potensi Kehilangan Produksi (E2)
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
                  <td className="px-4 py-2">Kehilangan Pol Ampas</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={polAmpas}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Kehilangan Pol Blotong</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={polBlotong}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Kehilangan Pol Tetes</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={polTetes}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Kehilangan Rendemen Kebun</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={rendemenKebun}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="px-4 py-2">Kehilangan Rendemen Gerbang</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={rendemenGerbang}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="px-4 py-2">Kehilangan Rendemen NPP</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={rendemenNPP}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="px-4 py-2">Kehilangan Rendemen Gula</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={rendemenGula}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
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
                      value={keuntunganPetani}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
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
                      value={keuntunganBumdes}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
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
                      value={hargaAcuan}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
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
                      value={hargaLelang}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
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
                      value={produksiTahunIni}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      // className={`p-2 rounded ${
                      //   finalizedData[key] ? "bg-green-500" : "bg-gray-300"
                      // }`}
                    >
                      ✔️
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">SHS yang Dihasilkan Tahun Lalu</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={produksiTahunLalu}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
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

          {/* E6 */}
          <h2 className="text-red-600 font-bold mt-5">
            Return on Investment (E6)
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
                  <td className="px-4 py-2">Total Penjualan Gula PG</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={penjualanGula}
                      onChange={handleInputChange}
                      className="p-2 bg-ijoIsiTabel"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
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
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800"
            >
              Hitung
            </button>
          </div>
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
