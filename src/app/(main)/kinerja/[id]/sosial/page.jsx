"use client";

import { useState, useEffect } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import KinerjaTable from "@/components/table/KinerjaTable"; // Import the KinerjaTable component
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
    luasLahanYangDitanami: 0,
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

  // Define the rows for each table
  const rowsS1 = [
    {
      label: "Dukungan Kelembagaan Terhadap Rantai Pasok",
      inputType: "dropdown",
      value: formData.rantaiPasok,
      options: [
        { value: 0.2, label: "Sangat Rendah" },
        { value: 0.3, label: "Rendah" },
        { value: 0.491, label: "Sedang" },
        { value: 0.772, label: "Tinggi" },
        { value: 1, label: "Sangat Tinggi" },
      ],
      onChange: (e) =>
        setFormData({ ...formData, rantaiPasok: parseFloat(e.target.value) }),
      onSubmit: () => handleUpdate("rantaiPasok", formData.rantaiPasok),
    },
  ];

  const rowsS2 = [
    {
      label: "Ketersediaan Infrastruktur Sebagai Penunjang Aktivitas",
      inputType: "dropdown",
      value: formData.sediaAktivita,
      options: [
        { value: 0.2, label: "Sangat Rendah" },
        { value: 0.3, label: "Rendah" },
        { value: 0.491, label: "Sedang" },
        { value: 0.772, label: "Tinggi" },
        { value: 1, label: "Sangat Tinggi" },
      ],
      onChange: (e) =>
        setFormData({ ...formData, sediaAktivita: parseFloat(e.target.value) }),
      onSubmit: () => handleUpdate("sediaAktivita", formData.sediaAktivita),
    },
  ];

  const rowsS3 = [
    {
      label: "Manfaat Corporate Social Responsibility Bagi Sosial",
      inputType: "dropdown",
      value: formData.tingkatManfaat,
      options: [
        { value: 0.2, label: "Sangat Rendah" },
        { value: 0.3, label: "Rendah" },
        { value: 0.491, label: "Sedang" },
        { value: 0.772, label: "Tinggi" },
        { value: 1, label: "Sangat Tinggi" },
      ],
      onChange: (e) =>
        setFormData({
          ...formData,
          tingkatManfaat: parseFloat(e.target.value),
        }),
      onSubmit: () => handleUpdate("tingkatManfaat", formData.tingkatManfaat),
    },
  ];

  const rowsS4 = [
    {
      label: "Keluhan Limbah Rantai Pasok Industri",
      inputType: "dropdown",
      value: formData.tingkatLimbah,
      options: [
        { value: 1, label: "Sangat Rendah" },
        { value: 0.772, label: "Rendah" },
        { value: 0.491, label: "Sedang" },
        { value: 0.3, label: "Tinggi" },
        { value: 0.2, label: "Sangat Tinggi" },
      ],
      onChange: (e) =>
        setFormData({ ...formData, tingkatLimbah: parseFloat(e.target.value) }),
      onSubmit: () => handleUpdate("tingkatLimbah", formData.tingkatLimbah),
    },
  ];

  const rowsS5 = [
    {
      label: "PKWT Tenaga Kerja Majalengka Indramayu (orang)",
      inputType: "number",
      value: formData.tetapMajaIndra,
      onChange: (e) =>
        setFormData({ ...formData, tetapMajaIndra: e.target.value }),
      onSubmit: () => handleUpdate("tetapMajaIndra", formData.tetapMajaIndra),
    },
    {
      label: "PKWT Total (orang)",
      inputType: "number",
      value: formData.tetapTotal,
      onChange: (e) => setFormData({ ...formData, tetapTotal: e.target.value }),
      onSubmit: () => handleUpdate("tetapTotal", formData.tetapTotal),
    },
    {
      label: "PKWTT Tenaga Kerja Majalengka Indramayu (orang)",
      inputType: "number",
      value: formData.tidakMajaIndra,
      onChange: (e) =>
        setFormData({ ...formData, tidakMajaIndra: e.target.value }),
      onSubmit: () => handleUpdate("tidakMajaIndra", formData.tidakMajaIndra),
    },
    {
      label: "PKWTT Total (orang)",
      inputType: "number",
      value: formData.tidakTetapTotal,
      onChange: (e) =>
        setFormData({ ...formData, tidakTetapTotal: e.target.value }),
      onSubmit: () => handleUpdate("tidakTetapTotal", formData.tidakTetapTotal),
    },
  ];

  const rowsS6 = [
    {
      label: "Luas Lahan yang Avalist Tahun Ini (Ha)",
      inputType: "number",
      value: formData.luasLahan,
      onChange: (e) => setFormData({ ...formData, luasLahan: e.target.value }),
      onSubmit: () => handleUpdate("luasLahan", formData.luasLahan),
    },
    {
      label: "Total Luas Lahan yang Ditanami Tahun Ini (Ha)",
      inputType: "number",
      value: formData.luasLahanYangDitanami,
      onChange: (e) =>
        setFormData({
          ...formData,
          luasLahanYangDitanami: e.target.value,
        }),
      onSubmit: () =>
        handleUpdate("luasLahanYangDitanami", formData.luasLahanYangDitanami),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      <KinerjaTable
        title="Dukungan Kelembagaan terhadap Rantai Pasok Agroindustri (S1)"
        rows={rowsS1}
      />
      <KinerjaTable
        title="Ketersediaan Infrastruktur sebagai Penunjang Aktivitas (S2)"
        rows={rowsS2}
      />
      <KinerjaTable
        title="Manfaat Corporate Social Responsibility bagi Sosial (S3)"
        rows={rowsS3}
      />
      <KinerjaTable
        title="Keluhan Limbah Rantai Pasok Industri (S4)"
        rows={rowsS4}
      />
      <KinerjaTable title="Penyerapan Tenaga Kerja Lokal (S5)" rows={rowsS5} />
      <KinerjaTable
        title="Peningkatan Keikutsertaan Stakeholder Kemitraan (S6)"
        rows={rowsS6}
      />

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
