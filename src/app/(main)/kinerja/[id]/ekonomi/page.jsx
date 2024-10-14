"use client";

import { useState, useEffect } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import FieldInput from "@/components/FieldInput";
import { usePathname } from "next/navigation";
import { AiFillCheckCircle } from "react-icons/ai";

export default function DataKinerja() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [formData, setFormData] = useState({
    nilaiRisiko: 0,
    polAmpas: 0,
    polBlotong: 0,
    polTetes: 0,
    rendemenKebun: 0,
    rendemenGerbang: 0,
    rendemenNPP: 0,
    rendemenGula: 0,
    kesenjanganRantai: 0,
    hargaAcuan: 0,
    hargaLelang: 0,
    shsTahunIni: 0,
    shsTahunSebel: 0,
    returnOE: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data masukkan ekonomi
  const fetchEkonomi = async () => {
    try {
      const response = await fetchData(`/api/masukkan/ekonomi/${sesiId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      console.log("ini respon: ", response);
      setFormData({
        nilaiRisiko: response.nilaiRisiko,
        polAmpas: response.polAmpas,
        polBlotong: response.polBlotong,
        polTetes: response.polTetes,
        rendemenKebun: response.rendemenKebun,
        rendemenGerbang: response.rendemenGerbang,
        rendemenNPP: response.rendemenNPP,
        rendemenGula: response.rendemenGula,
        kesenjanganRantai: response.kesenjanganRantai,
        hargaAcuan: response.hargaAcuan,
        hargaLelang: response.hargaLelang,
        shsTahunIni: response.shsTahunIni,
        shsTahunSebel: response.shsTahunSebel,
        returnOE: response.returnOE,
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
      console.log("ini data: ", data);

      await fetchData(`/api/masukkan/ekonomi`, {
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

  useEffect(() => {
    fetchEkonomi();
  }, [sesiId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      <h2 className="text-red-600 font-bold mt-5">
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
            {/* Tingkat Risiko Rantai Pasok */}
            <tr>
              <td className="px-4 py-2">Tingkat Risiko Rantai Pasok</td>
              <td className="px-4 py-2">
                <select
                  value={formData.nilaiRisiko}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nilaiRisiko: parseFloat(e.target.value),
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
                    handleUpdate("nilaiRisiko", formData.nilaiRisiko)
                  }
                  className="p-2 rounded-full text-2xl hover:text-gray-600"
                >
                  <AiFillCheckCircle></AiFillCheckCircle>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
            {/* Kehilangan Pol Ampas */}
            <FieldInput
              label="Kehilangan Pol Ampas"
              value={formData.polAmpas}
              onChange={(e) =>
                setFormData({ ...formData, polAmpas: e.target.value })
              }
              onSubmit={() => handleUpdate("polAmpas", formData.polAmpas)}
            />

            {/* Kehilangan Pol Blotong */}
            <FieldInput
              label="Kehilangan Pol Blotong"
              value={formData.polBlotong}
              onChange={(e) =>
                setFormData({ ...formData, polBlotong: e.target.value })
              }
              onSubmit={() => handleUpdate("polBlotong", formData.polBlotong)}
            />

            {/* Kehilangan Pol Tetes */}
            <FieldInput
              label="Kehilangan Pol Tetes"
              value={formData.polTetes}
              onChange={(e) =>
                setFormData({ ...formData, polTetes: e.target.value })
              }
              onSubmit={() => handleUpdate("polTetes", formData.polTetes)}
            />

            {/* Kehilangan Rendemen Kebun */}
            <FieldInput
              label="Kehilangan Rendemen Kebun"
              value={formData.rendemenKebun}
              onChange={(e) =>
                setFormData({ ...formData, rendemenKebun: e.target.value })
              }
              onSubmit={() =>
                handleUpdate("rendemenKebun", formData.rendemenKebun)
              }
            />

            {/* Kehilangan Rendemen Gerbang */}
            <FieldInput
              label="Kehilangan Rendemen Gerbang"
              value={formData.rendemenGerbang}
              onChange={(e) =>
                setFormData({ ...formData, rendemenGerbang: e.target.value })
              }
              onSubmit={() =>
                handleUpdate("rendemenGerbang", formData.rendemenGerbang)
              }
            />

            {/* Kehilangan Rendemen NPP */}
            <FieldInput
              label="Kehilangan Rendemen NPP"
              value={formData.rendemenNPP}
              onChange={(e) =>
                setFormData({ ...formData, rendemenNPP: e.target.value })
              }
              onSubmit={() => handleUpdate("rendemenNPP", formData.rendemenNPP)}
            />

            {/* Kehilangan Rendemen Gula */}
            <FieldInput
              label="Kehilangan Rendemen Gula"
              value={formData.rendemenGula}
              onChange={(e) =>
                setFormData({ ...formData, rendemenGula: e.target.value })
              }
              onSubmit={() =>
                handleUpdate("rendemenGula", formData.rendemenGula)
              }
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-red-600 font-bold mt-5">
        Kesenjangan keuntungan pelaku rantai pasok per ton gula (%) (E3)
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
            {/* Keuntungan Petani */}
            <FieldInput
              label="Kesenjangan Rantai Pasok"
              value={formData.kesenjanganRantai}
              onChange={(e) =>
                setFormData({ ...formData, kesenjanganRantai: e.target.value })
              }
              onSubmit={() =>
                handleUpdate("kesenjanganRantai", formData.kesenjanganRantai)
              }
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-red-600 font-bold mt-5">Harga Patokan Petani (E4)</h2>
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
            {/* SHS yang Dihasilkan Tahun Ini */}
            <FieldInput
              label="Harga Acuan/Referensi"
              value={formData.hargaAcuan}
              onChange={(e) =>
                setFormData({ ...formData, hargaAcuan: e.target.value })
              }
              onSubmit={() => handleUpdate("hargaAcuan", formData.hargaAcuan)}
            />

            {/* SHS yang Dihasilkan Tahun Lalu */}
            <FieldInput
              label="Harga Lelang (rata-rata)"
              value={formData.hargaLelang}
              onChange={(e) =>
                setFormData({ ...formData, hargaLelang: e.target.value })
              }
              onSubmit={() => handleUpdate("hargaLelang", formData.hargaLelang)}
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-red-600 font-bold mt-5">Tingkat Ketangkasan (E5)</h2>
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
            {/* SHS yang Dihasilkan Tahun Ini */}
            <FieldInput
              label="Produksi Tahun Ini"
              value={formData.shsTahunIni}
              onChange={(e) =>
                setFormData({ ...formData, shsTahunIni: e.target.value })
              }
              onSubmit={() => handleUpdate("shsTahunIni", formData.shsTahunIni)}
            />

            {/* SHS yang Dihasilkan Tahun Lalu */}
            <FieldInput
              label="Produksi tahun lalu"
              value={formData.shsTahunSebel}
              onChange={(e) =>
                setFormData({ ...formData, shsTahunSebel: e.target.value })
              }
              onSubmit={() =>
                handleUpdate("shsTahunSebel", formData.shsTahunSebel)
              }
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-red-600 font-bold mt-5">Return on Investment (E6)</h2>
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
            {/* Total Penjualan Gula */}
            <FieldInput
              label="Total Penjualan Gula"
              value={formData.returnOE}
              onChange={(e) =>
                setFormData({ ...formData, returnOE: e.target.value })
              }
              onSubmit={() => handleUpdate("returnOE", formData.returnOE)}
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
          Hitung
        </button>
      </div>
    </div>
  );
}
