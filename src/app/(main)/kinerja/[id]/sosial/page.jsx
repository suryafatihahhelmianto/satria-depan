"use client";

import { useState, useEffect } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import FieldInput from "@/components/FieldInput";
import { usePathname } from "next/navigation";
import { AiFillCheckCircle } from "react-icons/ai";

export default function DataSosial() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [formData, setFormData] = useState({
    rantaiPasok: 0,
    sediaAktivita: 0,
    tingkatManfaat: 0,
    tingkatLimbah: 0,
    tetapMajaIndra: 0,
    tetapTotal: 0,
    tidakMajaIndra: 0,
    tidakTetapTotal: 0,
    luasLahan: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchSosialData = async () => {
    try {
      const response = await fetchData(`/api/masukkan/sosial/${sesiId}`, {
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

  const handleUpdate = async (field, value) => {
    try {
      const data = { sesiId };
      data[field] = parseFloat(value);

      await fetchData(`/api/masukkan/sosial`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });
      console.log("Update successful");
    } catch (error) {
      console.error("Error updating field: ", error);
    }
  };

  const handleCalculate = async () => {
    try {
      const dataToSend = { sesiId, formData };

      const response = await fetchData("/api/dimensi/sosial", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data: dataToSend,
      });

      console.log("Response dari server: ", response);
    } catch (error) {
      console.error("Error calculating dimensions: ", error);
    }
  };

  useEffect(() => {
    fetchSosialData();
  }, [sesiId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      <h2 className="text-red-600 font-bold mt-5">
        Dukungan Kelembagaan terhadap Rantai Pasok Agroindustri (S1)
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
            {/* Dukungan Kelembagaan */}
            <tr>
              <td className="px-4 py-2">
                Dukungan Kelembagaan Terhadap Rantai Pasok
              </td>
              <td className="px-4 py-2">
                <select
                  value={formData.rantaiPasok}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rantaiPasok: parseFloat(e.target.value),
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
                    handleUpdate("rantaiPasok", formData.rantaiPasok)
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

      {/* Ketersediaan Infrastruktur */}
      <h2 className="text-red-600 font-bold mt-5">
        Ketersediaan Infrastruktur sebagai Penunjang Aktivitas (S2)
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
                Ketersediaan Infrastruktur Sebagai Penunjang Aktivitas
              </td>
              <td className="px-4 py-2">
                <select
                  value={formData.sediaAktivita}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sediaAktivita: parseFloat(e.target.value),
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
                    handleUpdate("sediaAktivita", formData.sediaAktivita)
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

      {/* tingkatManfaat */}
      <h2 className="text-red-600 font-bold mt-5">
        Manfaat Corporate Social Responsibility bagi Sosial (S3)
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
                Manfaat Corporate Social Responsibility Bagi Sosial
              </td>
              <td className="px-4 py-2">
                <select
                  value={formData.tingkatManfaat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tingkatManfaat: parseFloat(e.target.value),
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
                    handleUpdate("tingkatManfaat", formData.tingkatManfaat)
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

      {/* Keluhan Limbah */}
      <h2 className="text-red-600 font-bold mt-5">
        Keluhan Limbah Rantai Pasok Industri (S4)
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
                Keluhan Limbah Rantai Pasok Industri
              </td>
              <td className="px-4 py-2">
                <select
                  value={formData.tingkatLimbah}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tingkatLimbah: parseFloat(e.target.value),
                    })
                  }
                  className="bg-ijoIsiTabel p-2 border rounded-lg"
                >
                  <option value={1}>Sangat Rendah</option>
                  <option value={0.772}>Rendah</option>
                  <option value={0.491}>Sedang</option>
                  <option value={0.3}>Tinggi</option>
                  <option value={0.2}>Sangat Tinggi</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() =>
                    handleUpdate("tingkatLimbah", formData.tingkatLimbah)
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

      {/* S5 */}
      <h2 className="text-red-600 font-bold mt-5">
        Penyerapan Tenaga Kerja Lokal (S5)
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
              label="PKWT Tenaga Kerja Majalengka Indramayu (orang)"
              value={formData.tetapMajaIndra}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tetapMajaIndra: e.target.value,
                })
              }
              onSubmit={() =>
                handleUpdate("tetapMajaIndra", formData.tetapMajaIndra)
              }
            />

            <FieldInput
              label="PKWT Total (orang)"
              value={formData.tetapTotal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tetapTotal: e.target.value,
                })
              }
              onSubmit={() => handleUpdate("tetapTotal", formData.tetapTotal)}
            />
            <FieldInput
              label="PKWTT Tenaga Kerja Majalengka Indramayu (orang)"
              value={formData.tidakMajaIndra}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tidakMajaIndra: e.target.value,
                })
              }
              onSubmit={() =>
                handleUpdate("tidakMajaIndra", formData.tidakMajaIndra)
              }
            />

            <FieldInput
              label="PKWTT Total (orang)"
              value={formData.tidakTetapTotal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tidakTetapTotal: e.target.value,
                })
              }
              onSubmit={() =>
                handleUpdate("tidakTetapTotal", formData.tidakTetapTotal)
              }
            />
          </tbody>
        </table>
      </div>

      {/* S6 */}
      <h2 className="text-red-600 font-bold mt-5">
        Peningkatan Keikutsertaan Stakeholder Kemitraan (S6)
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
              label="Luas Lahan yang Avalist Tahun Ini (Ha)"
              value={formData.luasLahan}
              onChange={(e) =>
                setFormData({ ...formData, luasLahan: e.target.value })
              }
              onSubmit={() => handleUpdate("luasLahan", formData.luasLahan)}
            />
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={handleCalculate}
          className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800"
        >
          Simpan dan Hitung Dimensi Sosial
        </button>
      </div>
    </div>
  );
}
