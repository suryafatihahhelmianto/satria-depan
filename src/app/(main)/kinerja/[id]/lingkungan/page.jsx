"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import KinerjaTable from "@/components/table/KinerjaTable";
import { usePathname, useRouter } from "next/navigation";
import Skeleton from "@/components/common/Skeleton";
import { useUser } from "@/context/UserContext";
import { FaLeaf } from "react-icons/fa";

// Helper untuk render tiap section
function renderKinerjaSection({
  role,
  allowedRoles,
  title,
  rows,
  sesiId,
  isAdmin,
}) {
  if (!allowedRoles.includes(role)) return null;

  return (
    <KinerjaTable
      key={title}
      title={title}
      rows={rows}
      type="lingkungan"
      sesiId={sesiId}
      isAdmin={isAdmin}
    />
  );
}

export default function DataLingkungan() {
  const router = useRouter();
  const { isAdmin, role } = useUser();
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [formData, setFormData] = useState({
    amoniaDesaA1: "",
    amoniaDesaA2: "",
    amoniaDesaB1: "",
    amoniaDesaB2: "",
    sulfidaDesaA1: "",
    sulfidaDesaA2: "",
    sulfidaDesaB1: "",
    sulfidaDesaB2: "",
    debuDesaA1: "",
    debuDesaA2: "",
    debuDesaB1: "",
    debuDesaB2: "",
    konsumsiListrik: "",
    jumlahTonTebu: "",
    shs: "",
    bisingProduksi1: "",
    bisingProduksi2: "",
    bisingDesaA1: "",
    bisingDesaA2: "",
    bisingDesaB1: "",
    bisingDesaB2: "",
    totalResiduJuni: "",
    bodJuni: "",
    codJuni: "",
    sulfidaJuni: "",
    totalResiduJuli: "",
    bodJuli: "",
    codJuli: "",
    sulfidaJuli: "",
    totalResiduAgustus: "",
    bodAgustus: "",
    codAgustus: "",
    sulfidaAgustus: "",
    totalResiduSeptember: "",
    bodSeptember: "",
    codSeptember: "",
    sulfidaSeptember: "",

    sulfurDesaA1: "",
    sulfurDesaA2: "",
    sulfurDesaB1: "",
    sulfurDesaB2: "",
    karbonDesaA1: "",
    karbonDesaA2: "",
    karbonDesaB1: "",
    karbonDesaB2: "",
    nitrogenDesaA1: "",
    nitrogenDesaA2: "",
    nitrogenDesaB1: "",
    nitrogenDesaB2: "",
    oksidaDesaA1: "",
    oksidaDesaA2: "",
    oksidaDesaB1: "",
    oksidaDesaB2: "",

    amoniaKerja1: "",
    amoniaKerja2: "",
    debuKerja1: "",
    debuKerja2: "",
    nitrogenKerja1: "",
    nitrogenKerja2: "",
    sulfurKerja1: "",
    sulfurKerja2: "",
  });

  const [lockedStatus, setLockedStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  // --- Handler ---
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsFormDirty(true);
  };

  const handleUpdate = async (field, value) => {
    try {
      const data = { sesiId };

      // Periksa apakah value adalah string kosong atau tidak valid
      if (value === "" || value === null || value === undefined) {
        data[field] = 0; // Set default value 0 untuk field kosong
      } else {
        // Pastikan 'value' adalah string sebelum menggunakan .replace()
        let numericValue = value;
        if (typeof value === "string") {
          numericValue = parseFloat(value.replace(",", ".")); // Ganti koma menjadi titik jika pengguna memasukkan koma
        } else {
          numericValue = parseFloat(value); // Jika value sudah berupa angka, langsung parse float
        }

        if (!isNaN(numericValue)) {
          data[field] = numericValue;
        } else {
          data[field] = 0; // Set default value 0 jika nilai tidak valid
        }
      }

      await fetchData(`/api/masukkan/lingkungan`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });
      setIsFormDirty(false);
    } catch (error) {
      console.error("Error updating field: ", error);
    }
  };

  const fetchLingkungan = useCallback(async () => {
    try {
      const response = await fetchData(`/api/masukkan/lingkungan/${sesiId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      setFormData((prevState) => ({
        ...prevState, // Pertahankan data lama
        amoniaDesaA1: response.amoniaDesaA1 || "",
        amoniaDesaA2: response.amoniaDesaA2 || "",
        amoniaDesaB1: response.amoniaDesaB1 || "",
        amoniaDesaB2: response.amoniaDesaB2 || "",
        sulfidaDesaA1: response.sulfidaDesaA1 || "",
        sulfidaDesaA2: response.sulfidaDesaA2 || "",
        sulfidaDesaB1: response.sulfidaDesaB1 || "",
        sulfidaDesaB2: response.sulfidaDesaB2 || "",
        debuDesaA1: response.debuDesaA1 || "",
        debuDesaA2: response.debuDesaA2 || "",
        debuDesaB1: response.debuDesaB1 || "",
        debuDesaB2: response.debuDesaB2 || "",
        konsumsiListrik: response.konsumsiListrik || "",
        jumlahTonTebu: response.jumlahTonTebu || "",
        shs: response.shs || "",
        bisingProduksi1: response.bisingProduksi1 || "",
        bisingProduksi2: response.bisingProduksi2 || "",
        bisingDesaA1: response.bisingDesaA1 || "",
        bisingDesaA2: response.bisingDesaA2 || "",
        bisingDesaB1: response.bisingDesaB1 || "",
        bisingDesaB2: response.bisingDesaB2 || "",
        totalResiduJuni: response.totalResiduJuni || "",
        bodJuni: response.bodJuni || "",
        codJuni: response.codJuni || "",
        sulfidaJuni: response.sulfidaJuni || "",
        totalResiduJuli: response.totalResiduJuli || "",
        bodJuli: response.bodJuli || "",
        codJuli: response.codJuli || "",
        sulfidaJuli: response.sulfidaJuli || "",
        totalResiduAgustus: response.totalResiduAgustus || "",
        bodAgustus: response.bodAgustus || "",
        codAgustus: response.codAgustus || "",
        sulfidaAgustus: response.sulfidaAgustus || "",
        totalResiduSeptember: response.totalResiduSeptember || "",
        bodSeptember: response.bodSeptember || "",
        codSeptember: response.codSeptember || "",
        sulfidaSeptember: response.sulfidaSeptember || "",
        sulfurDesaA1: response.sulfurDesaA1 || "",
        sulfurDesaA2: response.sulfurDesaA2 || "",
        sulfurDesaB1: response.sulfurDesaB1 || "",
        sulfurDesaB2: response.sulfurDesaB2 || "",
        karbonDesaA1: response.karbonDesaA1 || "",
        karbonDesaA2: response.karbonDesaA2 || "",
        karbonDesaB1: response.karbonDesaB1 || "",
        karbonDesaB2: response.karbonDesaB2 || "",
        nitrogenDesaA1: response.nitrogenDesaA1 || "",
        nitrogenDesaA2: response.nitrogenDesaA2 || "",
        nitrogenDesaB1: response.nitrogenDesaB1 || "",
        nitrogenDesaB2: response.nitrogenDesaB2 || "",
        oksidaDesaA1: response.oksidaDesaA1 || "",
        oksidaDesaA2: response.oksidaDesaA2 || "",
        oksidaDesaB1: response.oksidaDesaB1 || "",
        oksidaDesaB2: response.oksidaDesaB2 || "",
        amoniaKerja1: response.amoniaKerja1 || "",
        amoniaKerja2: response.amoniaKerja2 || "",
        debuKerja1: response.debuKerja1 || "",
        debuKerja2: response.debuKerja2 || "",
        nitrogenKerja1: response.nitrogenKerja1 || "",
        nitrogenKerja2: response.nitrogenKerja2 || "",
        sulfurKerja1: response.sulfurKerja1 || "",
        sulfurKerja2: response.sulfurKerja2 || "",
      }));

      const lockedResponse = await fetchData(
        `/api/masukkan/lingkungan/locked-status/${sesiId}`,
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
    fetchLingkungan();
  }, [fetchLingkungan]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleRouteChange = () => {
      if (isFormDirty) {
        const confirmLeave = window.confirm(
          "Ada perubahan pada data yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?"
        );
        if (!confirmLeave) {
          router.push(currentPath);
          return;
        }
        setIsFormDirty(false);
      }
      setCurrentPath(pathname);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    if (currentPath !== pathname) handleRouteChange();

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

  // --- Rows L1 sampai L6 ---
  const rowsL1 = [
    {
      label: "Biodiversitas",
      inputType: "number",
      placeholder: formData.biodiversitas,
      onChange: (e) => handleInputChange("biodiversitas", e.target.value),
      onSubmit: () => handleUpdate("biodiversitas", formData.biodiversitas),
      locked: lockedStatus["biodiversitas"],
      fieldName: "biodiversitas",
      capt: "Indikator keberagaman hayati di area produksi",
    },
  ];

  const rowsL2 = [
    {
      label: "Emisi Karbon",
      inputType: "number",
      placeholder: formData.emisiKarbon,
      onChange: (e) => handleInputChange("emisiKarbon", e.target.value),
      onSubmit: () => handleUpdate("emisiKarbon", formData.emisiKarbon),
      locked: lockedStatus["emisiKarbon"],
      fieldName: "emisiKarbon",
      capt: "Jumlah emisi karbon dari proses produksi",
    },
  ];

  const rowsL3 = [
    {
      label: "Limbah Cair",
      inputType: "number",
      placeholder: formData.limbahCair,
      onChange: (e) => handleInputChange("limbahCair", e.target.value),
      onSubmit: () => handleUpdate("limbahCair", formData.limbahCair),
      locked: lockedStatus["limbahCair"],
      fieldName: "limbahCair",
      capt: "Jumlah limbah cair yang dihasilkan",
    },
  ];

  const rowsL4 = [
    {
      label: "Limbah Padat",
      inputType: "number",
      placeholder: formData.limbahPadat,
      onChange: (e) => handleInputChange("limbahPadat", e.target.value),
      onSubmit: () => handleUpdate("limbahPadat", formData.limbahPadat),
      locked: lockedStatus["limbahPadat"],
      fieldName: "limbahPadat",
      capt: "Jumlah limbah padat yang dihasilkan",
    },
  ];

  const rowsL5 = [
    {
      label: "Energi Terbarukan",
      inputType: "number",
      value: formData.energiTerbarukan,
      onChange: (e) => handleInputChange("energiTerbarukan", e.target.value),
      onSubmit: () =>
        handleUpdate("energiTerbarukan", formData.energiTerbarukan),
      locked: lockedStatus["energiTerbarukan"],
      fieldName: "energiTerbarukan",
      capt: "Persentase energi terbarukan yang digunakan",
    },
  ];

  const rowsL6 = [
    {
      label: "Efisiensi Air",
      inputType: "number",
      value: formData.efisiensiAir,
      onChange: (e) => handleInputChange("efisiensiAir", e.target.value),
      onSubmit: () => handleUpdate("efisiensiAir", formData.efisiensiAir),
      locked: lockedStatus["efisiensiAir"],
      fieldName: "efisiensiAir",
      capt: "Efisiensi penggunaan air dalam proses produksi",
    },
  ];

  // --- Allowed sections ---
  const allowedSections = [
    {
      roles: ["ADMIN", "KEPALAPABRIK"],
      title: "Biodiversitas (L1)",
      rows: rowsL1,
    },
    {
      roles: ["ADMIN", "QUALITYCONTROL"],
      title: "Emisi Karbon (L2)",
      rows: rowsL2,
    },
    { roles: ["ADMIN", "LINGKUNGAN"], title: "Limbah Cair (L3)", rows: rowsL3 },
    {
      roles: ["ADMIN", "LINGKUNGAN"],
      title: "Limbah Padat (L4)",
      rows: rowsL4,
    },
    {
      roles: ["ADMIN", "LINGKUNGAN"],
      title: "Energi Terbarukan (L5)",
      rows: rowsL5,
    },
    {
      roles: ["ADMIN", "LINGKUNGAN"],
      title: "Efisiensi Air (L6)",
      rows: rowsL6,
    },
  ];

  const userCanFill = allowedSections.some((section) =>
    section.roles.includes(role)
  );

  return (
    <div className="min-h-screen bg-gray-100 mb-24">
      {!userCanFill ? (
        <div className="bg-gray-100 border border-dashed border-gray-300 text-gray-600 text-center p-6 rounded-2xl my-4 flex flex-col items-center gap-2">
          <FaLeaf className="text-3xl text-green-600" />
          <p>
            Kamu <b>tak perlu mengisi bagian LINGKUNGAN</b>
          </p>
        </div>
      ) : (
        allowedSections.map((section) =>
          renderKinerjaSection({
            role,
            allowedRoles: section.roles,
            title: section.title,
            rows: section.rows,
            sesiId,
            isAdmin,
          })
        )
      )}
    </div>
  );
}
