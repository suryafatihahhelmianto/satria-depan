"use client";

import { useState, useEffect } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import KinerjaTable from "@/components/table/KinerjaTable"; // Import the KinerjaTable component
import { usePathname } from "next/navigation";

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

  // Fetch economic data
  const fetchEkonomi = async () => {
    try {
      const response = await fetchData(`/api/masukkan/ekonomi/${sesiId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      setFormData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdate = async (field, value) => {
    try {
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
    } catch (error) {
      console.error("Error updating field: ", error);
    }
  };

  const handleCalculate = async () => {
    try {
      const dataToSend = {
        sesiId,
        formData,
      };
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

  useEffect(() => {
    fetchEkonomi();
  }, [sesiId]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
      onChange: (e) =>
        setFormData({ ...formData, nilaiRisiko: parseFloat(e.target.value) }),
      onSubmit: () => handleUpdate("nilaiRisiko", formData.nilaiRisiko),
    },
  ];

  const rowsE2 = [
    {
      label: "Kehilangan Pol Ampas",
      inputType: "text",
      value: formData.polAmpas,
      onChange: (e) => setFormData({ ...formData, polAmpas: e.target.value }),
      onSubmit: () => handleUpdate("polAmpas", formData.polAmpas),
    },
    {
      label: "Kehilangan Pol Blotong",
      inputType: "text",
      value: formData.polBlotong,
      onChange: (e) => setFormData({ ...formData, polBlotong: e.target.value }),
      onSubmit: () => handleUpdate("polBlotong", formData.polBlotong),
    },
    {
      label: "Kehilangan Pol Tetes",
      inputType: "text",
      value: formData.polTetes,
      onChange: (e) => setFormData({ ...formData, polTetes: e.target.value }),
      onSubmit: () => handleUpdate("polTetes", formData.polTetes),
    },
    {
      label: "Kehilangan Rendemen Kebun",
      inputType: "text",
      value: formData.rendemenKebun,
      onChange: (e) =>
        setFormData({ ...formData, rendemenKebun: e.target.value }),
      onSubmit: () => handleUpdate("rendemenKebun", formData.rendemenKebun),
    },
    {
      label: "Kehilangan Rendemen Gerbang",
      inputType: "text",
      value: formData.rendemenGerbang,
      onChange: (e) =>
        setFormData({ ...formData, rendemenGerbang: e.target.value }),
      onSubmit: () => handleUpdate("rendemenGerbang", formData.rendemenGerbang),
    },
    {
      label: "Kehilangan Rendemen NPP",
      inputType: "text",
      value: formData.rendemenNPP,
      onChange: (e) =>
        setFormData({ ...formData, rendemenNPP: e.target.value }),
      onSubmit: () => handleUpdate("rendemenNPP", formData.rendemenNPP),
    },
    {
      label: "Kehilangan Rendemen Gula",
      inputType: "text",
      value: formData.rendemenGula,
      onChange: (e) =>
        setFormData({ ...formData, rendemenGula: e.target.value }),
      onSubmit: () => handleUpdate("rendemenGula", formData.rendemenGula),
    },
  ];

  const rowsE3 = [
    {
      label: "Kesenjangan Keuntungan Stakeholder Rantai Pasok",
      inputType: "text",
      value: formData.kesenjanganRantai,
      onChange: (e) =>
        setFormData({ ...formData, kesenjanganRantai: e.target.value }),
      onSubmit: () =>
        handleUpdate("kesenjanganRantai", formData.kesenjanganRantai),
    },
  ];

  const rowsE4 = [
    {
      label: "Harga Acuan/Referensi",
      inputType: "text",
      value: formData.hargaAcuan,
      onChange: (e) => setFormData({ ...formData, hargaAcuan: e.target.value }),
      onSubmit: () => handleUpdate("hargaAcuan", formData.hargaAcuan),
    },
    {
      label: "Harga Lelang (rata-rata)",
      inputType: "text",
      value: formData.hargaLelang,
      onChange: (e) =>
        setFormData({ ...formData, hargaLelang: e.target.value }),
      onSubmit: () => handleUpdate("hargaLelang", formData.hargaLelang),
    },
  ];

  const rowsE5 = [
    {
      label: "Produksi Tahun Ini",
      inputType: "text",
      value: formData.shsTahunIni,
      onChange: (e) =>
        setFormData({ ...formData, shsTahunIni: e.target.value }),
      onSubmit: () => handleUpdate("shsTahunIni", formData.shsTahunIni),
    },
    {
      label: "Produksi tahun lalu",
      inputType: "text",
      value: formData.shsTahunSebel,
      onChange: (e) =>
        setFormData({ ...formData, shsTahunSebel: e.target.value }),
      onSubmit: () => handleUpdate("shsTahunSebel", formData.shsTahunSebel),
    },
  ];

  const rowsE6 = [
    {
      label: "Total Penjualan Gula",
      inputType: "text",
      value: formData.returnOE,
      onChange: (e) => setFormData({ ...formData, returnOE: e.target.value }),
      onSubmit: () => handleUpdate("returnOE", formData.returnOE),
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
