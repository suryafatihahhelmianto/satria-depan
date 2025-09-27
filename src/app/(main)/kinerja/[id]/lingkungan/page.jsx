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
    biodiversitas: 0,
    emisiKarbon: 0,
    limbahCair: 0,
    limbahPadat: 0,
    energiTerbarukan: 0,
    efisiensiAir: 0,
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
      if (lockedStatus[field]) return;
      const data = { sesiId, [field]: parseFloat(value) };
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
