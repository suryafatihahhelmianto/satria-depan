"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import KinerjaTable from "@/components/table/KinerjaTable"; // Import the KinerjaTable component
import { usePathname, useRouter } from "next/navigation";
import Skeleton from "@/components/common/Skeleton";
import { useUser } from "@/context/UserContext";

export default function DataKinerja() {
  const router = useRouter();
  const { isAdmin, role } = useUser();
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
    kesenjanganPabrik: 0,
    hargaAcuan: 0,
    hargaLelang: 0,
    shsTahunIni: 0,
    shsTahunSebel: 0,
    returnOE: 0,
  });

  const [lockedStatus, setLockedStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setIsFormDirty(true);
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
      // fetchEkonomi();
      setIsFormDirty(false);
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
    } catch (error) {
      console.error("Error calculating dimensions: ", error);
    }
  };

  const fetchEkonomi = useCallback(async () => {
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
  }, [sesiId]);

  useEffect(() => {
    fetchEkonomi();
  }, [fetchEkonomi]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleRouteChange = () => {
      if (isFormDirty) {
        const confirm = window.confirm(
          "Ada perubahan pada data yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?"
        );
        if (!confirm) {
          router.push(currentPath);
          return;
        }
        setIsFormDirty(false);
      }
      setCurrentPath(pathname);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    if (currentPath !== pathname) {
      handleRouteChange();
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty, pathname, currentPath, router]);

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
      fieldName: "nilaiRisiko",
      capt: "Risiko keseluruhan rantai pasok agroindustri dalam rangka keberlanjutan industri",
    },
  ];

  const rowsE2 = [
    {
      label: "Pol Ampas (%)",
      inputType: "number",
      value: formData.polAmpas,
      onChange: (e) => setFormData({ ...formData, polAmpas: e.target.value }),
      onSubmit: () => handleUpdate("polAmpas", formData.polAmpas),
      locked: lockedStatus["polAmpas"],
      fieldName: "polAmpas",
      capt: "Rata-rata pol ampas hingga hari terakhir giling",
    },
    {
      label: "Pol Blotong (%)",
      inputType: "number",
      value: formData.polBlotong,
      onChange: (e) => setFormData({ ...formData, polBlotong: e.target.value }),
      onSubmit: () => handleUpdate("polBlotong", formData.polBlotong),
      locked: lockedStatus["polBlotong"],
      fieldName: "polBlotong",
      capt: "Rata-rata pol blotong hingga hari terakhir giling",
    },
    {
      label: "Pol Tetes (%)",
      inputType: "number",
      value: formData.polTetes,
      onChange: (e) => setFormData({ ...formData, polTetes: e.target.value }),
      onSubmit: () => handleUpdate("polTetes", formData.polTetes),
      locked: lockedStatus["polTetes"],
      fieldName: "polTetes",
      capt: "Rata-rata pol tetes hingga hari terakhir giling",
    },
    {
      label: "Rendemen Kebun (%)",
      inputType: "number",
      value: formData.rendemenKebun,
      onChange: (e) =>
        setFormData({ ...formData, rendemenKebun: e.target.value }),
      onSubmit: () => handleUpdate("rendemenKebun", formData.rendemenKebun),
      locked: lockedStatus["rendemenKebun"],
      fieldName: "rendemenKebun",
      capt: "Rata-rata rendemen kebun hingga hari terakhir giling.",
    },
    {
      label: "Rendemen Gerbang (%)",
      inputType: "number",
      value: formData.rendemenGerbang,
      onChange: (e) =>
        setFormData({ ...formData, rendemenGerbang: e.target.value }),
      onSubmit: () => handleUpdate("rendemenGerbang", formData.rendemenGerbang),
      locked: lockedStatus["rendemenGerbang"],
      fieldName: "rendemenGerbang",
      capt: "Rata-rata rendemen gerbang hingga hari terakhir giling.",
    },
    {
      label: "Rendemen NPP (%)",
      inputType: "number",
      value: formData.rendemenNPP,
      onChange: (e) =>
        setFormData({ ...formData, rendemenNPP: e.target.value }),
      onSubmit: () => handleUpdate("rendemenNPP", formData.rendemenNPP),
      locked: lockedStatus["rendemenNPP"],
      fieldName: "rendemenNPP",
      capt: "Rata-rata rendemen NPP hingga hari terakhir giling",
    },
    {
      label: "Rendemen Gula (%)",
      inputType: "number",
      value: formData.rendemenGula,
      onChange: (e) =>
        setFormData({ ...formData, rendemenGula: e.target.value }),
      onSubmit: () => handleUpdate("rendemenGula", formData.rendemenGula),
      locked: lockedStatus["rendemenGula"],
      fieldName: "rendemenGula",
      capt: "Rata-rata rendemen gula hingga hari terakhir giling ",
    },
  ];

  const rowsE3 = [
    {
      label: "Keuntungan Petani per Ton Tebu (%)",
      inputType: "number",
      value: formData.kesenjanganRantai,
      onChange: (e) =>
        setFormData({ ...formData, kesenjanganRantai: e.target.value }),
      onSubmit: () =>
        handleUpdate("kesenjanganRantai", formData.kesenjanganRantai),
      locked: lockedStatus["kesenjanganRantai"],
      fieldName: "kesenjanganRantai",
      capt: "Rata-rata keuntungan yang diperolah petani per ton dalam satu tahun produksi",
    },
    {
      label: "Keuntungan Pabrik per Ton Tebu (%)",
      inputType: "number",
      value: formData.kesenjanganPabrik,
      onChange: (e) =>
        setFormData({ ...formData, kesenjanganPabrik: e.target.value }),
      onSubmit: () =>
        handleUpdate("kesenjanganPabrik", formData.kesenjanganPabrik),
      locked: lockedStatus["kesenjanganPabrik"],
      fieldName: "kesenjanganPabrik",
      capt: "Rata-rata keuntungan yang diperolah petani per ton dalam satu tahun produksi",
    },
  ];

  const rowsE4 = [
    {
      label: "Harga Acuan/Referensi (Rp)",
      inputType: "number",
      value: formData.hargaAcuan,
      onChange: (e) => setFormData({ ...formData, hargaAcuan: e.target.value }),
      onSubmit: () => handleUpdate("hargaAcuan", formData.hargaAcuan),
      locked: lockedStatus["hargaAcuan"],
      fieldName: "hargaAcuan",
      capt: "Rata-rata harga acuan yang ditetapkan  dalam satu tahun produksi",
    },
    {
      label: "Harga Lelang (rata-rata) (Rp)",
      inputType: "number",
      value: formData.hargaLelang,
      onChange: (e) =>
        setFormData({ ...formData, hargaLelang: e.target.value }),
      onSubmit: () => handleUpdate("hargaLelang", formData.hargaLelang),
      locked: lockedStatus["hargaLelang"],
      fieldName: "hargaLelang",
      capt: "Rata-rata harga lelang gula yang ditetapkan dalam satu tahun produksi",
    },
  ];

  const rowsE5 = [
    {
      label: "Produksi Tahun Ini (Ton)",
      inputType: "number",
      value: formData.shsTahunIni,
      onChange: (e) =>
        setFormData({ ...formData, shsTahunIni: e.target.value }),
      onSubmit: () => handleUpdate("shsTahunIni", formData.shsTahunIni),
      locked: lockedStatus["shsTahunIni"],
      fieldName: "shsTahunIni",
      capt: "Total produksi gula pada tahun ini",
    },
    {
      label: "Produksi tahun lalu (Ton)",
      inputType: "number",
      value: formData.shsTahunSebel,
      onChange: (e) =>
        setFormData({ ...formData, shsTahunSebel: e.target.value }),
      onSubmit: () => handleUpdate("shsTahunSebel", formData.shsTahunSebel),
      locked: lockedStatus["shsTahunSebel"],
      fieldName: "shsTahunSebel",
      capt: "Total produksi gula pada tahun lalu",
    },
  ];

  const rowsE6 = [
    {
      label: "Return on Invesment (ROI) (%)",
      inputType: "number",
      value: formData.returnOE,
      onChange: (e) => setFormData({ ...formData, returnOE: e.target.value }),
      onSubmit: () => handleUpdate("returnOE", formData.returnOE),
      locked: lockedStatus["returnOE"],
      fieldName: "returnOE",
      capt: "Presentase besarnya keuntungan yang diperoleh dari berbagai investasi yang telah dilakukan",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      {["ADMIN", "KEPALAPABRIK"].includes(role) && (
        <KinerjaTable
          title="Tingkat Risiko Rantai Pasok (E1)"
          rows={rowsE1}
          type={"ekonomi"}
          sesiId={sesiId}
          isAdmin={isAdmin}
        />
      )}
      {["ADMIN", "QUALITYCONTROL"].includes(role) && (
        <KinerjaTable
          title="Potensi Kehilangan Produksi (E2)"
          rows={rowsE2}
          type={"ekonomi"}
          sesiId={sesiId}
          isAdmin={isAdmin}
        />
      )}

      {["ADMIN", "TUK"].includes(role) && (
        <>
          <KinerjaTable
            title="Kesenjangan Keuntungan Pelaku Rantai Pasok per Ton Gula (E3)"
            rows={rowsE3}
            type={"ekonomi"}
            sesiId={sesiId}
            isAdmin={isAdmin}
          />
        </>
      )}
      {["ADMIN", "TUK"].includes(role) && (
        <>
          <KinerjaTable
            title="Harga Patokan Petani (E4)"
            rows={rowsE4}
            type={"ekonomi"}
            sesiId={sesiId}
            isAdmin={isAdmin}
          />
        </>
      )}

      {["ADMIN", "TUK"].includes(role) && (
        <>
          <KinerjaTable
            title="Tingkat Ketangkasan (E5)"
            rows={rowsE5}
            type={"ekonomi"}
            sesiId={sesiId}
            isAdmin={isAdmin}
          />
          <KinerjaTable
            title="Return on Investment (E6)"
            rows={rowsE6}
            type={"ekonomi"}
            sesiId={sesiId}
            isAdmin={isAdmin}
          />
        </>
      )}

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
