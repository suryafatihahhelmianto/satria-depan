"use client";

import Skeleton from "@/components/common/skeleton";
import FieldInput from "@/components/FieldInput";
import OpsiDimensi from "@/components/OpsiDimensi";
import KinerjaTable from "@/components/table/KinerjaTable";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";

export default function SumberDayaPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [formData, setFormData] = useState({
    kemudahanAksesTenagaKerja: 0, // dataD1

    luasTanamTRITahunIni: 0, // dataD2
    luasTotalTahunIni: 0,

    jumlahJamKerjaEfektif: 0,
    totalJamKerja: 0,
    jamTerlaksana: 0,
    jamTotal: 0,

    produktivitasTebu: 0, // dataD4
    rendemenTebu: 0, // dataD4
    mbs: 0, // dataD4

    overallRecovery: 0, // dataD5

    kis: 0, // dataD6
    kes: 0, // dataD6

    ratoonTebu: 0, // dataD7

    luasBL: 0, // dataD8
    luasPST41: 0, // dataD8
    PS864: 0, // dataD8
    luasTotal: 0, // dataD8

    tingkatMekanisasi: 0, // dataD9

    teknologiPengolahanRawSugar: 0, // dataD10
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
      const numericValue = parseFloat(value.replace(",", ".")); // Ganti koma menjadi titik jika pengguna memasukkan koma
      if (!isNaN(numericValue)) {
        data[field] = numericValue;
      } else {
        return; // Abaikan jika nilainya tidak valid
      }
      // data[field] = parseFloat(value);

      await fetchData(`/api/masukkan/sdam`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });
      fetchSDAMData();
      console.log("Update successful (sdam)");
    } catch (error) {
      console.error("Error updating field (sdam): ", error);
    }
  };

  const handleCalculate = async () => {
    try {
      const dataToSend = {
        formData,
      };

      const response = await fetchData("/api/dimensi/sdam", {
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

  const fetchSDAMData = async () => {
    try {
      const response = await fetchData(`/api/masukkan/sdam/${sesiId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      const lockedResponse = await fetchData(
        `/api/masukkan/sdam/locked-status/${sesiId}`,
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

      setFormData({
        kemudahanAksesTenagaKerja: response.kemudahanAksesTenagaKerja,

        luasTanamTRITahunIni: response.luasTanamTRITahunIni,
        luasTotalTahunIni: response.luasTotalTahunIni,

        jumlahJamKerjaEfektif: response.jumlahJamKerjaEfektif,
        totalJamKerja: response.totalJamKerja,
        jamTerlaksana: response.jamTerlaksana,
        jamTotal: response.jamTotal,

        produktivitasTebu: response.produktivitasTebu, // dataD4
        rendemenTebu: response.rendemenTebu, // dataD4
        mbs: response.mbs, // dataD4

        overallRecovery: response.overallRecovery, // dataD5

        kis: response.kis, // dataD6
        kes: response.kes, // dataD6

        ratoonTebu: response.ratoonTebu, // dataD7

        luasBL: response.luasBL, // dataD8
        luasPST41: response.luasPST41, // dataD8
        PS864: response.PS864, // dataD8
        luasTotal: response.luasTotal, // dataD8

        tingkatMekanisasi: response.tingkatMekanisasi, // dataD9

        teknologiPengolahanRawSugar: response.teknologiPengolahanRawSugar, // dataD10
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSDAMData();
  }, [sesiId]);

  const dataD1 = [
    {
      label: "Kemudahan Akses Tenaga Kerja",
      inputType: "dropdown",
      value: formData.kemudahanAksesTenagaKerja,
      options: [
        { label: "Sangat Rendah", value: 0.2 },
        { label: "Rendah", value: 0.3 },
        { label: "Sedang", value: 0.491 },
        { label: "Tinggi", value: 0.772 },
        { label: "Sangat Tinggi", value: 1 },
      ],
      onChange: (e) =>
        handleInputChange("kemudahanAksesTenagaKerja", e.target.value),
      onSubmit: () =>
        handleUpdate(
          "kemudahanAksesTenagaKerja",
          formData.kemudahanAksesTenagaKerja
        ),
      locked: lockedStatus["kemudahanAksesTenagaKerja"],
    },
  ];

  const dataD2 = [
    {
      label: "Tingkat Luas Tanam TRI (%)",
      inputType: "number",
      value: formData.luasTanamTRITahunIni,
      onChange: (e) =>
        handleInputChange("luasTanamTRITahunIni", e.target.value),
      onSubmit: () =>
        handleUpdate("luasTanamTRITahunIni", formData.luasTanamTRITahunIni),
      locked: lockedStatus["luasTanamTRITahunIni"],
    },
    {
      label: "Total Luas Lahan yang Ditanami Tahun Ini",
      inputType: "number",
      value: formData.luasTotalTahunIni,
      onChange: (e) => handleInputChange("luasTotalTahunIni", e.target.value),
      onSubmit: () =>
        handleUpdate("luasTotalTahunIni", formData.luasTotalTahunIni),
      locked: lockedStatus["luasTotalTahunIni"],
    },
  ];

  const dataD3 = [
    {
      isSubtitle: true,
      label: "Produktivitas Tenaga Kerja",
    },
    {
      label: "Jumlah Jam Kerja Efektif Pegawai (Jam/Minggu)",
      inputType: "number",
      value: formData.jumlahJamKerjaEfektif,
      onChange: (e) =>
        handleInputChange("jumlahJamKerjaEfektif", e.target.value),
      onSubmit: () =>
        handleUpdate("jumlahJamKerjaEfektif", formData.jumlahJamKerjaEfektif),
      locked: lockedStatus["jumlahJamKerjaEfektif"],
    },
    {
      label: "Total Jam Kerja Pegawai (Jam/Minggu)",
      inputType: "number",
      value: formData.totalJamKerja,
      onChange: (e) => handleInputChange("totalJamKerja", e.target.value),
      onSubmit: () => handleUpdate("totalJamKerja", formData.totalJamKerja),
      locked: lockedStatus["totalJamKerja"],
    },
    {
      isSubtitle: true,
      label: "Presentase Jam Pelatihan Terlaksana",
    },
    {
      label: "Jam Terlaksana (Jam/Tahun)",
      inputType: "number",
      value: formData.jamTerlaksana,
      onChange: (e) => handleInputChange("jamTerlaksana", e.target.value),
      onSubmit: () => handleUpdate("jamTerlaksana", formData.jamTerlaksana),
      locked: lockedStatus["jamTerlaksana"],
    },
    {
      label: "Jam Total (Jam/Tahun)",
      inputType: "number",
      value: formData.jamTotal,
      onChange: (e) => handleInputChange("jamTotal", e.target.value),
      onSubmit: () => handleUpdate("jamTotal", formData.jamTotal),
      locked: lockedStatus["jamTotal"],
    },
  ];

  const dataD4 = [
    {
      label: "Produktivitas Tebu (Ton/Ha)",
      inputType: "number",
      value: formData.produktivitasTebu,
      onChange: (e) => handleInputChange("produktivitasTebu", e.target.value),
      onSubmit: () =>
        handleUpdate("produktivitasTebu", formData.produktivitasTebu),
      locked: lockedStatus["produktivitasTebu"],
    },
    {
      label: "Rendemen Tebu (%)",
      inputType: "number",
      value: formData.rendemenTebu,
      onChange: (e) => handleInputChange("rendemenTebu", e.target.value),
      onSubmit: () => handleUpdate("rendemenTebu", formData.rendemenTebu),
      locked: lockedStatus["rendemenTebu"],
    },
    {
      label: "mbs",
      inputType: "dropdown",
      value: formData.mbs,
      options: [
        { label: "Sangat Rendah", value: 0.2 },
        { label: "Rendah", value: 0.3 },
        { label: "Sedang", value: 0.491 },
        { label: "Tinggi", value: 0.772 },
        { label: "Sangat Tinggi", value: 1 },
      ],
      onChange: (e) => handleInputChange("mbs", e.target.value),
      onSubmit: () => handleUpdate("mbs", formData.mbs),
      locked: lockedStatus["mbs"],
    },
  ];

  const dataD5 = [
    {
      label: "Overall Recovery (%)",
      inputType: "number",
      value: formData.overallRecovery,
      onChange: (e) => handleInputChange("overallRecovery", e.target.value),
      onSubmit: () => handleUpdate("overallRecovery", formData.overallRecovery),
      locked: lockedStatus["overallRecovery"],
    },
  ];

  const dataD6 = [
    {
      label: "KIS (TCD)",
      inputType: "number",
      value: formData.kis,
      onChange: (e) => handleInputChange("kis", e.target.value),
      onSubmit: () => handleUpdate("kis", formData.kis),
      locked: lockedStatus["kis"],
    },
    {
      label: "KES (TCD)",
      inputType: "number",
      value: formData.kes,
      onChange: (e) => handleInputChange("kes", e.target.value),
      onSubmit: () => handleUpdate("kes", formData.kes),
      locked: lockedStatus["kes"],
    },
  ];

  const dataD7 = [
    {
      label: "Tingkat Ratoon Tebu",
      inputType: "number",
      value: formData.ratoonTebu,
      onChange: (e) => handleInputChange("ratoonTebu", e.target.value),
      onSubmit: () => handleUpdate("ratoonTebu", formData.ratoonTebu),
      locked: lockedStatus["ratoonTebu"],
    },
  ];

  const dataD8 = [
    {
      label: "Luas BL",
      inputType: "number",
      value: formData.luasBL,
      onChange: (e) => handleInputChange("luasBL", e.target.value),
      onSubmit: () => handleUpdate("luasBL", formData.luasBL),
      locked: lockedStatus["luasBL"],
    },
    {
      label: "Luas PST41",
      inputType: "number",
      value: formData.luasPST41,
      onChange: (e) => handleInputChange("luasPST41", e.target.value),
      onSubmit: () => handleUpdate("luasPST41", formData.luasPST41),
      locked: lockedStatus["luasPST41"],
    },
    {
      label: "Luas PS864",
      inputType: "number",
      value: formData.PS864,
      onChange: (e) => handleInputChange("PS864", e.target.value),
      onSubmit: () => handleUpdate("PS864", formData.PS864),
      locked: lockedStatus["PS864"],
    },
    {
      label: "Total Luas Lahan yang ditanam Tahun Ini",
      inputType: "number",
      value: formData.luasTotal,
      onChange: (e) => handleInputChange("luasTotal", e.target.value),
      onSubmit: () => handleUpdate("luasTotal", formData.luasTotal),
      locked: lockedStatus["luasTotal"],
    },
  ];

  const dataD9 = [
    {
      label: "Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan",
      inputType: "dropdown",
      value: formData.tingkatMekanisasi,
      options: [
        { label: "Sangat Rendah", value: 0.2 },
        { label: "Rendah", value: 0.3 },
        { label: "Sedang", value: 0.491 },
        { label: "Tinggi", value: 0.772 },
        { label: "Sangat Tinggi", value: 1 },
      ],
      onChange: (e) => handleInputChange("tingkatMekanisasi", e.target.value),
      onSubmit: () =>
        handleUpdate("tingkatMekanisasi", formData.tingkatMekanisasi),
      locked: lockedStatus["tingkatMekanisasi"],
    },
  ];

  const dataD10 = [
    {
      label: "Teknologi Pengolahan Raw Sugar",
      inputType: "dropdown",
      value: formData.teknologiPengolahanRawSugar,
      options: [
        { label: "Karbonatasi", value: 0.2 },
        { label: "Sulfitasi", value: 0.491 },
        { label: "Pospatasi", value: 1 },
      ],
      onChange: (e) =>
        handleInputChange("teknologiPengolahanRawSugar", e.target.value),
      onSubmit: () =>
        handleUpdate(
          "teknologiPengolahanRawSugar",
          formData.teknologiPengolahanRawSugar
        ),
      locked: lockedStatus["teknologiPengolahanRawSugar"],
    },
  ];

  if (loading) {
    return (
      <div className="py-16">
        <Skeleton rows={10} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      <KinerjaTable
        title="Kemudahan Akses Sumber Daya Tenaga Kerja (D1)"
        rows={dataD1}
      />

      <KinerjaTable title="Tingkat Luas Tanam TRI (D2)" rows={dataD2} />

      <KinerjaTable title="Kompetensi Tenaga Kerja (D3)" rows={dataD3} />

      <KinerjaTable title="Kualitas Bahan Baku (D4)" rows={dataD4} />

      <KinerjaTable title="Overall Recovery (D5)" rows={dataD5} />

      <KinerjaTable title="Kecukupan Bahan Baku (D6)" rows={dataD6} />

      <KinerjaTable title="Tingkat Ratoon Tebu (D7)" rows={dataD7} />

      <KinerjaTable
        title="Varietas Tebu yang Responsif terhadap Kondisi Lahan yang Marginal (D8)"
        rows={dataD8}
      />

      <KinerjaTable
        title="Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan (D9)"
        rows={dataD9}
      />

      <KinerjaTable
        title="Teknologi Pengolahan Raw Sugar (D10)"
        rows={dataD10}
      />
    </div>
  );
}
