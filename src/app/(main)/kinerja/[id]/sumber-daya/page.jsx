"use client";

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
      console.log("Data yang di-update (sdam): ", data);

      await fetchData(`/api/masukkan/sdam`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });
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

  useEffect(() => {
    const fetchSDAMData = async () => {
      try {
        const response = await fetchData(`/api/masukkan/sdam/${sesiId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });

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
    },
    {
      label: "Total Luas Lahan yang Ditanami Tahun Ini",
      inputType: "number",
      value: formData.luasTotalTahunIni,
      onChange: (e) => handleInputChange("luasTotalTahunIni", e.target.value),
      onSubmit: () =>
        handleUpdate("luasTotalTahunIni", formData.luasTotalTahunIni),
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
    },
    {
      label: "Total Jam Kerja Pegawai (Jam/Minggu)",
      inputType: "number",
      value: formData.totalJamKerja,
      onChange: (e) => handleInputChange("totalJamKerja", e.target.value),
      onSubmit: () => handleUpdate("totalJamKerja", formData.totalJamKerja),
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
    },
    {
      label: "Jam Total (Jam/Tahun)",
      inputType: "number",
      value: formData.jamTotal,
      onChange: (e) => handleInputChange("jamTotal", e.target.value),
      onSubmit: () => handleUpdate("jamTotal", formData.jamTotal),
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
    },
    {
      label: "Rendemen Tebu (%)",
      inputType: "number",
      value: formData.rendemenTebu,
      onChange: (e) => handleInputChange("rendemenTebu", e.target.value),
      onSubmit: () => handleUpdate("rendemenTebu", formData.rendemenTebu),
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
    },
  ];

  const dataD5 = [
    {
      label: "Overall Recovery (%)",
      inputType: "number",
      value: formData.overallRecovery,
      onChange: (e) => handleInputChange("overallRecovery", e.target.value),
      onSubmit: () => handleUpdate("overallRecovery", formData.overallRecovery),
    },
  ];

  const dataD6 = [
    {
      label: "KIS (TCD)",
      inputType: "number",
      value: formData.kis,
      onChange: (e) => handleInputChange("kis", e.target.value),
      onSubmit: () => handleUpdate("kis", formData.kis),
    },
    {
      label: "KES (TCD)",
      inputType: "number",
      value: formData.kes,
      onChange: (e) => handleInputChange("kes", e.target.value),
      onSubmit: () => handleUpdate("kes", formData.kes),
    },
  ];

  const dataD7 = [
    {
      label: "Tingkat Ratoon Tebu",
      inputType: "number",
      value: formData.ratoonTebu,
      onChange: (e) => handleInputChange("ratoonTebu", e.target.value),
      onSubmit: () => handleUpdate("ratoonTebu", formData.ratoonTebu),
    },
  ];

  const dataD8 = [
    {
      label: "Luas BL",
      inputType: "number",
      value: formData.luasBL,
      onChange: (e) => handleInputChange("luasBL", e.target.value),
      onSubmit: () => handleUpdate("luasBL", formData.luasBL),
    },
    {
      label: "Luas PST41",
      inputType: "number",
      value: formData.luasPST41,
      onChange: (e) => handleInputChange("luasPST41", e.target.value),
      onSubmit: () => handleUpdate("luasPST41", formData.luasPST41),
    },
    {
      label: "Luas PS864",
      inputType: "number",
      value: formData.PS864,
      onChange: (e) => handleInputChange("PS864", e.target.value),
      onSubmit: () => handleUpdate("PS864", formData.PS864),
    },
    {
      label: "Total Luas Lahan yang ditanam Tahun Ini",
      inputType: "number",
      value: formData.luasTotal,
      onChange: (e) => handleInputChange("luasTotal", e.target.value),
      onSubmit: () => handleUpdate("luasTotal", formData.luasTotal),
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
    },
  ];

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

      {/* <div className="text-center mt-6">
        <button
          type="button"
          onClick={handleCalculate}
          className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800"
        >
          Simpan dan Hitung Dimensi Sumber Daya
        </button>
      </div> */}
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-gray-100 mb-24">
  //     {/* D1 */}
  //     <h2 className="text-red-600 font-bold mt-5">
  //       Kemudahan Akses Sumber Daya Tenaga Kerja (D1)
  //     </h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <tr>
  //             <td className="px-4 py-2">
  //               Kemudahan akses sumber daya tenaga kerja (ordinal)
  //             </td>
  //             <td className="px-4 py-2">
  //               <select
  //                 value={formData.kemudahanAkses}
  //                 onChange={(e) =>
  //                   setFormData({
  //                     ...formData,
  //                     kemudahanAkses: parseFloat(e.target.value),
  //                   })
  //                 }
  //                 className="bg-ijoIsiTabel p-2 border rounded-lg"
  //               >
  //                 <option value={0.2}>Sangat Rendah</option>
  //                 <option value={0.3}>Rendah</option>
  //                 <option value={0.491}>Sedang</option>
  //                 <option value={0.772}>Tinggi</option>
  //                 <option value={1}>Sangat Tinggi</option>
  //               </select>
  //             </td>
  //             <td className="px-4 py-2">
  //               <button
  //                 onClick={() =>
  //                   handleUpdate("kemudahanAkses", formData.kemudahanAkses)
  //                 }
  //                 className="p-2 rounded-full text-2xl hover:text-gray-600"
  //               >
  //                 <AiFillCheckCircle />
  //               </button>
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* D2 */}
  //     <h2 className="text-red-600 font-bold mt-5">
  //       Tingkat Luas Tanam TRI (D2)
  //     </h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <FieldInput
  //             label="Luas tanam TRI tahun ini (Ha)"
  //             value={formData.luasTanamTahunIni}
  //             onChange={(e) =>
  //               setFormData({ ...formData, luasTanamTahunIni: e.target.value })
  //             }
  //           />
  //           <FieldInput
  //             label="Total luas lahan yang ditanami tahun ini (Ha)"
  //             value={formData.totalLuasLahan}
  //             onChange={(e) =>
  //               setFormData({ ...formData, totalLuasLahan: e.target.value })
  //             }
  //           />
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* D3 */}
  //     <h2 className="text-red-600 font-bold mt-5">
  //       Kompetensi Tenaga Kerja (D3)
  //     </h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <FieldInput
  //             label="Jumlah jam kerja efektif pegawai (hour)"
  //             value={formData.jamKerjaEfektif}
  //             onChange={(e) =>
  //               setFormData({ ...formData, jamKerjaEfektif: e.target.value })
  //             }
  //           />
  //           <FieldInput
  //             label="Total jam kerja pegawai (hour)"
  //             value={formData.totalJamKerja}
  //             onChange={(e) =>
  //               setFormData({ ...formData, totalJamKerja: e.target.value })
  //             }
  //           />

  //           <FieldInput
  //             label="Jam terlaksana"
  //             value={formData.jamTerlaksana}
  //             onChange={(e) =>
  //               setFormData({ ...formData, jamTerlaksana: e.target.value })
  //             }
  //           />
  //           <FieldInput
  //             label="Jam total"
  //             value={formData.jamTotal}
  //             onChange={(e) =>
  //               setFormData({ ...formData, jamTotal: e.target.value })
  //             }
  //           />
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* D4 */}
  //     <h2 className="text-red-600 font-bold mt-5">Kualitas Bahan Baku (D4)</h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <FieldInput
  //             label="Produktivitas tebu (Ton/Ha)"
  //             value={formData.produktivitasTebu}
  //             onChange={(e) =>
  //               setFormData({ ...formData, produktivitasTebu: e.target.value })
  //             }
  //           />
  //           <FieldInput
  //             label="Rendemen tebu (%)"
  //             value={formData.rendemenTebu}
  //             onChange={(e) =>
  //               setFormData({ ...formData, rendemenTebu: e.target.value })
  //             }
  //           />
  //           <tr>
  //             <td className="px-4 py-2">Manis Bersih Segar (MBS) (range)</td>
  //             <td className="px-4 py-2">
  //               <select
  //                 value={formData.mbs}
  //                 onChange={(e) =>
  //                   setFormData({
  //                     ...formData,
  //                     mbs: parseFloat(e.target.value),
  //                   })
  //                 }
  //                 className="bg-ijoIsiTabel p-2 border rounded-lg"
  //               >
  //                 <option value={0.2}>Sangat Rendah</option>
  //                 <option value={0.3}>Rendah</option>
  //                 <option value={0.491}>Sedang</option>
  //                 <option value={0.772}>Tinggi</option>
  //                 <option value={1}>Sangat Tinggi</option>
  //               </select>
  //             </td>
  //             <td className="px-4 py-2">
  //               <button
  //                 onClick={() => handleUpdate("mbs", formData.mbs)}
  //                 className="p-2 rounded-full text-2xl hover:text-gray-600"
  //               >
  //                 <AiFillCheckCircle />
  //               </button>
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* D5 */}
  //     <h2 className="text-red-600 font-bold mt-5">Overall Recovery (D5)</h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <FieldInput
  //             label="Overall Recovery (%)"
  //             value={formData.overallRecovery}
  //             onChange={(e) =>
  //               setFormData({ ...formData, overallRecovery: e.target.value })
  //             }
  //           />
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* D6 */}
  //     <h2 className="text-red-600 font-bold mt-5">
  //       Total Biaya Tenaga Kerja (D6)
  //     </h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <FieldInput
  //             label="KIS (Kapasitas giling include)"
  //             value={formData.kis}
  //             onChange={(e) =>
  //               setFormData({
  //                 ...formData,
  //                 kis: e.target.value,
  //               })
  //             }
  //           />
  //           <FieldInput
  //             label="KES (Kapasitas giling exclude)"
  //             value={formData.kes}
  //             onChange={(e) =>
  //               setFormData({ ...formData, kes: e.target.value })
  //             }
  //           />
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* D7 */}
  //     <h2 className="text-red-600 font-bold mt-5">Tingkat Ratoon Tebu (D7)</h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <FieldInput
  //             label="Tingkat Ratoon Tebu"
  //             value={formData.ratoonTebu}
  //             onChange={(e) =>
  //               setFormData({
  //                 ...formData,
  //                 ratoonTebu: e.target.value,
  //               })
  //             }
  //           />
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* D8 */}
  //     <h2 className="text-red-600 font-bold mt-5">
  //       Varietas Tebu yang Responsive Terhadap Kondisi Lahan (D8)
  //     </h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <FieldInput
  //             label="Luas BL"
  //             value={formData.luasBL}
  //             onChange={(e) =>
  //               setFormData({
  //                 ...formData,
  //                 luasBL: e.target.value,
  //               })
  //             }
  //           />
  //           <FieldInput
  //             label="Luas PST 41"
  //             value={formData.luasPST41}
  //             onChange={(e) =>
  //               setFormData({
  //                 ...formData,
  //                 luasPST41: e.target.value,
  //               })
  //             }
  //           />
  //           <FieldInput
  //             label="Luas JT49"
  //             value={formData.PS864}
  //             onChange={(e) =>
  //               setFormData({
  //                 ...formData,
  //                 PS864: e.target.value,
  //               })
  //             }
  //           />
  //           <FieldInput
  //             label="Total Luas Lahan yang Ditanami Tahun Ini"
  //             value={formData.totalLuasLahan}
  //             onChange={(e) =>
  //               setFormData({
  //                 ...formData,
  //                 totalLuasLahan: e.target.value,
  //               })
  //             }
  //           />
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* D9 */}
  //     <h2 className="text-red-600 font-bold mt-5">
  //       Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan (D9)
  //     </h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <tr>
  //             <td className="px-4 py-2">
  //               Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan
  //             </td>
  //             <td className="px-4 py-2">
  //               <select
  //                 value={formData.tingkatMekanisasi}
  //                 onChange={(e) =>
  //                   setFormData({
  //                     ...formData,
  //                     tingkatMekanisasi: parseFloat(e.target.value),
  //                   })
  //                 }
  //                 className="bg-ijoIsiTabel p-2 border rounded-lg"
  //               >
  //                 <option value={0.2}>Sangat Rendah</option>
  //                 <option value={0.3}>Rendah</option>
  //                 <option value={0.491}>Sedang</option>
  //                 <option value={0.772}>Tinggi</option>
  //                 <option value={1}>Sangat Tinggi</option>
  //               </select>
  //             </td>
  //             <td className="px-4 py-2">
  //               <button
  //                 onClick={() =>
  //                   handleUpdate(
  //                     "tingkatMekanisasi",
  //                     formData.tingkatMekanisasi
  //                   )
  //                 }
  //                 className="p-2 rounded-full text-2xl hover:text-gray-600"
  //               >
  //                 <AiFillCheckCircle />
  //               </button>
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* D10 */}
  //     <h2 className="text-red-600 font-bold mt-5">
  //       Teknologi Pengolahan Raw Sugar (D10)
  //     </h2>
  //     <div className="overflow-x-auto mt-4">
  //       <table className="min-w-full bg-white border rounded-lg shadow-md">
  //         <thead className="bg-ijoKepalaTabel">
  //           <tr>
  //             <th className="px-4 py-2 text-left">Sub Indikator</th>
  //             <th className="px-4 py-2 text-left">Data</th>
  //             <th className="px-4 py-2 text-left">Status</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-ijoIsiTabel">
  //           <tr>
  //             <td className="px-4 py-2">Teknologi Pengolahan Raw Sugar</td>
  //             <td className="px-4 py-2">
  //               <select
  //                 value={formData.teknologiPengolahanRawSugar}
  //                 onChange={(e) =>
  //                   setFormData({
  //                     ...formData,
  //                     teknologiPengolahanRawSugar: parseFloat(e.target.value),
  //                   })
  //                 }
  //                 className="bg-ijoIsiTabel p-2 border rounded-lg"
  //               >
  //                 <option value={0.2}>Sangat Rendah</option>
  //                 <option value={0.3}>Rendah</option>
  //                 <option value={0.491}>Sedang</option>
  //                 <option value={0.772}>Tinggi</option>
  //                 <option value={1}>Sangat Tinggi</option>
  //               </select>
  //             </td>
  //             <td className="px-4 py-2">
  //               <button
  //                 onClick={() =>
  //                   handleUpdate(
  //                     "teknologiPengolahanRawSugar",
  //                     formData.teknologiPengolahanRawSugar
  //                   )
  //                 }
  //                 className="p-2 rounded-full text-2xl hover:text-gray-600"
  //               >
  //                 <AiFillCheckCircle />
  //               </button>
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>

  //     <div className="mt-6">
  //       <button
  //         onClick={handleCalculate}
  //         className="bg-blue-500 text-white py-2 px-4 rounded-md"
  //       >
  //         Submit Data
  //       </button>
  //     </div>
  //   </div>
  // );
}
