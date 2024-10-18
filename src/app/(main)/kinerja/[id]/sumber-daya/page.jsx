"use client";

import FieldInput from "@/components/FieldInput";
import OpsiDimensi from "@/components/OpsiDimensi";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";

export default function SumberDayaPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [formData, setFormData] = useState({
    // D1: Kemudahan Akses Sumber Daya Tenaga Kerja
    kemudahanAkses: 0,

    // D2: Tingkat Luas Tanam TRI
    luasTanamTahunIni: 0,
    totalLuasLahan: 0,

    // D3: Kompetensi Tenaga Kerja
    jamKerjaEfektif: 0,
    totalJamKerja: 0,
    jamTerlaksana: 0,
    jamTotal: 0,

    // D4: Kualitas Bahan Baku
    produktivitasTebu: 0,
    rendemenTebu: 0,
    mbs: 0, // Manis Bersih Segar (ordinal)

    // D5: Overall Recovery
    overallRecovery: 0,

    // D6: Total Biaya Tenaga Kerja
    kis: 0, // Kapasitas giling include
    kes: 0, // Kapasitas giling exclude

    // D7: Tingkat Ratoon Tebu
    ratoonTebu: 0,

    // D8: Varietas Tebu yang Responsive Terhadap Kondisi Lahan
    luasBL: 0, // Luas BL
    luasPST41: 0, // Luas PST 41
    luasJT49: 0, // Luas JT49
    totalLuasLahan: 0, // Total luas lahan yang ditanami tahun ini

    // D9: Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan
    tingkatMekanisasi: 0,

    // D10: Teknologi Pengolahan Raw Sugar
    teknologiPengolahanRawSugar: 0,
  });

  const fetchSDAMData = async () => {
    try {
      const response = await fetchData(`/api/masukkan/sdam/${sesiId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      setFormData({
        rantaiPasok: response.rantaiPasok,
        sediaAktivita: response.sediaAktivita,
        tingkatManfaat: response.tingkatManfaat,
        tingkatLimbah: response.tingkatLimbah,
        penyerapanTenagaKerja: response.penyerapanTenagaKerja,
        tetapMajaIndra: response.tetapMajaIndra,
        tetapTotal: response.tetapTotal,
        tidakMajaIndra: response.tidakMajaIndra,
        tidakTetapTotal: response.tidakTetapTotal,
        partisipasiStakeholder: response.partisipasiStakeholder,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCalculate = async () => {
    try {
      const dataToSend = {
        formData,
      };

      const response = await fetchData("/api/dimensi/ekonomi", {
        method: "POST", // menggunakan POST untuk membuat data baru
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data: formData,
      });

      console.log("Response dari server: ", response);
    } catch (error) {
      console.error("Error calculating dimensions: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      {/* D1 */}
      <h2 className="text-red-600 font-bold mt-5">
        Kemudahan Akses Sumber Daya Tenaga Kerja (D1)
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
            <tr>
              <td className="px-4 py-2">
                Kemudahan akses sumber daya tenaga kerja (ordinal)
              </td>
              <td className="px-4 py-2">
                <select
                  value={formData.kemudahanAkses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kemudahanAkses: parseFloat(e.target.value),
                    })
                  }
                  className="bg-ijoIsiTabel p-2 border rounded-lg"
                >
                  <option value={0.2}>Sangat Rendah</option>
                  <option value={0.3}>Rendah</option>
                  <option value={0.491}>Sedang</option>
                  <option value={0.772}>Tinggi</option>
                  <option value={1}>Sangat Tinggi</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() =>
                    handleUpdate("kemudahanAkses", formData.kemudahanAkses)
                  }
                  className="p-2 rounded-full text-2xl hover:text-gray-600"
                >
                  <AiFillCheckCircle />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* D2 */}
      <h2 className="text-red-600 font-bold mt-5">
        Tingkat Luas Tanam TRI (D2)
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
            <FieldInput
              label="Luas tanam TRI tahun ini (Ha)"
              value={formData.luasTanamTahunIni}
              onChange={(e) =>
                setFormData({ ...formData, luasTanamTahunIni: e.target.value })
              }
            />
            <FieldInput
              label="Total luas lahan yang ditanami tahun ini (Ha)"
              value={formData.totalLuasLahan}
              onChange={(e) =>
                setFormData({ ...formData, totalLuasLahan: e.target.value })
              }
            />
          </tbody>
        </table>
      </div>

      {/* D3 */}
      <h2 className="text-red-600 font-bold mt-5">
        Kompetensi Tenaga Kerja (D3)
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
            <FieldInput
              label="Jumlah jam kerja efektif pegawai (hour)"
              value={formData.jamKerjaEfektif}
              onChange={(e) =>
                setFormData({ ...formData, jamKerjaEfektif: e.target.value })
              }
            />
            <FieldInput
              label="Total jam kerja pegawai (hour)"
              value={formData.totalJamKerja}
              onChange={(e) =>
                setFormData({ ...formData, totalJamKerja: e.target.value })
              }
            />

            <FieldInput
              label="Jam terlaksana"
              value={formData.jamTerlaksana}
              onChange={(e) =>
                setFormData({ ...formData, jamTerlaksana: e.target.value })
              }
            />
            <FieldInput
              label="Jam total"
              value={formData.jamTotal}
              onChange={(e) =>
                setFormData({ ...formData, jamTotal: e.target.value })
              }
            />
          </tbody>
        </table>
      </div>

      {/* D4 */}
      <h2 className="text-red-600 font-bold mt-5">Kualitas Bahan Baku (D4)</h2>
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
            <FieldInput
              label="Produktivitas tebu (Ton/Ha)"
              value={formData.produktivitasTebu}
              onChange={(e) =>
                setFormData({ ...formData, produktivitasTebu: e.target.value })
              }
            />
            <FieldInput
              label="Rendemen tebu (%)"
              value={formData.rendemenTebu}
              onChange={(e) =>
                setFormData({ ...formData, rendemenTebu: e.target.value })
              }
            />
            <tr>
              <td className="px-4 py-2">Manis Bersih Segar (MBS) (range)</td>
              <td className="px-4 py-2">
                <select
                  value={formData.mbs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mbs: parseFloat(e.target.value),
                    })
                  }
                  className="bg-ijoIsiTabel p-2 border rounded-lg"
                >
                  <option value={0.2}>Sangat Rendah</option>
                  <option value={0.3}>Rendah</option>
                  <option value={0.491}>Sedang</option>
                  <option value={0.772}>Tinggi</option>
                  <option value={1}>Sangat Tinggi</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleUpdate("mbs", formData.mbs)}
                  className="p-2 rounded-full text-2xl hover:text-gray-600"
                >
                  <AiFillCheckCircle />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* D5 */}
      <h2 className="text-red-600 font-bold mt-5">Overall Recovery (D5)</h2>
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
            <FieldInput
              label="Overall Recovery (%)"
              value={formData.overallRecovery}
              onChange={(e) =>
                setFormData({ ...formData, overallRecovery: e.target.value })
              }
            />
          </tbody>
        </table>
      </div>

      {/* D6 */}
      <h2 className="text-red-600 font-bold mt-5">
        Total Biaya Tenaga Kerja (D6)
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
            <FieldInput
              label="KIS (Kapasitas giling include)"
              value={formData.kis}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kis: e.target.value,
                })
              }
            />
            <FieldInput
              label="KES (Kapasitas giling exclude)"
              value={formData.kes}
              onChange={(e) =>
                setFormData({ ...formData, kes: e.target.value })
              }
            />
          </tbody>
        </table>
      </div>

      {/* D7 */}
      <h2 className="text-red-600 font-bold mt-5">Tingkat Ratoon Tebu (D7)</h2>
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
            <FieldInput
              label="Tingkat Ratoon Tebu"
              value={formData.ratoonTebu}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ratoonTebu: e.target.value,
                })
              }
            />
          </tbody>
        </table>
      </div>

      {/* D8 */}
      <h2 className="text-red-600 font-bold mt-5">
        Varietas Tebu yang Responsive Terhadap Kondisi Lahan (D8)
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
            <FieldInput
              label="Luas BL"
              value={formData.luasBL}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  luasBL: e.target.value,
                })
              }
            />
            <FieldInput
              label="Luas PST 41"
              value={formData.luasPST41}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  luasPST41: e.target.value,
                })
              }
            />
            <FieldInput
              label="Luas JT49"
              value={formData.luasJT49}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  luasJT49: e.target.value,
                })
              }
            />
            <FieldInput
              label="Total Luas Lahan yang Ditanami Tahun Ini"
              value={formData.totalLuasLahan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalLuasLahan: e.target.value,
                })
              }
            />
          </tbody>
        </table>
      </div>

      {/* D9 */}
      <h2 className="text-red-600 font-bold mt-5">
        Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan (D9)
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
            <tr>
              <td className="px-4 py-2">
                Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan
              </td>
              <td className="px-4 py-2">
                <select
                  value={formData.tingkatMekanisasi}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tingkatMekanisasi: parseFloat(e.target.value),
                    })
                  }
                  className="bg-ijoIsiTabel p-2 border rounded-lg"
                >
                  <option value={0.2}>Sangat Rendah</option>
                  <option value={0.3}>Rendah</option>
                  <option value={0.491}>Sedang</option>
                  <option value={0.772}>Tinggi</option>
                  <option value={1}>Sangat Tinggi</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() =>
                    handleUpdate(
                      "tingkatMekanisasi",
                      formData.tingkatMekanisasi
                    )
                  }
                  className="p-2 rounded-full text-2xl hover:text-gray-600"
                >
                  <AiFillCheckCircle />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* D10 */}
      <h2 className="text-red-600 font-bold mt-5">
        Teknologi Pengolahan Raw Sugar (D10)
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
            <tr>
              <td className="px-4 py-2">Teknologi Pengolahan Raw Sugar</td>
              <td className="px-4 py-2">
                <select
                  value={formData.teknologiPengolahanRawSugar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teknologiPengolahanRawSugar: parseFloat(e.target.value),
                    })
                  }
                  className="bg-ijoIsiTabel p-2 border rounded-lg"
                >
                  <option value={0.2}>Sangat Rendah</option>
                  <option value={0.3}>Rendah</option>
                  <option value={0.491}>Sedang</option>
                  <option value={0.772}>Tinggi</option>
                  <option value={1}>Sangat Tinggi</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() =>
                    handleUpdate(
                      "teknologiPengolahanRawSugar",
                      formData.teknologiPengolahanRawSugar
                    )
                  }
                  className="p-2 rounded-full text-2xl hover:text-gray-600"
                >
                  <AiFillCheckCircle />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          onClick={handleCalculate}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Submit Data
        </button>
      </div>
    </div>
  );
}
