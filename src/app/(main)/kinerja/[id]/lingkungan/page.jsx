"use client";

import KinerjaTable from "@/components/table/KinerjaTable";
import { getCookie } from "@/tools/getCookie";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchData } from "@/tools/api";
import KinerjaTableBulan from "@/components/table/KinerjaTableBulan";

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
    totalResiduJuni: 0,
    bodJuni: 0,
    codJuni: 0,
    sulfidaJuni: 0,
    totalResiduJuli: 0,
    bodJuli: 0,
    codJuli: 0,
    sulfidaJuli: 0,
    totalResiduAgustus: 0,
    bodAgustus: 0,
    codAgustus: 0,
    sulfidaAgustus: 0,
    totalResiduSeptember: 0,
    bodSeptember: 0,
    codSeptember: 0,
    sulfidaSeptember: 0,

    sulfurDesaA1: 0,
    sulfurDesaA2: 0,
    sulfurDesaB1: 0,
    sulfurDesaB2: 0,
    karbonDesaA1: 0,
    karbonDesaA2: 0,
    karbonDesaB1: 0,
    karbonDesaB2: 0,
    nitrogenDesaA1: 0,
    nitrogenDesaA2: 0,
    nitrogenDesaB1: 0,
    nitrogenDesaB2: 0,
    oksidaDesaA1: 0,
    oksidaDesaA2: 0,
    oksidaDesaB1: 0,
    oksidaDesaB2: 0,

    amoniaKerja1: 0,
    amoniaKerja2: 0,
    debuKerja1: 0,
    debuKerja2: 0,
    nitrogenKerja1: 0,
    nitrogenKerja2: 0,
    sulfurKerja1: 0,
    sulfurKerja2: 0,
  });

  const [loading, setLoading] = useState(true);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = async (field, value) => {
    try {
      const data = { sesiId };
      const numericValue = parseFloat(value.replace(",", ".")); // Ganti koma menjadi titik jika pengguna memasukkan koma
      if (!isNaN(numericValue)) {
        data[field] = numericValue;
      } else {
        return; // Abaikan jika nilainya tidak valid
      }
      // data[field] = parseFloat(value);
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
          totalResiduJuni: response.totalResiduJuni,
          bodJuni: response.bodJuni,
          codJuni: response.codJuni,
          sulfidaJuni: response.sulfidaJuni,
          totalResiduJuli: response.totalResiduJuli,
          bodJuli: response.bodJuli,
          codJuli: response.codJuli,
          sulfidaJuli: response.sulfidaJuli,
          totalResiduAgustus: response.totalResiduAgustus,
          bodAgustus: response.bodAgustus,
          codAgustus: response.codAgustus,
          sulfidaAgustus: response.sulfidaAgustus,
          totalResiduSeptember: response.totalResiduSeptember,
          bodSeptember: response.bodSeptember,
          codSeptember: response.codSeptember,
          sulfidaSeptember: response.sulfidaSeptember,

          sulfurDesaA1: response.sulfurDesaA1,
          sulfurDesaA2: response.sulfurDesaA2,
          sulfurDesaB1: response.sulfurDesaB1,
          sulfurDesaB2: response.sulfurdesaB2,
          karbonDesaA1: response.karbonDesaA1,
          karbonDesaA2: response.karbonDesaA2,
          karbonDesaB1: response.karbonDesaB1,
          karbonDesaB2: response.karbonDesaB2,
          nitrogenDesaA1: response.nitrogenDesaA1,
          nitrogenDesaA2: response.nitrogenDesaA2,
          nitrogenDesaB1: response.nitrogenDesaB1,
          nitrogenDesaB2: response.nitrogenDesaB2,
          oksidaDesaA1: response.oksidaDesaA1,
          oksidaDesaA2: response.oksidaDesaA2,
          oksidaDesaB1: response.oksidaDesaB1,
          oksidaDesaB2: response.oksidaDesaB2,

          amoniaKerja1: response.amoniaKerja1,
          amoniaKerja2: response.amoniaKerja2,
          debuKerja1: response.debuKerja1,
          debuKerja2: response.debuKerja2,
          nitrogenKerja1: response.nitrogenKerja1,
          nitrogenKerja2: response.nitrogenKerja2,
          sulfurKerja1: response.sulfurKerja1,
          sulfurKerja2: response.sulfurKerja2,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data (lingkungan):", error);
      }
    };

    fetchLingkungan();
  }, [sesiId]);

  const dataL1 = [
    { isSubtitle: true, label: "Amonia (NH3) (ppm)" },
    { isSubtitle: true, label: "Desa Kerticala" },

    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.amoniaDesaA1,
      onChange: (e) => handleInputChange("amoniaDesaA1", e.target.value),
      onSubmit: () => handleUpdate("amoniaDesaA1", formData.amoniaDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.amoniaDesaA2,
      onChange: (e) => handleInputChange("amoniaDesaA2", e.target.value),
      onSubmit: () => handleUpdate("amoniaDesaA2", formData.amoniaDesaA2),
    },
    { isSubtitle: true, label: "Desa Sumber Kulon" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.amoniaDesaB1,
      onChange: (e) => handleInputChange("amoniaDesaB1", e.target.value),
      onSubmit: () => handleUpdate("amoniaDesaB1", formData.amoniaDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.amoniaDesaB2,
      onChange: (e) => handleInputChange("amoniaDesaB2", e.target.value),
      onSubmit: () => handleUpdate("amoniaDesaB2", formData.amoniaDesaB2),
    },
    { isSubtitle: true, label: "Hidrogen Sulfida (H2S) (ppm)" },
    { isSubtitle: true, label: "Desa Kerticala" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.sulfidaDesaA1,
      onChange: (e) => handleInputChange("sulfidaDesaA1", e.target.value),
      onSubmit: () => handleUpdate("sulfidaDesaA1", formData.sulfidaDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.sulfidaDesaA2,
      onChange: (e) => handleInputChange("sulfidaDesaA2", e.target.value),
      onSubmit: () => handleUpdate("sulfidaDesaA2", formData.sulfidaDesaA2),
    },
    { isSubtitle: true, label: "Desa Sumber Kulon" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.sulfidaDesaB1,
      onChange: (e) => handleInputChange("sulfidaDesaB1", e.target.value),
      onSubmit: () => handleUpdate("sulfidaDesaB1", formData.sulfidaDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.sulfidaDesaB2,
      onChange: (e) => handleInputChange("sulfidaDesaB2", e.target.value),
      onSubmit: () => handleUpdate("sulfidaDesaB2", formData.sulfidaDesaB2),
    },
  ];

  const dataL2 = [
    { isSubtitle: true, label: "Desa Kerticala" },

    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.debuDesaA1,
      onChange: (e) => handleInputChange("debuDesaA1", e.target.value),
      onSubmit: () => handleUpdate("debuDesaA1", formData.debuDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.debuDesaA2,
      onChange: (e) => handleInputChange("debuDesaA2", e.target.value),
      onSubmit: () => handleUpdate("debuDesaA2", formData.debuDesaA2),
    },
    { isSubtitle: true, label: "Desa Sumber Kulon" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.debuDesaB1,
      onChange: (e) => handleInputChange("debuDesaB1", e.target.value),
      onSubmit: () => handleUpdate("debuDesaB1", formData.debuDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.debuDesaB2,
      onChange: (e) => handleInputChange("debuDesaB2", e.target.value),
      onSubmit: () => handleUpdate("debuDesaB2", formData.debuDesaB2),
    },
  ];

  const dataL3 = [
    {
      label: "Konsumsi Listrik (Kwh/Ton Tebu)",
      inputType: "number",
      value: formData.konsumsiListrik,
      onChange: (e) => handleInputChange("konsumsiListrik", e.target.value),
      onSubmit: () => handleUpdate("konsumsiListrik", formData.konsumsiListrik),
    },
    {
      label: "Jumlah Tebu (Ton)",
      inputType: "number",
      value: formData.jumlahTonTebu,
      onChange: (e) => handleInputChange("jumlahTonTebu", e.target.value),
      onSubmit: () => handleUpdate("jumlahTonTebu", formData.jumlahTonTebu),
    },
    {
      label: "SHS (%Tebu)",
      inputType: "number",
      value: formData.shs,
      onChange: (e) => handleInputChange("shs", e.target.value),
      onSubmit: () => handleUpdate("shs", formData.shs),
    },
  ];

  const dataL4 = [
    { isSubtitle: true, label: "Kebisingan Ruang Produksi" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.bisingProduksi1,
      onChange: (e) => handleInputChange("bisingProduksi1", e.target.value),
      onSubmit: () => handleUpdate("bisingProduksi1", formData.bisingProduksi1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.bisingProduksi2,
      onChange: (e) => handleInputChange("bisingProduksi2", e.target.value),
      onSubmit: () => handleUpdate("bisingProduksi2", formData.bisingProduksi2),
    },
    { isSubtitle: true, label: "Kebisingan Lokal" },
    { isSubtitle: true, label: "Desa Kerticala" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.bisingDesaA1,
      onChange: (e) => handleInputChange("bisingDesaA1", e.target.value),
      onSubmit: () => handleUpdate("bisingDesaA1", formData.bisingDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.bisingDesaA2,
      onChange: (e) => handleInputChange("bisingDesaA2", e.target.value),
      onSubmit: () => handleUpdate("bisingDesaA2", formData.bisingDesaA2),
    },
    { isSubtitle: true, label: "Desa Sumber Kulon" },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.bisingDesaB1,
      onChange: (e) => handleInputChange("bisingDesaB1", e.target.value),
      onSubmit: () => handleUpdate("bisingDesaB1", formData.bisingDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.bisingDesaB2,
      onChange: (e) => handleInputChange("bisingDesaB2", e.target.value),
      onSubmit: () => handleUpdate("bisingDesaB2", formData.bisingDesaB2),
    },
  ];

  const dataL5 = [
    {
      isSubtitle: true,
      label: "Juni",
    },
    {
      label: "Total Residu Terlarut (mg/L)",
      inputType: "number",
      value: formData.totalResiduJuni,
      onChange: (e) => handleInputChange("totalResiduJuni", e.target.value),
      onSubmit: () => handleUpdate("totalResiduJuni", formData.totalResiduJuni),
    },
    {
      label: "BOD5 (mg/L)",
      inputType: "number",
      value: formData.bodJuni,
      onChange: (e) => handleInputChange("bodJuni", e.target.value),
      onSubmit: () => handleUpdate("bodJuni", formData.bodJuni),
    },
    {
      label: "COD (mg/L)",
      inputType: "number",
      value: formData.codJuni,
      onChange: (e) => handleInputChange("codJuni", e.target.value),
      onSubmit: () => handleUpdate("codJuni", formData.codJuni),
    },
    {
      label: "Sulfida (mg/L)",
      inputType: "number",
      value: formData.sulfidaJuni,
      onChange: (e) => handleInputChange("sulfidaJuni", e.target.value),
      onSubmit: () => handleUpdate("sulfidaJuni", formData.sulfidaJuni),
    },
    {
      isSubtitle: true,
      label: "Juli",
    },
    {
      label: "Total Residu Terlarut (mg/L)",
      inputType: "number",
      value: formData.totalResiduJuli,
      onChange: (e) => handleInputChange("totalResiduJuli", e.target.value),
      onSubmit: () => handleUpdate("totalResiduJuli", formData.totalResiduJuli),
    },
    {
      label: "BOD5 (mg/L)",
      inputType: "number",
      value: formData.bodJuli,
      onChange: (e) => handleInputChange("bodJuli", e.target.value),
      onSubmit: () => handleUpdate("bodJuli", formData.bodJuli),
    },
    {
      label: "COD (mg/L)",
      inputType: "number",
      value: formData.codJuli,
      onChange: (e) => handleInputChange("codJuli", e.target.value),
      onSubmit: () => handleUpdate("codJuli", formData.codJuli),
    },
    {
      label: "Sulfida (mg/L)",
      inputType: "number",
      value: formData.sulfidaJuli,
      onChange: (e) => handleInputChange("sulfidaJuli", e.target.value),
      onSubmit: () => handleUpdate("sulfidaJuli", formData.sulfidaJuli),
    },
    {
      isSubtitle: true,
      label: "Agustus",
    },
    {
      label: "Total Residu Terlarut (mg/L)",
      inputType: "number",
      value: formData.totalResiduAgustus,
      onChange: (e) => handleInputChange("totalResiduAgustus", e.target.value),
      onSubmit: () =>
        handleUpdate("totalResiduAgustus", formData.totalResiduAgustus),
    },
    {
      label: "BOD5 (mg/L)",
      inputType: "number",
      value: formData.bodAgustus,
      onChange: (e) => handleInputChange("bodAgustus", e.target.value),
      onSubmit: () => handleUpdate("bodAgustus", formData.bodAgustus),
    },
    {
      label: "COD (mg/L)",
      inputType: "number",
      value: formData.codAgustus,
      onChange: (e) => handleInputChange("codAgustus", e.target.value),
      onSubmit: () => handleUpdate("codAgustus", formData.codAgustus),
    },
    {
      label: "Sulfida (mg/L)",
      inputType: "number",
      value: formData.sulfidaAgustus,
      onChange: (e) => handleInputChange("sulfidaAgustus", e.target.value),
      onSubmit: () => handleUpdate("sulfidaAgustus", formData.sulfidaAgustus),
    },
    {
      isSubtitle: true,
      label: "September",
    },
    {
      label: "Total Residu Terlarut (mg/L)",
      inputType: "number",
      value: formData.totalResiduSeptember,
      onChange: (e) =>
        handleInputChange("totalResiduSeptember", e.target.value),
      onSubmit: () =>
        handleUpdate("totalResiduSeptember", formData.totalResiduSeptember),
    },
    {
      label: "BOD5 (mg/L)",
      inputType: "number",
      value: formData.bodSeptember,
      onChange: (e) => handleInputChange("bodSeptember", e.target.value),
      onSubmit: () => handleUpdate("bodSeptember", formData.bodSeptember),
    },
    {
      label: "COD (mg/L)",
      inputType: "number",
      value: formData.codSeptember,
      onChange: (e) => handleInputChange("codSeptember", e.target.value),
      onSubmit: () => handleUpdate("codSeptember", formData.codSeptember),
    },
    {
      label: "Sulfida (mg/L)",
      inputType: "number",
      value: formData.sulfidaSeptember,
      onChange: (e) => handleInputChange("sulfidaSeptember", e.target.value),
      onSubmit: () =>
        handleUpdate("sulfidaSeptember", formData.sulfidaSeptember),
    },
  ];

  const dataL6 = [
    {
      isSubtitle: true,
      label: "Sulfur dioksida (µg/Nm3)",
    },
    {
      isSubtitle: true,
      label: "Desa Kerticala",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.sulfurDesaA1,
      onChange: (e) => handleInputChange("sulfurDesaA1", e.target.value),
      onSubmit: () => handleUpdate("sulfurDesaA1", formData.sulfurDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.sulfurDesaA2,
      onChange: (e) => handleInputChange("sulfurDesaA2", e.target.value),
      onSubmit: () => handleUpdate("sulfurDesaA2", formData.sulfurDesaA2),
    },

    {
      isSubtitle: true,
      label: "Desa Sumber Kulon",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.sulfurDesaB1,
      onChange: (e) => handleInputChange("sulfurDesaB1", e.target.value),
      onSubmit: () => handleUpdate("sulfurDesaB1", formData.sulfurDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.sulfurDesaB2,
      onChange: (e) => handleInputChange("sulfurDesaB2", e.target.value),
      onSubmit: () => handleUpdate("sulfurDesaB2", formData.sulfurDesaB2),
    },
    {
      isSubtitle: true,
      label: "Karbon monoksida (µg/Nm3)",
    },
    {
      isSubtitle: true,
      label: "Desa Kerticala",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.karbonDesaA1,
      onChange: (e) => handleInputChange("karbonDesaA1", e.target.value),
      onSubmit: () => handleUpdate("karbonDesaA1", formData.karbonDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.karbonDesaA2,
      onChange: (e) => handleInputChange("karbonDesaA2", e.target.value),
      onSubmit: () => handleUpdate("karbonDesaA2", formData.karbonDesaA2),
    },
    {
      isSubtitle: true,
      label: "Desa Sumber Kulon",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.karbonDesaB1,
      onChange: (e) => handleInputChange("karbonDesaB1", e.target.value),
      onSubmit: () => handleUpdate("karbonDesaB1", formData.karbonDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.karbonDesaB2,
      onChange: (e) => handleInputChange("karbonDesaB2", e.target.value),
      onSubmit: () => handleUpdate("karbonDesaB2", formData.karbonDesaB2),
    },

    {
      isSubtitle: true,
      label: "Nitrogen dioksida (µg/Nm3)",
    },
    {
      isSubtitle: true,
      label: "Desa Kerticala",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.nitrogenDesaA1,
      onChange: (e) => handleInputChange("nitrogenDesaA1", e.target.value),
      onSubmit: () => handleUpdate("nitrogenDesaA1", formData.nitrogenDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.nitrogenDesaA2,
      onChange: (e) => handleInputChange("nitrogenDesaA2", e.target.value),
      onSubmit: () => handleUpdate("nitrogenDesaA2", formData.nitrogenDesaA2),
    },
    {
      isSubtitle: true,
      label: "Desa Sumber Kulon",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.nitrogenDesaB1,
      onChange: (e) => handleInputChange("nitrogenDesaB1", e.target.value),
      onSubmit: () => handleUpdate("nitrogenDesaB1", formData.nitrogenDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.nitrogenDesaB2,
      onChange: (e) => handleInputChange("nitrogenDesaB2", e.target.value),
      onSubmit: () => handleUpdate("nitrogenDesaB2", formData.nitrogenDesaB2),
    },
    {
      isSubtitle: true,
      label: "Oksida (µg/Nm3)",
    },
    {
      isSubtitle: true,
      label: "Desa Kerticala",
    },

    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.oksidaDesaA1,
      onChange: (e) => handleInputChange("oksidaDesaA1", e.target.value),
      onSubmit: () => handleUpdate("oksidaDesaA1", formData.oksidaDesaA1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.oksidaDesaA2,
      onChange: (e) => handleInputChange("oksidaDesaA2", e.target.value),
      onSubmit: () => handleUpdate("oksidaDesaA2", formData.oksidaDesaA2),
    },
    {
      isSubtitle: true,
      label: "Desa Sumber Kulon",
    },

    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.oksidaDesaB1,
      onChange: (e) => handleInputChange("oksidaDesaB1", e.target.value),
      onSubmit: () => handleUpdate("oksidaDesaB1", formData.oksidaDesaB1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.oksidaDesaB2,
      onChange: (e) => handleInputChange("oksidaDesaB2", e.target.value),
      onSubmit: () => handleUpdate("oksidaDesaB2", formData.oksidaDesaB2),
    },
  ];

  const dataL7 = [
    {
      isSubtitle: true,
      label: "NH3",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.amoniaKerja1,
      onChange: (e) => handleInputChange("amoniaKerja1", e.target.value),
      onSubmit: () => handleUpdate("amoniaKerja1", formData.amoniaKerja1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.amoniaKerja2,
      onChange: (e) => handleInputChange("amoniaKerja2", e.target.value),
      onSubmit: () => handleUpdate("amoniaKerja2", formData.amoniaKerja2),
    },
    {
      isSubtitle: true,
      label: "Debu (TSP)",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.debuKerja1,
      onChange: (e) => handleInputChange("debuKerja1", e.target.value),
      onSubmit: () => handleUpdate("debuKerja1", formData.debuKerja1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.debuKerja2,
      onChange: (e) => handleInputChange("debuKerja2", e.target.value),
      onSubmit: () => handleUpdate("debuKerja2", formData.debuKerja2),
    },
    {
      isSubtitle: true,
      label: "NO2",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.nitrogenKerja1,
      onChange: (e) => handleInputChange("nitrogenKerja1", e.target.value),
      onSubmit: () => handleUpdate("nitrogenKerja1", formData.nitrogenKerja1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.nitrogenKerja2,
      onChange: (e) => handleInputChange("nitrogenKerja2", e.target.value),
      onSubmit: () => handleUpdate("nitrogenKerja2", formData.nitrogenKerja2),
    },
    {
      isSubtitle: true,
      label: "SO2",
    },
    {
      label: "Pengukuran 1",
      inputType: "number",
      value: formData.sulfurKerja1,
      onChange: (e) => handleInputChange("sulfurKerja1", e.target.value),
      onSubmit: () => handleUpdate("sulfurKerja1", formData.sulfurKerja1),
    },
    {
      label: "Pengukuran 2",
      inputType: "number",
      value: formData.sulfurKerja2,
      onChange: (e) => handleInputChange("sulfurKerja2", e.target.value),
      onSubmit: () => handleUpdate("sulfurKerja2", formData.sulfurKerja2),
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

      {/* <KinerjaTable title="Kualitas Air Permukaan (L5)" rows={dataL5} /> */}
      <KinerjaTableBulan
        title="Kualitas Air Permukaan (L5)"
        data={dataL5}
        // saveOption="individual"
      />
      <KinerjaTable title="Kualitas Udara Ambien (L6)" rows={dataL6} />
      <KinerjaTable title="Kualitas Udara Ruang Kerja (L7)" rows={dataL7} />

      {/* <div className="text-center mt-6">
        <button
          type="button"
          onClick={handleCalculate}
          className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800"
        >
          Simpan dan Hitung Dimensi Lingkungan
        </button>
      </div> */}
    </div>
  );
}
