"use client";

import { useState, useEffect } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import KinerjaTable from "@/components/table/KinerjaTable"; // Import the KinerjaTable component
import { usePathname } from "next/navigation";
import { AiFillCheckCircle } from "react-icons/ai";
import Skeleton from "@/components/common/Skeleton";
import { useUser } from "@/context/UserContext";

export default function DataSosial() {
  const { isAdmin, role } = useUser();
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
    luasLahanTahunLalu: 0,
    luasLahanYangDitanamiTahunLalu: 0,
  });

  const [lockedStatus, setLockedStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const handleUpdate = async (field, value) => {
    if (lockedStatus[field]) {
      console.log(`Kolom ${field} sudah terkunci, tidak bisa diupdate.`);
      return;
    }

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
      // fetchSosialData();
      // console.log("Update successful");
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
    } catch (error) {
      console.error("Error calculating dimensions: ", error);
    }
  };

  const fetchSosialData = async () => {
    try {
      const response = await fetchData(`/api/masukkan/sosial/${sesiId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      const lockedResponse = await fetchData(
        `/api/masukkan/sosial/locked-status/${sesiId}`,
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
    fetchSosialData();
  }, [sesiId]);

  if (loading) {
    return (
      <div className="py-16">
        <Skeleton rows={10} />
      </div>
    );
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
      locked: lockedStatus["rantaiPasok"],
      fieldName: "rantaiPasok",
      capt: "Tingkat kebermanfaatan kelembagaan dalam pendukung efesinesi dan efektivitas setiap rantai pasok agroindustri",
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
      locked: lockedStatus["sediaAktivita"],
      fieldName: "sediaAktivita",
      capt: "Tingkat ketersediaan infrastruktur jalan, listrik, dan moda transportasi untuk memperlancar kegiatan rantai pasok dan aktivitas masyarakat",
    },
  ];

  const rowsS3 = [
    {
      label: "Manfaat Corporate Social Responsibility Bagi Sosial",
      inputType: "dropdown",
      value: formData.tingkatManfaat,
      options: [
        { value: 0.2, label: "Sangat Buruk" },
        { value: 0.3, label: "Buruk" },
        { value: 0.491, label: "Sedang" },
        { value: 0.772, label: "Baik" },
        { value: 1, label: "Sangat Baik" },
      ],
      onChange: (e) =>
        setFormData({
          ...formData,
          tingkatManfaat: parseFloat(e.target.value),
        }),
      onSubmit: () => handleUpdate("tingkatManfaat", formData.tingkatManfaat),
      locked: lockedStatus["tingkatManfaat"],
      fieldName: "tingkatManfaat",
      capt: "Tingkat kebermanfaatan kegiatan CSR bagi masyarakat dan perusahaan",
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
      locked: lockedStatus["tingkatLimbah"],
      fieldName: "tingkatLimbah",
      capt: "Tingkat keluhan dari masyarakat terkait pembuangan limbah",
    },
  ];

  const rowsS5 = [
    {
      label: "PKWT Tenaga Kerja Lokal (orang)",
      inputType: "number",
      value: formData.tetapMajaIndra,
      onChange: (e) =>
        setFormData({ ...formData, tetapMajaIndra: e.target.value }),
      onSubmit: () => handleUpdate("tetapMajaIndra", formData.tetapMajaIndra),
      locked: lockedStatus["tetapMajaIndra"],
      fieldName: "tetapMajaIndra",
      capt: "Tenaga kerja kontrak yang berasal dari warga lokal sekitar pabrik",
    },
    {
      label: "PKWT Total (orang)",
      inputType: "number",
      value: formData.tetapTotal,
      onChange: (e) => setFormData({ ...formData, tetapTotal: e.target.value }),
      onSubmit: () => handleUpdate("tetapTotal", formData.tetapTotal),
      locked: lockedStatus["tetapTotal"],
      fieldName: "tetapTotal",
      capt: "Keseluruhan tenaga kerja kontrak",
    },
    {
      label: "PKWTT Tenaga Kerja Lokal (orang)",
      inputType: "number",
      value: formData.tidakMajaIndra,
      onChange: (e) =>
        setFormData({ ...formData, tidakMajaIndra: e.target.value }),
      onSubmit: () => handleUpdate("tidakMajaIndra", formData.tidakMajaIndra),
      locked: lockedStatus["tidakMajaIndra"],
      fieldName: "tidakMajaIndra",
      capt: "Tenaga kerja tetap yang berasal dari warga lokal sekitar pabrik",
    },
    {
      label: "PKWTT Total (orang)",
      inputType: "number",
      value: formData.tidakTetapTotal,
      onChange: (e) =>
        setFormData({ ...formData, tidakTetapTotal: e.target.value }),
      onSubmit: () => handleUpdate("tidakTetapTotal", formData.tidakTetapTotal),
      locked: lockedStatus["tidakTetapTotal"],
      fieldName: "tidakTetapTotal",
      capt: "Keseluruhan tenaga kerja tetap",
    },
  ];

  const rowsS6 = [
    {
      label: "Luas Lahan Kemitraan Tahun Ini (ha)",
      inputType: "number",
      value: formData.luasLahan,
      onChange: (e) => setFormData({ ...formData, luasLahan: e.target.value }),
      onSubmit: () => handleUpdate("luasLahan", formData.luasLahan),
      locked: lockedStatus["luasLahan"],
      fieldName: "luasLahan",
      capt: "Lahan yang diberikan pinajaman dari perusahaan pada tahun ini",
    },
    // {
    //   label: "Total Luas Lahan yang Ditanami Tahun Ini (ha)",
    //   inputType: "number",
    //   value: formData.luasLahanYangDitanami,
    //   onChange: (e) =>
    //     setFormData({
    //       ...formData,
    //       luasLahanYangDitanami: e.target.value,
    //     }),
    //   onSubmit: () =>
    //     handleUpdate("luasLahanYangDitanami", formData.luasLahanYangDitanami),
    //   locked: lockedStatus["luasLahanYangDitanami"],
    //   fieldName: "luasLahanYangDitanami",
    // },
    {
      label: "Luas Lahan Kemitraan Tahun Lalu (ha)",
      inputType: "number",
      value: formData.luasLahanTahunLalu,
      onChange: (e) =>
        setFormData({ ...formData, luasLahanTahunLalu: e.target.value }),
      onSubmit: () =>
        handleUpdate("luasLahanTahunLalu", formData.luasLahanTahunLalu),
      locked: lockedStatus["luasLahanTahunLalu"],
      fieldName: "luasLahanTahunLalu",
      capt: "Lahan yang diberikan pinajaman dari perusahaan pada tahun lalu",
    },
    // {
    //   label: "Total Luas Lahan yang Ditanami Tahun Lalu (ha)",
    //   inputType: "number",
    //   value: formData.luasLahanYangDitanamiTahunLalu,
    //   onChange: (e) =>
    //     setFormData({
    //       ...formData,
    //       luasLahanYangDitanamiTahunLalu: e.target.value,
    //     }),
    //   onSubmit: () =>
    //     handleUpdate(
    //       "luasLahanYangDitanamiTahunLalu",
    //       formData.luasLahanYangDitanamiTahunLalu
    //     ),
    //   locked: lockedStatus["luasLahanYangDitanamiTahunLalu"],
    //   fieldName: "luasLahanYangDitanamiTahunLalu",
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      {["ADMIN", "KEPALAPABRIK"].includes(role) && (
        <KinerjaTable
          title="Dukungan Kelembagaan terhadap Rantai Pasok Agroindustri (S1)"
          rows={rowsS1}
          isAdmin={isAdmin}
          type={"sosial"}
          sesiId={sesiId}
        />
      )}

      {["ADMIN", "SDM"].includes(role) && (
        <KinerjaTable
          title="Ketersediaan Infrastruktur sebagai Penunjang Aktivitas (S2)"
          rows={rowsS2}
          isAdmin={isAdmin}
          type={"sosial"}
          sesiId={sesiId}
        />
      )}

      {["ADMIN", "SDM"].includes(role) && (
        <KinerjaTable
          title="Manfaat Corporate Social Responsibility bagi Sosial (S3)"
          rows={rowsS3}
          isAdmin={isAdmin}
          type={"sosial"}
          sesiId={sesiId}
        />
      )}

      {["ADMIN", "QUALITYCONTROL"].includes(role) && (
        <KinerjaTable
          title="Keluhan Limbah Rantai Pasok Industri (S4)"
          rows={rowsS4}
          isAdmin={isAdmin}
          type={"sosial"}
          sesiId={sesiId}
        />
      )}
      {["ADMIN", "SDM"].includes(role) && (
        <KinerjaTable
          title="Penyerapan Tenaga Kerja Lokal (S5)"
          rows={rowsS5}
          isAdmin={isAdmin}
          type={"sosial"}
          sesiId={sesiId}
        />
      )}
      {["ADMIN", "TANAMAN"].includes(role) && (
        <KinerjaTable
          title="Peningkatan Keikutsertaan Stakeholder Kemitraan (S6)"
          rows={rowsS6}
          isAdmin={isAdmin}
          type={"sosial"}
          sesiId={sesiId}
        />
      )}

      {/* <div className="text-center mt-6">
        <button
          type="button"
          onClick={handleCalculate}
          className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800"
        >
          Simpan dan Hitung Dimensi Sosial
        </button>
      </div> */}
    </div>
  );
}
