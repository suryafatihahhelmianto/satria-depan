"use client";

import Skeleton from "@/components/common/Skeleton";
import FieldInput from "@/components/FieldInput";
import OpsiDimensi from "@/components/OpsiDimensi";
import KinerjaTable from "@/components/table/KinerjaTable";
import { useUser } from "@/context/UserContext";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";

import { AiFillCheckCircle } from "react-icons/ai";
import { FaIndustry } from "react-icons/fa";

function renderKinerjaSection({
  role,
  allowedRoles,
  title,
  rows,
  sesiId,
  isAdmin,
  type = "sdam",
}) {
  if (!allowedRoles.includes(role)) return null;
  return (
    <KinerjaTable
      title={title}
      rows={rows}
      type={type}
      sesiId={sesiId}
      isAdmin={isAdmin}
    />
  );
}

export default function SumberDayaPage() {
  const { isAdmin, role } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [formData, setFormData] = useState({
    kemudahanAksesTenagaKerja: "", // dataD1

    luasTanamTRITahunIni: "", // dataD2
    luasTotalTahunIni: "",

    jumlahJamKerjaEfektif: "",
    totalJamKerja: "",
    jamTerlaksana: "",
    jamTotal: "",

    produktivitasTebu: "", // dataD4
    rendemenTebu: "", // dataD4
    mbs: "", // dataD4

    overallRecovery: "", // dataD5

    kis: "", // dataD6
    kes: "", // dataD6

    ratoonTebu: "", // dataD7

    luasBL: "", // dataD8
    luasPST41: "", // dataD8
    luasPS864: "", // dataD8
    luasTotal: "", // dataD8

    tingkatMekanisasi: "", // dataD9

    teknologiPengolahanRawSugar: "", // dataD10
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

      // Periksa apakah value adalah string kosong atau tidak valid
      if (value === "" || value === null || value === undefined) {
        data[field] = 0; // Set default value 0 untuk field kosong
      } else {
        // Periksa apakah value adalah string sebelum menggunakan .replace()
        let numericValue = value;
        if (typeof value === "string") {
          numericValue = parseFloat(value.replace(",", ".")); // Ganti koma menjadi titik jika value berupa string
        } else {
          numericValue = parseFloat(value); // Jika value sudah angka, langsung konversi ke float
        }

        if (!isNaN(numericValue)) {
          data[field] = numericValue;
        } else {
          data[field] = 0; // Set default value 0 jika nilai tidak valid
        }
      }

      await fetchData(`/api/masukkan/sdam`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });

      // fetchSDAMData();
      // router.refresh();
      // console.log("Update successful (sdam)");
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
    } catch (error) {
      console.error("Error calculating dimensions: ", error);
    }
  };

  const fetchSDAMData = useCallback(async () => {
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
        kemudahanAksesTenagaKerja: response.kemudahanAksesTenagaKerja || "",
        luasTanamTRITahunIni: response.luasTanamTRITahunIni || "",
        luasTotalTahunIni: response.luasTotalTahunIni || "",
        jumlahJamKerjaEfektif: response.jumlahJamKerjaEfektif || "",
        totalJamKerja: response.totalJamKerja || "",
        jamTerlaksana: response.jamTerlaksana || "",
        jamTotal: response.jamTotal || "",
        produktivitasTebu: response.produktivitasTebu || "",
        rendemenTebu: response.rendemenTebu || "",
        mbs: response.mbs || "",
        overallRecovery: response.overallRecovery || "",
        kis: response.kis || "",
        kes: response.kes || "",
        ratoonTebu: response.ratoonTebu || "",
        luasBL: response.luasBL || "",
        luasPST41: response.luasPST41 || "",
        luasPS864: response.luasPS864 || "",
        luasTotal: response.luasTotal || "",
        tingkatMekanisasi: response.tingkatMekanisasi || "",
        teknologiPengolahanRawSugar: response.teknologiPengolahanRawSugar || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [sesiId]); // <-- dependency aman

  useEffect(() => {
    fetchSDAMData();
  }, [fetchSDAMData]);

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
      fieldName: "kemudahanAksesTenagaKerja",
      capt: "Tingkat kemudahan perusahaan mendapatkan tenaga kerja yang sesuai dengan kebutuhan bisnis",
    },
  ];

  const dataD2 = [
    {
      label: "Luas Tanam TRI (ha)",
      inputType: "number",
      value: formData.luasTanamTRITahunIni,
      onChange: (e) =>
        handleInputChange("luasTanamTRITahunIni", e.target.value),
      onSubmit: () =>
        handleUpdate("luasTanamTRITahunIni", formData.luasTanamTRITahunIni),
      locked: lockedStatus["luasTanamTRITahunIni"],
      fieldName: "luasTanamTRITahunIni",
      capt: "Luas lahan Tebu Rakyat Intensifikasi yang digunakan sebagai sumber bahan baku pada tahun ini",
    },
    {
      label: "Total Luas Lahan yang Ditanami Tahun Ini (ha)",
      inputType: "number",
      value: formData.luasTotalTahunIni,
      onChange: (e) => handleInputChange("luasTotalTahunIni", e.target.value),
      onSubmit: () =>
        handleUpdate("luasTotalTahunIni", formData.luasTotalTahunIni),
      locked: lockedStatus["luasTotalTahunIni"],
      fieldName: "luasTotalTahunIni",
      capt: "Keseluruhan luas lahan yang digunakan sebagai sumber bahan baku pada tahun ini",
    },
  ];

  const dataD3 = [
    {
      isSubtitle: true,
      label: "Produktivitas Tenaga Kerja",
    },
    {
      label: "Jam Henti A (%)",
      inputType: "number",
      value: formData.jumlahJamKerjaEfektif,
      onChange: (e) =>
        handleInputChange("jumlahJamKerjaEfektif", e.target.value),
      onSubmit: () =>
        handleUpdate("jumlahJamKerjaEfektif", formData.jumlahJamKerjaEfektif),
      locked: lockedStatus["jumlahJamKerjaEfektif"],
      fieldName: "jumlahJamKerjaEfektif",
      capt: "jam henti karena kekurangan bahan baku",
    },
    {
      label: "Jam Henti B (%)",
      inputType: "number",
      value: formData.totalJamKerja,
      onChange: (e) => handleInputChange("totalJamKerja", e.target.value),
      onSubmit: () => handleUpdate("totalJamKerja", formData.totalJamKerja),
      locked: lockedStatus["totalJamKerja"],
      fieldName: "totalJamKerja",
      capt: "jam henti karena kerusakan atau gangguan teknis pada peralatan pabrik",
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
      fieldName: "jamTerlaksana",
      capt: "Jumlah jam pelatihan terhadap karyawan yang dilakukan",
    },
    {
      label: "Jam Total (Jam/Tahun)",
      inputType: "number",
      value: formData.jamTotal,
      onChange: (e) => handleInputChange("jamTotal", e.target.value),
      onSubmit: () => handleUpdate("jamTotal", formData.jamTotal),
      locked: lockedStatus["jamTotal"],
      fieldName: "jamTotal",
      capt: "Jam pelatihan terhadap karyawan yang dilakukan",
    },
  ];

  const dataD3qc = [
    {
      isSubtitle: true,
      label: "Produktivitas Tenaga Kerja",
    },
    {
      label: "Jam Henti A (%)",
      inputType: "number",
      value: formData.jumlahJamKerjaEfektif,
      onChange: (e) =>
        handleInputChange("jumlahJamKerjaEfektif", e.target.value),
      onSubmit: () =>
        handleUpdate("jumlahJamKerjaEfektif", formData.jumlahJamKerjaEfektif),
      locked: lockedStatus["jumlahJamKerjaEfektif"],
      fieldName: "jumlahJamKerjaEfektif",
      capt: "jam henti karena kekurangan bahan baku",
    },
    {
      label: "Jam Henti B (%)",
      inputType: "number",
      value: formData.totalJamKerja,
      onChange: (e) => handleInputChange("totalJamKerja", e.target.value),
      onSubmit: () => handleUpdate("totalJamKerja", formData.totalJamKerja),
      locked: lockedStatus["totalJamKerja"],
      fieldName: "totalJamKerja",
      capt: "jam henti karena kerusakan atau gangguan teknis pada peralatan pabrik",
    },
  ];

  const dataD3sdm = [
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
      fieldName: "jamTerlaksana",
      capt: "Jumlah jam pelatihan terhadap karyawan yang dilakukan",
    },
    {
      label: "Jam Total (Jam/Tahun)",
      inputType: "number",
      value: formData.jamTotal,
      onChange: (e) => handleInputChange("jamTotal", e.target.value),
      onSubmit: () => handleUpdate("jamTotal", formData.jamTotal),
      locked: lockedStatus["jamTotal"],
      fieldName: "jamTotal",
      capt: "Jam pelatihan terhadap karyawan yang dilakukan",
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
      fieldName: "produktivitasTebu",
      capt: "Rata-rata rendemen tebu dalam satu tahun produksi",
    },
    {
      label: "Rendemen Tebu (%)",
      inputType: "number",
      value: formData.rendemenTebu,
      onChange: (e) => handleInputChange("rendemenTebu", e.target.value),
      onSubmit: () => handleUpdate("rendemenTebu", formData.rendemenTebu),
      locked: lockedStatus["rendemenTebu"],
      fieldName: "rendemenTebu",
      capt: "Rata-rata rendemen tebu dalam satu tahun produksi",
    },
    {
      label: "Tingkat Manis Bersih Segar",
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
      fieldName: "mbs",
      capt: "Penilaian kondisi manis, bersih, dan segar tebu dalam satu tahun produksi",
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
      fieldName: "overallRecovery",
      capt: "Tingkat efesiensi alat dan mesin produksi untuk menghasilkan gula",
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
      fieldName: "kis",
      capt: "KIS (Kapasitas giling include)",
    },
    {
      label: "KES (TCD)",
      inputType: "number",
      value: formData.kes,
      onChange: (e) => handleInputChange("kes", e.target.value),
      onSubmit: () => handleUpdate("kes", formData.kes),
      locked: lockedStatus["kes"],
      fieldName: "kes",
      capt: "KES (Kapasitas giling exclude)",
    },
  ];

  const dataD7 = [
    {
      label: "Tingkat Ratoon Tebu",
      inputType: "dropdown",
      value: formData.ratoonTebu,
      options: [
        { label: "PC", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "Lebih dari 3", value: 10 },
      ],
      onChange: (e) => handleInputChange("ratoonTebu", e.target.value),
      onSubmit: () => handleUpdate("ratoonTebu", formData.ratoonTebu),
      locked: lockedStatus["ratoonTebu"],
      fieldName: "ratoonTebu",
      capt: "Jumlah keprasan tanaman tebu pada tahun diukur. Angka yang diisikan adalah keprasan ke-berapa yang menghasilkan tanaman tebu terbanyak.",
    },
  ];

  const dataD8 = [
    {
      label: "Luas BL (ha)",
      inputType: "number",
      value: formData.luasBL,
      onChange: (e) => handleInputChange("luasBL", e.target.value),
      onSubmit: () => handleUpdate("luasBL", formData.luasBL),
      locked: lockedStatus["luasBL"],
      fieldName: "luasBL",
      capt: "Luas lahan yang ditanami oleh varitetas BL",
    },
    {
      label: "Luas PSJT941 (ha)",
      inputType: "number",
      value: formData.luasPST41,
      onChange: (e) => handleInputChange("luasPST41", e.target.value),
      onSubmit: () => handleUpdate("luasPST41", formData.luasPST41),
      locked: lockedStatus["luasPST41"],
      fieldName: "luasPST41",
      capt: "Luas lahan yang ditanami oleh varietas PSJT 941",
    },
    {
      label: "Luas PS864/PS862 (ha)",
      inputType: "number",
      value: formData.luasPS864,
      onChange: (e) => handleInputChange("luasPS864", e.target.value),
      onSubmit: () => handleUpdate("luasPS864", formData.luasPS864),
      locked: lockedStatus["luasPS864"],
      fieldName: "luasPS864",
      capt: "Luas lahan yang ditanami oleh varietas PS864 atau PS862",
    },
    {
      label: "Total Luas Lahan yang ditanam Tahun Ini (ha)",
      inputType: "number",
      value: formData.luasTotal,
      onChange: (e) => handleInputChange("luasTotal", e.target.value),
      onSubmit: () => handleUpdate("luasTotal", formData.luasTotal),
      locked: lockedStatus["luasTotal"],
      fieldName: "luasTotal",
      capt: "Luas total lahan yang ditanam",
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
      fieldName: "tingkatMekanisasi",
      capt: "Ketersediaan mesin dan alat untuk mendukung budidaya dalam peningkatan kadar gula",
    },
  ];

  const dataD10 = [
    {
      label: "Ketersediaan Teknologi Pengolahan Raw Sugar",
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
      fieldName: "teknologiPengolahanRawSugar",
      capt: "Ketersediaan teknologi pengolahan raw sugar untuk menerima raw sugar dan pemenuhan kapasitas",
    },
  ];

  if (loading) {
    return (
      <div className="py-16">
        <Skeleton rows={10} />
      </div>
    );
  }

  const allowedSections = [
    { roles: ["ADMIN", "SDM"], rows: dataD1 },
    { roles: ["ADMIN", "TANAMAN"], rows: dataD2 },
    { roles: ["ADMIN"], rows: dataD3 },
    { roles: ["QUALITYCONTROL"], rows: dataD3qc },
    { roles: ["SDM"], rows: dataD3sdm },
    { roles: ["ADMIN", "QUALITYCONTROL"], rows: dataD4 },
    { roles: ["ADMIN", "QUALITYCONTROL"], rows: dataD5 },
    { roles: ["ADMIN", "INSTALASI"], rows: dataD6 },
    { roles: ["ADMIN", "TANAMAN"], rows: dataD7 },
    { roles: ["ADMIN", "TANAMAN"], rows: dataD8 },
    { roles: ["ADMIN", "TANAMAN"], rows: dataD9 },
    { roles: ["ADMIN", "FABRIKASI"], rows: dataD10 },
  ];

  const userCanFill = allowedSections.some((section) =>
    section.roles.includes(role)
  );

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      {!userCanFill ? (
        <div className="bg-gray-100 border border-dashed border-gray-300 text-gray-600 text-center p-6 rounded-2xl my-8 flex flex-col items-center gap-2">
          <FaIndustry className="text-3xl text-green-600" />
          <p>
            Anda tidak perlu mengisi bagian <b>SUMBER DAYA</b>
          </p>
        </div>
      ) : (
        <>
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "SDM"],
            title: "Kemudahan Akses Sumber Daya Tenaga Kerja (D1)",
            rows: dataD1,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "TANAMAN"],
            title: "Tingkat Luas Tanam TRI (D2)",
            rows: dataD2,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN"],
            title: "Kompetensi Tenaga Kerja (D3)",
            rows: dataD3,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["QUALITYCONTROL"],
            title: "Kompetensi Tenaga Kerja (D3)",
            rows: dataD3qc,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["SDM"],
            title: "Kompetensi Tenaga Kerja (D3)",
            rows: dataD3sdm,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "QUALITYCONTROL"],
            title: "Kualitas Bahan Baku (D4)",
            rows: dataD4,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "QUALITYCONTROL"],
            title: "Overall Recovery (D5)",
            rows: dataD5,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "INSTALASI"],
            title: "Kecukupan Bahan Baku (D6)",
            rows: dataD6,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "TANAMAN"],
            title: "Tingkat Ratoon Tebu (D7)",
            rows: dataD7,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "TANAMAN"],
            title:
              "Varietas Tebu yang Responsif terhadap Kondisi Lahan yang Marginal (D8)",
            rows: dataD8,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "TANAMAN"],
            title:
              "Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan (D9)",
            rows: dataD9,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "FABRIKASI"],
            title: "Teknologi Pengolahan Raw Sugar (D10)",
            rows: dataD10,
            sesiId,
            isAdmin,
          })}
        </>
      )}
    </div>
  );
}
