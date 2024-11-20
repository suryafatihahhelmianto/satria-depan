"use client";

import { useState, useEffect } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import KinerjaTable from "@/components/table/KinerjaTable"; // Import the KinerjaTable component
import { usePathname } from "next/navigation";
import Skeleton from "@/components/common/skeleton";

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

  const [lockedStatus, setLockedStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = async (field, value) => {
    try {
      if (lockedStatus[field]) {
        console.log(`Kolom ${field} sudah terkunci, tidak bisa diupdate.`);
        return;
      }

      const data = { sesiId };
      data[field] = parseFloat(value);
      await fetchData(`/api/masukkan/ekonomi`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });
      console.log("Update successful");
      fetchEkonomi();
    } catch (error) {
      console.error("Error updating field: ", error);
    }
  };

  const handleCalculate = async () => {
    try {
      const dataToSend = { sesiId, formData };
      const response = await fetchData("/api/dimensi/ekonomi", {
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

  const fetchEkonomi = async () => {
    try {
      const response = await fetchData(`/api/masukkan/ekonomi/${sesiId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      const lockedResponse = await fetchData(
        `/api/masukkan/ekonomi/locked-status/${sesiId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      const lockedStatusMap = {};
      lockedResponse.forEach((log) => {
        lockedStatusMap[log.columnName] = log.status === "LOCKED";
      });
      setLockedStatus(lockedStatusMap);

      setFormData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchEkonomi();
  }, [sesiId]);

  if (loading) {
    return (
      <div className="py-16">
        <Skeleton rows={10} />
      </div>
    );
  }

  // Define rows for KinerjaTable
  const rowsE1 = [
    {
      label: "Tingkat Risiko Rantai Pasok",
      inputType: "dropdown",
      value: formData.nilaiRisiko,
      options: [
        { value: 1, label: "Sangat Rendah" },
        { value: 0.772, label: "Rendah" },
        { value: 0.491, label: "Sedang" },
        { value: 0.3, label: "Tinggi" },
        { value: 0.2, label: "Sangat Tinggi" },
      ],
      onChange: (e) => handleInputChange("nilaiRisiko", e.target.value),
      onSubmit: () => handleUpdate("nilaiRisiko", formData.nilaiRisiko),
      locked: lockedStatus["nilaiRisiko"],
    },
  ];

  const rowsE2 = [
    {
      label: "Kehilangan Pol Ampas",
      inputType: "number",
      value: formData.polAmpas,
      onChange: (e) => setFormData({ ...formData, polAmpas: e.target.value }),
      onSubmit: () => handleUpdate("polAmpas", formData.polAmpas),
      locked: lockedStatus["polAmpas"],
    },
    {
      label: "Kehilangan Pol Blotong",
      inputType: "number",
      value: formData.polBlotong,
      onChange: (e) => setFormData({ ...formData, polBlotong: e.target.value }),
      onSubmit: () => handleUpdate("polBlotong", formData.polBlotong),
      locked: lockedStatus["polBlotong"],
    },
    {
      label: "Kehilangan Pol Tetes",
      inputType: "number",
      value: formData.polTetes,
      onChange: (e) => setFormData({ ...formData, polTetes: e.target.value }),
      onSubmit: () => handleUpdate("polTetes", formData.polTetes),
      locked: lockedStatus["polTetes"],
    },
    {
      label: "Kehilangan Rendemen Kebun",
      inputType: "number",
      value: formData.rendemenKebun,
      onChange: (e) =>
        setFormData({ ...formData, rendemenKebun: e.target.value }),
      onSubmit: () => handleUpdate("rendemenKebun", formData.rendemenKebun),
      locked: lockedStatus["rendemenKebun"],
    },
    {
      label: "Kehilangan Rendemen Gerbang",
      inputType: "number",
      value: formData.rendemenGerbang,
      onChange: (e) =>
        setFormData({ ...formData, rendemenGerbang: e.target.value }),
      onSubmit: () => handleUpdate("rendemenGerbang", formData.rendemenGerbang),
      locked: lockedStatus["rendemenGerbang"],
    },
    {
      label: "Kehilangan Rendemen NPP",
      inputType: "number",
      value: formData.rendemenNPP,
      onChange: (e) =>
        setFormData({ ...formData, rendemenNPP: e.target.value }),
      onSubmit: () => handleUpdate("rendemenNPP", formData.rendemenNPP),
      locked: lockedStatus["rendemenNPP"],
    },
    {
      label: "Kehilangan Rendemen Gula",
      inputType: "number",
      value: formData.rendemenGula,
      onChange: (e) =>
        setFormData({ ...formData, rendemenGula: e.target.value }),
      onSubmit: () => handleUpdate("rendemenGula", formData.rendemenGula),
      locked: lockedStatus["rendemenGula"],
    },
  ];

  const rowsE3 = [
    {
      label: "Kesenjangan Keuntungan Stakeholder Rantai Pasok",
      inputType: "number",
      value: formData.kesenjanganRantai,
      onChange: (e) =>
        setFormData({ ...formData, kesenjanganRantai: e.target.value }),
      onSubmit: () =>
        handleUpdate("kesenjanganRantai", formData.kesenjanganRantai),
      locked: lockedStatus["kesenjanganRantai"],
    },
  ];

  const rowsE4 = [
    {
      label: "Harga Acuan/Referensi",
      inputType: "number",
      value: formData.hargaAcuan,
      onChange: (e) => setFormData({ ...formData, hargaAcuan: e.target.value }),
      onSubmit: () => handleUpdate("hargaAcuan", formData.hargaAcuan),
      locked: lockedStatus["hargaAcuan"],
    },
    {
      label: "Harga Lelang (rata-rata)",
      inputType: "number",
      value: formData.hargaLelang,
      onChange: (e) =>
        setFormData({ ...formData, hargaLelang: e.target.value }),
      onSubmit: () => handleUpdate("hargaLelang", formData.hargaLelang),
      locked: lockedStatus["hargaLelang"],
    },
  ];

  const rowsE5 = [
    {
      label: "Produksi Tahun Ini",
      inputType: "number",
      value: formData.shsTahunIni,
      onChange: (e) =>
        setFormData({ ...formData, shsTahunIni: e.target.value }),
      onSubmit: () => handleUpdate("shsTahunIni", formData.shsTahunIni),
      locked: lockedStatus["shsTahunIni"],
    },
    {
      label: "Produksi tahun lalu",
      inputType: "number",
      value: formData.shsTahunSebel,
      onChange: (e) =>
        setFormData({ ...formData, shsTahunSebel: e.target.value }),
      onSubmit: () => handleUpdate("shsTahunSebel", formData.shsTahunSebel),
      locked: lockedStatus["shsTahunSebel"],
    },
  ];

  const rowsE6 = [
    {
      label: "Total Penjualan Gula",
      inputType: "number",
      value: formData.returnOE,
      onChange: (e) => setFormData({ ...formData, returnOE: e.target.value }),
      onSubmit: () => handleUpdate("returnOE", formData.returnOE),
      locked: lockedStatus["returnOE"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      <KinerjaTable title="Tingkat Risiko Rantai Pasok (E1)" rows={rowsE1} />
      <KinerjaTable title="Potensi Kehilangan Produksi (E2)" rows={rowsE2} />
      <KinerjaTable
        title="Kesenjangan keuntungan pelaku rantai pasok per ton gula (%) (E3)"
        rows={rowsE3}
      />
      <KinerjaTable title="Harga Patokan Petani (E4)" rows={rowsE4} />
      <KinerjaTable title="Tingkat Ketangkasan (E5)" rows={rowsE5} />
      <KinerjaTable title="Return on Investment (E6)" rows={rowsE6} />

      {/* <div className="text-center mt-6">
        <button
          type="button"
          onClick={handleCalculate}
          className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800"
        >
          Hitung
        </button>
      </div> */}
    </div>
  );
}
