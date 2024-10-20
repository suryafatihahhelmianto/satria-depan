"use client";

import KinerjaTable from "@/components/table/KinerjaTable";
import { getCookie } from "@/tools/getCookie";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchData } from "@/tools/api";

// {
//   label: "Pengukuran 1",
//   inputType: "dropdown",
//   value: formData.nilaiRisiko,
//   options: [
//     { label: "Sangat Rendah", value: 1 },
//     { label: "Rendah", value: 0.772 },
//     { label: "Sedang", value: 0.491 },
//     { label: "Tinggi", value: 0.3 },
//     { label: "Sangat Tinggi", value: 0.2 },
//   ],
//   onChange: (e) =>
//     handleInputChange("nilaiRisiko", parseFloat(e.target.value)),
//   onSubmit: () => handleUpdate("nilaiRisiko", formData.nilaiRisiko),
// },

export default function LingkunganPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [formData, setFormData] = useState({
    amoniaDesaA1: 0,
    amoniaDesaA2: 0,
    amoniaDesaB1: 0,
    amoniaDesaB2: 0,
    sulfidaDesaA1: 0,
    sulfidaDesaA2: 0,
    sulfidaDesaB1: 0,
    sulfidaDesaB2: 0,
    debuDesaA1: 0,
    debuDesaA2: 0,
    debuDesaB1: 0,
    debuDesaB2: 0,
    konsumsiListrik: 0,
    jumlahTonTebu: 0,
    shs: 0,
    bisingProduksi1: 0,
    bisingProduksi2: 0,
    bisingDesaA1: 0,
    bisingDesaA2: 0,
    bisingDesaB1: 0,
    bisingDesaB2: 0,
    totalResidu: 0,
    bod: 0,
    cod: 0,
    sulfida: 0,
    sulfur: 0,
    karbon: 0,
    nitrogen: 0,
    oksida: 0,
    amoniaKerja: 0,
    debuKerja: 0,
    nitrogenKerja: 0,
    sulfurKerja: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchLingkungan = async () => {
    try {
      const response = await fetchData(`/api/masukkan/lingkungan/${sesiId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      console.log("Response dari server (lingkungan): ", response);
      setFormData({
        amoniaDesaA1: response.amoniaDesaA1,
        amoniaDesaA2: response.amoniaDesaA2,
        amoniaDesaB1: response.amoniaDesaB1,
        amoniaDesaB2: response.amoniaDesaB2,
        sulfidaDesaA1: response.sulfidaDesaA1,
        sulfidaDesaA2: response.sulfidaDesaA2,
        sulfidaDesaB1: response.sulfidaDesaB1,
        sulfidaDesaB2: response.sulfidaDesaB2,
        debuDesaA1: response.debuDesaA1,
        debuDesaA2: response.debuDesaA2,
        debuDesaB1: response.debuDesaB1,
        debuDesaB2: response.debuDesaB2,
        konsumsiListrik: response.konsumsiListrik,
        jumlahTonTebu: response.jumlahTonTebu,
        shs: response.shs,
        bisingProduksi1: response.bisingProduksi1,
        bisingProduksi2: response.bisingProduksi2,
        bisingDesaA1: response.bisingDesaA1,
        bisingDesaA2: response.bisingDesaA2,
        bisingDesaB1: response.bisingDesaB1,
        bisingDesaB2: response.bisingDesaB2,
        totalResidu: response.totalResidu,
        bod: response.bod,
        cod: response.cod,
        sulfida: response.sulfida,
        sulfur: response.sulfur,
        karbon: response.karbon,
        nitrogen: response.nitrogen,
        oksida: response.oksida,
        amoniaKerja: response.amoniaKerja,
        debuKerja: response.debuKerja,
        nitrogenKerja: response.nitrogenKerja,
        sulfurKerja: response.sulfurKerja,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data (lingkungan):", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = async (field, value) => {
    try {
      const data = { sesiId };
      data[field] = parseFloat(value);
      console.log("Data yang di-update (lingkungan): ", data);

      await fetchData(`/api/masukkan/lingkungan`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });
      console.log("Update successful (lingkungan)");
    } catch (error) {
      console.error("Error updating field (lingkungan): ", error);
    }
  };

  const handleCalculate = async () => {
    try {
      const dataToSend = {
        sesiId,
        formData,
      };

      console.log("Data yang dikirim untuk kalkulasi (lingkungan): ", formData);

      const response = await fetchData("/api/dimensi/lingkungan", {
        method: "POST", // menggunakan POST untuk membuat data baru
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data: dataToSend,
      });

      console.log("Response dari server (lingkungan): ", response);
    } catch (error) {
      console.error("Error calculating dimensions (lingkungan): ", error);
    }
  };

  useEffect(() => {
    fetchLingkungan();
  }, [sesiId]);

  const dataL1 = [
    { isSubtitle: true, label: "Amonia (NH3) (ppm)" },
    { isSubtitle: true, label: "Desa Kerticala" },

    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.amoniaDesaA1,
      onChange: (e) =>
        handleInputChange("amoniaDesaA1", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("amoniaDesaA1", formData.amoniaDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.amoniaDesaA2,
      onChange: (e) =>
        handleInputChange("amoniaDesaA2", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("amoniaDesaA2", formData.amoniaDesaA2),
    },
    { isSubtitle: true, label: "Desa Sumber Kulon" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.amoniaDesaB1,
      onChange: (e) =>
        handleInputChange("amoniaDesaB1", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("amoniaDesaB1", formData.amoniaDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.amoniaDesaB2,
      onChange: (e) =>
        handleInputChange("amoniaDesaB2", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("amoniaDesaB2", formData.amoniaDesaB2),
    },
    { isSubtitle: true, label: "Hidrogen Sulfida (H2S) (ppm)" },
    { isSubtitle: true, label: "Desa Kerticala" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.sulfidaDesaA1,
      onChange: (e) =>
        handleInputChange("sulfidaDesaA1", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("sulfidaDesaA1", formData.sulfidaDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.sulfidaDesaA2,
      onChange: (e) =>
        handleInputChange("sulfidaDesaA2", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("sulfidaDesaA2", formData.sulfidaDesaA2),
    },
    { isSubtitle: true, label: "Desa Sumber Kulon" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.sulfidaDesaB1,
      onChange: (e) =>
        handleInputChange("sulfidaDesaB1", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("sulfidaDesaB1", formData.sulfidaDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.sulfidaDesaB2,
      onChange: (e) =>
        handleInputChange("sulfidaDesaB2", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("sulfidaDesaB2", formData.sulfidaDesaB2),
    },
  ];

  const dataL2 = [
    { isSubtitle: true, label: "Desa Kerticala" },

    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.debuDesaA1,
      onChange: (e) =>
        handleInputChange("debuDesaA1", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("debuDesaA1", formData.debuDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.debuDesaA2,
      onChange: (e) =>
        handleInputChange("debuDesaA2", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("debuDesaA2", formData.debuDesaA2),
    },
    { isSubtitle: true, label: "Desa Sumber Kulon" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.debuDesaB1,
      onChange: (e) =>
        handleInputChange("debuDesaB1", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("debuDesaB1", formData.debuDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.debuDesaB2,
      onChange: (e) =>
        handleInputChange("debuDesaB2", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("debuDesaB2", formData.debuDesaB2),
    },
  ];

  const dataL3 = [
    {
      label: "Konsumsi Listrik (Kwh/Ton Tebu)",
      inputType: "number",
      value: formData.konsumsiListrik,
      onChange: (e) =>
        handleInputChange("konsumsiListrik", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("konsumsiListrik", formData.konsumsiListrik),
    },
    {
      label: "Jumlah Tebu (Ton)",
      inputType: "number",
      value: formData.jumlahTonTebu,
      onChange: (e) =>
        handleInputChange("jumlahTonTebu", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("jumlahTonTebu", formData.jumlahTonTebu),
    },
    {
      label: "SHS (%Tebu)",
      inputType: "number",
      value: formData.shs,
      onChange: (e) => handleInputChange("shs", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("shs", formData.shs),
    },
  ];

  const dataL4 = [
    { isSubtitle: true, label: "Kebisingan Ruang Produksi" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.bisingProduksi1,
      onChange: (e) =>
        handleInputChange("bisingProduksi1", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("bisingProduksi1", formData.bisingProduksi1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.bisingProduksi2,
      onChange: (e) =>
        handleInputChange("bisingProduksi2", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("bisingProduksi2", formData.bisingProduksi2),
    },
    { isSubtitle: true, label: "Kebisingan Lokal" },
    { isSubtitle: true, label: "Desa Kerticala" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.bisingDesaA1,
      onChange: (e) =>
        handleInputChange("bisingDesaA1", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("bisingDesaA1", formData.bisingDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.bisingDesaA2,
      onChange: (e) =>
        handleInputChange("bisingDesaA2", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("bisingDesaA2", formData.bisingDesaA2),
    },
    { isSubtitle: true, label: "Desa Sumber Kulon" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.bisingDesaB1,
      onChange: (e) =>
        handleInputChange("bisingDesaB1", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("bisingDesaB1", formData.bisingDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.bisingDesaB2,
      onChange: (e) =>
        handleInputChange("bisingDesaB2", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("bisingDesaB2", formData.bisingDesaB2),
    },
  ];

  const dataL5 = [
    {
      label: "Total Residu Terlarut (mg/L)",
      inputType: "number",
      value: formData.totalResidu,
      onChange: (e) =>
        handleInputChange("totalResidu", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("totalResidu", formData.totalResidu),
    },
    {
      label: "BOD5 (mg/L)",
      inputType: "number",
      value: formData.bod,
      onChange: (e) => handleInputChange("bod", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("bod", formData.bod),
    },
    {
      label: "COD (mg/L)",
      inputType: "number",
      value: formData.cod,
      onChange: (e) => handleInputChange("cod", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("cod", formData.cod),
    },
    {
      label: "Sulfida (mg/L)",
      inputType: "number",
      value: formData.sulfida,
      onChange: (e) => handleInputChange("sulfida", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("sulfida", formData.sulfida),
    },
  ];

  const dataL6 = [
    {
      label: "Sulfur dioksida (µg/Nm3)",
      inputType: "number",
      value: formData.sulfur,
      onChange: (e) => handleInputChange("sulfur", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("sulfur", formData.sulfur),
    },
    {
      label: "Karbon monoksida (µg/Nm3)",
      inputType: "number",
      value: formData.karbon,
      onChange: (e) => handleInputChange("karbon", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("karbon", formData.karbon),
    },
    {
      label: "Nitrogen dioksida (µg/Nm3)",
      inputType: "number",
      value: formData.nitrogen,
      onChange: (e) =>
        handleInputChange("nitrogen", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("nitrogen", formData.nitrogen),
    },
    {
      label: "Oksida (µg/Nm3)",
      inputType: "number",
      value: formData.oksida,
      onChange: (e) => handleInputChange("oksida", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("oksida", formData.oksida),
    },
  ];

  const dataL7 = [
    {
      label: "NH3",
      inputType: "number",
      value: formData.amoniaKerja,
      onChange: (e) =>
        handleInputChange("amoniaKerja", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("amoniaKerja", formData.amoniaKerja),
    },
    {
      label: "Debu (TSP)",
      inputType: "number",
      value: formData.debuKerja,
      onChange: (e) =>
        handleInputChange("debuKerja", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("debuKerja", formData.debuKerja),
    },
    {
      label: "NO2",
      inputType: "number",
      value: formData.nitrogenKerja,
      onChange: (e) =>
        handleInputChange("nitrogenKerja", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("nitrogenKerja", formData.nitrogenKerja),
    },
    {
      label: "SO2",
      inputType: "number",
      value: formData.sulfurKerja,
      onChange: (e) =>
        handleInputChange("sulfurKerja", parseFloat(e.target.value)),
      onSubmit: () => handleUpdate("sulfurKerja", formData.sulfurKerja),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      <KinerjaTable
        title="Tingkat Gangguan Bau Agroindustri pada Masyarakat (L1)"
        rows={dataL1}
      />

      <KinerjaTable
        title="Tingkat Gangguan Debu Agroindustri pada Masyarakat (L2)"
        rows={dataL2}
      />

      <KinerjaTable title="Emisi Listrik (L3)" rows={dataL3} />

      <KinerjaTable title="Kebisingan (L4)" rows={dataL4} />

      <KinerjaTable title="Kualitas Air Permukaan (L5)" rows={dataL5} />
      <KinerjaTable title="Kualitas Udara Ambien (L6)" rows={dataL6} />
      <KinerjaTable title="Kualitas Udara Ruang Kerja (L7)" rows={dataL7} />
    </div>
  );
}
