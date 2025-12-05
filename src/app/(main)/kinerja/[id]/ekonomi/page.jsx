"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import KinerjaTable from "@/components/table/KinerjaTable"; // Import the KinerjaTable component
import { usePathname, useRouter } from "next/navigation";
import Skeleton from "@/components/common/Skeleton";
import { useUser } from "@/context/UserContext";
import { FaChartLine } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";

function renderKinerjaSection({
  role,
  allowedRoles,
  title,
  rows,
  sesiId,
  isAdmin,
  type = "ekonomi",
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

export default function DataKinerja() {
  const router = useRouter();
  const { isAdmin, role } = useUser();
  const pathname = usePathname();
  const idMatch = pathname.match(/\/kinerja\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [formData, setFormData] = useState({
    nilaiRisiko: "",
    polAmpas: "",
    polBlotong: "",
    polTetes: "",
    rendemenKebun: "",
    rendemenGerbang: "",
    rendemenNPP: "",
    rendemenGula: "",
    kesenjanganRantai: "",
    kesenjanganPabrik: "",
    hargaAcuan: "",
    hargaLelang: "",
    shsTahunIni: "",
    shsTahunSebel: "",
    returnOE: "",
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

      // Periksa apakah value adalah string kosong atau tidak valid
      if (value === "" || value === null || value === undefined) {
        data[field] = 0; // Set default value 0 untuk field kosong
      } else {
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

      setFormData({
        nilaiRisiko: response.nilaiRisiko || "",
        polAmpas: response.polAmpas || "",
        polBlotong: response.polBlotong || "",
        polTetes: response.polTetes || "",
        rendemenKebun: response.rendemenKebun || "",
        rendemenGerbang: response.rendemenGerbang || "",
        rendemenNPP: response.rendemenNPP || "",
        rendemenGula: response.rendemenGula || "",
        kesenjanganRantai: response.kesenjanganRantai || "",
        kesenjanganPabrik: response.kesenjanganPabrik || "",
        hargaAcuan: response.hargaAcuan || "",
        hargaLelang: response.hargaLelang || "",
        shsTahunIni: response.shsTahunIni || "",
        shsTahunSebel: response.shsTahunSebel || "",
        returnOE: response.returnOE || "",
      });
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
      inputType: "text",
      value: formData.polAmpas,
      onChange: (e) => setFormData({ ...formData, polAmpas: e.target.value }),
      onSubmit: () => handleUpdate("polAmpas", formData.polAmpas),
      locked: lockedStatus["polAmpas"],
      fieldName: "polAmpas",
      capt: "Rata-rata pol ampas hingga hari terakhir giling",
    },
    {
      label: "Pol Blotong (%)",
      inputType: "text",
      value: formData.polBlotong,
      onChange: (e) => setFormData({ ...formData, polBlotong: e.target.value }),
      onSubmit: () => handleUpdate("polBlotong", formData.polBlotong),
      locked: lockedStatus["polBlotong"],
      fieldName: "polBlotong",
      capt: "Rata-rata pol blotong hingga hari terakhir giling",
    },
    {
      label: "Pol Tetes (%)",
      inputType: "text",
      value: formData.polTetes,
      onChange: (e) => setFormData({ ...formData, polTetes: e.target.value }),
      onSubmit: () => handleUpdate("polTetes", formData.polTetes),
      locked: lockedStatus["polTetes"],
      fieldName: "polTetes",
      capt: "Rata-rata pol tetes hingga hari terakhir giling",
    },
    {
      label: "Rendemen Kebun (%)",
      inputType: "text",
      value: formData.rendemenKebun,
      onChange: (e) =>
        setFormData({ ...formData, rendemenKebun: e.target.value }),
      onSubmit: () => handleUpdate("rendemenKebun", formData.rendemenKebun),
      locked: lockedStatus["rendemenKebun"],
      fieldName: "rendemenKebun",
      capt: "Rata-rata rendemen kebun hingga hari terakhir giling.",
    },
    {
      label: "Brix Gawang (%)",
      inputType: "text",
      value: formData.rendemenGerbang,
      onChange: (e) =>
        setFormData({ ...formData, rendemenGerbang: e.target.value }),
      onSubmit: () => handleUpdate("rendemenGerbang", formData.rendemenGerbang),
      locked: lockedStatus["rendemenGerbang"],
      fieldName: "rendemenGerbang",
      capt: "Rata-rata perhitungan Brix Gawang hingga hari terakhir giling.",
    },
    {
      label: "Rendemen NPP (%)",
      inputType: "text",
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
      inputType: "text",
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
      label: "Keuntungan Petani per Ton Tebu (Rp)",
      inputType: "text",
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
      label: "Keuntungan Pabrik per Ton Tebu (Rp)",
      inputType: "text",
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
      label: "Harga Acuan/Referensi (Rp/Kg)",
      inputType: "text",
      value: formData.hargaAcuan,
      onChange: (e) => setFormData({ ...formData, hargaAcuan: e.target.value }),
      onSubmit: () => handleUpdate("hargaAcuan", formData.hargaAcuan),
      locked: lockedStatus["hargaAcuan"],
      fieldName: "hargaAcuan",
      capt: "Rata-rata harga acuan yang ditetapkan  dalam satu tahun produksi perkilo",
    },
    {
      label: "Harga Lelang (rata-rata) (Rp/Kg)",
      inputType: "text",
      value: formData.hargaLelang,
      onChange: (e) =>
        setFormData({ ...formData, hargaLelang: e.target.value }),
      onSubmit: () => handleUpdate("hargaLelang", formData.hargaLelang),
      locked: lockedStatus["hargaLelang"],
      fieldName: "hargaLelang",
      capt: "Rata-rata harga lelang gula yang ditetapkan dalam satu tahun produksi perkilo",
    },
  ];

  const rowsE5 = [
    {
      label: "Produksi Tahun Ini (Ton)",
      inputType: "text",
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
      inputType: "text",
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
      inputType: "text",
      value: formData.returnOE,
      onChange: (e) => setFormData({ ...formData, returnOE: e.target.value }),
      onSubmit: () => handleUpdate("returnOE", formData.returnOE),
      locked: lockedStatus["returnOE"],
      fieldName: "returnOE",
      capt: "Presentase besarnya keuntungan yang diperoleh dari berbagai investasi yang telah dilakukan",
    },
  ];

  const allowedSections = [
    { roles: ["ADMIN", "KEPALAPABRIK"], rows: rowsE1 },
    { roles: ["ADMIN", "QUALITYCONTROL"], rows: rowsE2 },
    { roles: ["ADMIN", "TUK"], rows: rowsE3 },
    { roles: ["ADMIN", "TUK"], rows: rowsE4 },
    { roles: ["ADMIN", "TUK"], rows: rowsE5 },
    { roles: ["ADMIN", "TUK"], rows: rowsE6 },
  ];

  const userCanFill = allowedSections.some((section) =>
    section.roles.includes(role)
  );

  return (
    <div className="min-h-screen mb-24 bg-gray-100">
      {!userCanFill ? (
        <div className="flex flex-col items-center gap-2 p-6 my-8 text-center text-gray-600 bg-gray-100 border border-gray-300 border-dashed rounded-2xl">
          <FaChartLine className="text-3xl text-green-600" />
          <p>
            Anda tidak perlu mengisi bagian <b>EKONOMI</b>
          </p>
        </div>
      ) : (
        <>
          <div className="relative my-8">
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white via-white to-white
      blur-lg opacity-70 animate-[pulse_4s_ease-in-out_infinite]"
            ></div>

            <div
              className="flex flex-col gap-4 p-6
  rounded-2xl bg-white/30 backdrop-blur-lg border border-white/50
  shadow-xl hover:shadow-2xl transition-all duration-300
"
            >
              {/* Instruction wrapper */}
              <div className="flex items-start gap-4">
                {/* Exclamation Icon */}
                <FaExclamationTriangle className="text-8xl text-amber-400 drop-shadow-sm animate-pulse mt-1" />

                {/* Konten instruksi */}
                <div className="flex-1 flex flex-col gap-4">
                  {/* Decimal instruction */}
                  <div className="mt-2 flex justify-between items-center w-full">
                    <p className="text-gray-800 text-xl flex-1">
                      Gunakan{" "}
                      <span className="font-semibold text-gray-900">
                        titik (.)
                      </span>{" "}
                      atau{" "}
                      <span className="font-semibold text-gray-900">
                        koma (,)
                      </span>{" "}
                      sebagai pemisah angka desimal.
                    </p>

                    <div className="flex gap-2 mr-12 text-xl">
                      contoh:{" "}
                      <span className="inline-block px-2 py-1 border rounded-full font-bold text-gray-900 bg-gray-100">
                        9.14
                      </span>
                      <span className="inline-block px-2 py-1 border rounded-full font-bold text-gray-900 bg-gray-100">
                        9,14
                      </span>
                    </div>
                  </div>

                  {/* Thousands instruction */}
                  <div className="flex justify-between items-center w-full">
                    <p className="text-gray-800 text-xl flex-1">
                      Jangan gunakan{" "}
                      <span className="font-semibold text-gray-900">
                        tanda pemisah
                      </span>{" "}
                      apapun untuk angka ribuan.
                    </p>

                    <div className="flex gap-2 mr-8 text-xl">
                      contoh:{" "}
                      <span className="inline-block px-2 py-1 border rounded-full font-bold text-gray-900 bg-gray-100">
                        14000
                      </span>
                      <span className="inline-block px-2 py-1 border rounded-full font-bold text-gray-900 bg-gray-100">
                        9500
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "KEPALAPABRIK"],
            title: "Tingkat Risiko Rantai Pasok (E1)",
            rows: rowsE1,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "QUALITYCONTROL"],
            title: "Potensi Kehilangan Produksi (E2)",
            rows: rowsE2,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "TUK"],
            title:
              "Kesenjangan Keuntungan Pelaku Rantai Pasok per Ton Gula (E3)",
            rows: rowsE3,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "TUK"],
            title: "Harga Patokan Petani (E4)",
            rows: rowsE4,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "TUK"],
            title: "Tingkat Ketangkasan (E5)",
            rows: rowsE5,
            sesiId,
            isAdmin,
          })}
          {renderKinerjaSection({
            role,
            allowedRoles: ["ADMIN", "TUK"],
            title: "Return on Investment (E6)",
            rows: rowsE6,
            sesiId,
            isAdmin,
          })}
        </>
      )}
    </div>
  );
}
