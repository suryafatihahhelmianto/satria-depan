"use client";

import SpiderGraphEksekutif from "@/components/SpiderGraphEksekutif";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import {
  FaChartLine,
  FaIndustry,
  FaLeaf,
  FaUsers,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

const OPTIONS = [
  { id: "hasil", label: "Agregat", icon: null },
  { id: "sumber-daya", label: "Sumber Daya", icon: <FaIndustry /> },
  { id: "ekonomi", label: "Ekonomi", icon: <FaChartLine /> },
  { id: "lingkungan", label: "Lingkungan", icon: <FaLeaf /> },
  { id: "sosial", label: "Sosial", icon: <FaUsers /> },
];

export default function OpsiDetailEksekutif() {
  const [periode, setPeriode] = useState(0);
  const [namaPabrik, setNamaPabrik] = useState("");
  const [dataSpiderHasil, setDataSpiderHasil] = useState([]);
  const [dataSpiderSDAM, setDataSpiderSDAM] = useState([]);
  const [dataSpiderEkonomi, setDataSpiderEkonomi] = useState([]);
  const [dataSpiderLingkungan, setDataSpiderLingkungan] = useState([]);
  const [dataSpiderSosial, setDataSpiderSosial] = useState([]);
  const [activeOption, setActiveOption] = useState("hasil");
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const idMatch = pathname.match(/\/detail-eksekutif\/([a-zA-Z0-9]+)/);
  const id = idMatch ? idMatch[1] : null;

  // Determine active option from pathname
  useEffect(() => {
    if (pathname.includes("sumber-daya")) {
      setActiveOption("sumber-daya");
    } else if (pathname.includes("ekonomi")) {
      setActiveOption("ekonomi");
    } else if (pathname.includes("lingkungan")) {
      setActiveOption("lingkungan");
    } else if (pathname.includes("sosial")) {
      setActiveOption("sosial");
    } else {
      setActiveOption("hasil");
    }
  }, [pathname]);

  const getKategori = (nilai) => {
    if (nilai >= 0 && nilai <= 25) return "Tidak Berkelanjutan";
    if (nilai > 25 && nilai <= 50) return "Kurang Berkelanjutan";
    if (nilai > 50 && nilai <= 75) return "Cukup Berkelanjutan";
    if (nilai > 75 && nilai <= 100) return "Berkelanjutan";
    return "Tidak Diketahui";
  };

  const handleOptionSelect = (optionId) => {
    setActiveOption(optionId);
    setShowMobileOptions(false);
    router.push(`/detail-eksekutif/${id ? id : ""}/${optionId}`);
  };

  const getCurrentSpiderData = () => {
    switch (activeOption) {
      case "sumber-daya":
        return dataSpiderSDAM;
      case "ekonomi":
        return dataSpiderEkonomi;
      case "lingkungan":
        return dataSpiderLingkungan;
      case "sosial":
        return dataSpiderSosial;
      default:
        return dataSpiderHasil;
    }
  };

  const getCurrentOptionLabel = () => {
    const option = OPTIONS.find((opt) => opt.id === activeOption);
    return option ? option.label : "Agregat";
  };

  const fetchHasilKinerja = useCallback(async () => {
    try {
      const response = await fetchData(
        `/api/dimensi/hasil?sesiPengisianId=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const dataTable = [
        {
          dimensi: "D",
          nilai: parseFloat(response.nilaiDimenSDAM?.toFixed(2)),
          kategori: getKategori(response.nilaiDimenSDAM),
          icon: <FaIndustry className="text-gray-600 text-lg" />,
        },
        {
          dimensi: "E",
          nilai: parseFloat(response.nilaiDimenEkono?.toFixed(2)),
          kategori: getKategori(response.nilaiDimenEkono),
          icon: <FaChartLine className="text-gray-600 text-lg" />,
        },
        {
          dimensi: "L",
          nilai: parseFloat(response.nilaiDimenLingku?.toFixed(2)),
          kategori: getKategori(response.nilaiDimenLingku),
          icon: <FaLeaf className="text-gray-600 text-lg" />,
        },
        {
          dimensi: "S",
          nilai: parseFloat(response.nilaiDimenSosial?.toFixed(2)),
          kategori: getKategori(response.nilaiDimenSosial),
          icon: <FaUsers className="text-gray-600 text-lg" />,
        },
        {
          dimensi: "Total Nilai Kinerja",
          nilai: parseFloat(response.nilaiKinerja?.toFixed(2)),
          kategori: getKategori(response.nilaiKinerja),
          icon: null,
        },
      ];

      const spiderData = dataTable
        .filter((item) => item.dimensi !== "Total Nilai Kinerja")
        .map((item) => ({
          subject: item.dimensi,
          A: item.nilai,
        }));

      setDataSpiderHasil(spiderData);
    } catch (error) {
      console.error("Error fetching dimensi hasil data:", error);
    }
  }, [id]);

  const fetchSDAMData = useCallback(async () => {
    try {
      const response = await fetchData(
        `/api/dimensi/sdam?sesiPengisianId=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const dataTable = [
        {
          id: 1,
          indikator: "Kemudahan Akses Sumber Daya Tenaga Kerja",
          simbol: "D1",
          nilai: (response.aksesTenagKerja * 100).toFixed(1),
          leverage: response.leverageAksesTenagKerja,
        },
        {
          id: 2,
          indikator: "Tingkat Luas Tanam TRI",
          simbol: "D2",
          nilai: (response.luasTanamTRI * 100).toFixed(1),
          leverage: response.leverageLuasTanamTRI,
        },
        {
          id: 3,
          indikator: "Kompetensi Tenaga Kerja",
          simbol: "D3",
          nilai: (response.kompeTenagKerja * 100).toFixed(1),
          leverage: response.leverageKompeTenagKerja,
        },
        {
          id: 4,
          indikator: "Kualitas Bahan Baku",
          simbol: "D4",
          nilai: (response.kualiBahanBaku * 100).toFixed(1),
          leverage: response.leverageKualiBahanBaku,
        },
        {
          id: 5,
          indikator: "Overall Recovery",
          simbol: "D5",
          nilai: (response.efesiensPabrik * 100).toFixed(1),
          leverage: response.leverageEfesiensPabrik,
        },
        {
          id: 6,
          indikator: "Kecukupan Bahan Baku",
          simbol: "D6",
          nilai: (response.cukupBahanBaku * 100).toFixed(1),
          leverage: response.leverageCukupBahanBaku,
        },
        {
          id: 7,
          indikator: "Tingkat Ratoon Tebu",
          simbol: "D7",
          nilai: (response.tingkatRatoon * 100).toFixed(1),
          leverage: response.leverageTingkatRatoon,
        },
        {
          id: 8,
          indikator: "Varietas Tebu yang Responsif Terhadap Kondisi Lahan",
          simbol: "D8",
          nilai: (response.varieTebuRespon * 100).toFixed(1),
          leverage: response.leverageVarieTebuRespon,
        },
        {
          id: 9,
          indikator:
            "Tingkat Penggunaan Mekanisasi yang Tepat dan Sesuai Kebutuhan",
          simbol: "D9",
          nilai: (response.tingkatMekanis * 100).toFixed(1),
          leverage: response.leverageTingkatMekanis,
        },
        {
          id: 10,
          indikator: "Teknologi Pengolahan Raw Sugar",
          simbol: "D10",
          nilai: (response.teknoOlahGula * 100).toFixed(1),
          leverage: response.leverageTeknoOlahGula,
        },
      ];

      const spiderData = dataTable.map((item) => ({
        subject: item.simbol,
        A: item.nilai,
      }));

      setDataSpiderSDAM(spiderData);
    } catch (error) {
      console.error("Error fetching dimensi SDAM data:", error);
    }
  }, [id]);

  const fetchEkonomiData = useCallback(async () => {
    try {
      const response = await fetchData(
        `/api/dimensi/ekonomi?sesiPengisianId=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const dataTable = [
        {
          id: 1,
          indikator: "Tingkat Risiko",
          simbol: "E1",
          nilai: (response.tingkatRisiko * 100).toFixed(1),
          leverage: response.leverageTingkatRisiko,
        },
        {
          id: 2,
          indikator: "Hilangnya Produksi",
          simbol: "E2",
          nilai: (response.hilangProduksi * 100).toFixed(1),
          leverage: response.leverageHilangProduksi,
        },
        {
          id: 3,
          indikator: "Kesenjangan Keuntungan",
          simbol: "E3",
          nilai: (response.kesenjanganKeuntungan * 100).toFixed(1),
          leverage: response.leverageKesenjanganKeuntungan,
        },
        {
          id: 4,
          indikator: "Harga Patokan Petani",
          simbol: "E4",
          nilai: (response.hargaPatokPetan * 100).toFixed(1),
          leverage: response.leverageHargaPatokPetan,
        },
        {
          id: 5,
          indikator: "Tingkat Ketangkasan",
          simbol: "E5",
          nilai: (response.tingkatKetangkasan * 100).toFixed(1),
          leverage: response.leverageTingkatKetangkasan,
        },
        {
          id: 6,
          indikator: "Return on Investment (ROI)",
          simbol: "E6",
          nilai: (response.returnOnInvestment * 100).toFixed(1),
          leverage: response.leverageReturnOnInvestment,
        },
      ];

      const spiderData = dataTable.map((item) => ({
        subject: item.simbol,
        A: item.nilai,
      }));

      setDataSpiderEkonomi(spiderData);
    } catch (error) {
      console.error("Error fetching dimensi ekonomi data:", error);
    }
  }, [id]);

  const fetchLingkunganData = useCallback(async () => {
    try {
      const response = await fetchData(
        `/api/dimensi/lingkungan?sesiPengisianId=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const dataTable = [
        {
          id: 1,
          indikator: "Tingkat Bau",
          simbol: "L1",
          nilai: (response.tingkatBau * 100).toFixed(1),
          leverage: response.leverageTingkatBau,
        },
        {
          id: 2,
          indikator: "Tingkat Debu",
          simbol: "L2",
          nilai: (response.tingkatDebu * 100).toFixed(1),
          leverage: response.leverageTingkatDebu,
        },
        {
          id: 3,
          indikator: "Emisi Listrik",
          simbol: "L3",
          nilai: (response.emisiListrik * 100).toFixed(1),
          leverage: response.leverageEmisiListrik,
        },
        {
          id: 4,
          indikator: "Kebisingan",
          simbol: "L4",
          nilai: (response.kebisingan * 100).toFixed(1),
          leverage: response.leverageKebisingan,
        },
        {
          id: 5,
          indikator: "Air Muka Tanah",
          simbol: "L5",
          nilai: (response.airMukaan * 100).toFixed(1),
          leverage: response.leverageAirMukaan,
        },
        {
          id: 6,
          indikator: "Udara Ambien",
          simbol: "L6",
          nilai: (response.udaraAmbien * 100).toFixed(1),
          leverage: response.leverageUdaraAmbien,
        },
        {
          id: 7,
          indikator: "Udara Ruangan",
          simbol: "L7",
          nilai: (response.udaraRuang * 100).toFixed(1),
          leverage: response.leverageUdaraRuang,
        },
      ];

      const spiderData = dataTable.map((item) => ({
        subject: item.simbol,
        A: item.nilai,
      }));

      setDataSpiderLingkungan(spiderData);
    } catch (error) {
      console.error("Error fetching dimensi lingkungan data:", error);
    }
  }, [id]);

  const fetchSosialData = useCallback(async () => {
    try {
      const response = await fetchData(
        `/api/dimensi/sosial?sesiPengisianId=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const dataTable = [
        {
          id: 1,
          indikator: "Dukungan Kelembagaan terhadap Rantai Pasok ",
          simbol: "S1",
          nilai: (response.dukunganLembaga * 100).toFixed(1),
          leverage: response.leverageDukunganLembaga,
        },
        {
          id: 2,
          indikator: "Ketersediaan Infrastruktur sebagai Penunjang Aktivitas",
          simbol: "S2",
          nilai: (response.tersediaaInfrast * 100).toFixed(1),
          leverage: response.leverageTersediaaInfrast,
        },
        {
          id: 3,
          indikator: "Manfaat Corporate Sosial Responsibility bagi Sosial",
          simbol: "S3",
          nilai: (response.manfaatSosial * 100).toFixed(1),
          leverage: response.leverageManfaatSosial,
        },
        {
          id: 4,
          indikator: "Keluhan Limbah Rantai Pasok Industri",
          simbol: "S4",
          nilai: (response.keluhanLimbah * 100).toFixed(1),
          leverage: response.leverageKeluhanLimbah,
        },
        {
          id: 5,
          indikator: "Penyerapan Tenaga Kerja Lokal",
          simbol: "S5",
          nilai: (response.penyerapLokal * 100).toFixed(1),
          leverage: response.leveragePenyerapLokal,
        },
        {
          id: 6,
          indikator: "Peningkatan Keikutsertaan Stakeholder Kemitraan",
          simbol: "S6",
          nilai: (response.ikutMitra * 100).toFixed(1),
          leverage: response.leverageIkutMitra,
        },
      ];

      const spiderData = dataTable.map((item) => ({
        subject: item.simbol,
        A: item.nilai,
      }));

      setDataSpiderSosial(spiderData);
    } catch (error) {
      console.error("Error fetching dimensi Sosial data:", error);
    }
  }, [id]);

  const fetchHeaderData = useCallback(async () => {
    if (!id) return;

    try {
      const response = await fetchData(`/api/sesi/header/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
      });

      setPeriode(new Date(response.data.tanggalMulai).getFullYear());
      setNamaPabrik(response.data.pabrikGula.namaPabrik);
    } catch (error) {
      console.error("Error fetching header data:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchHasilKinerja();
    fetchSDAMData();
    fetchEkonomiData();
    fetchLingkunganData();
    fetchSosialData();
    fetchHeaderData();
  }, [
    id,
    fetchHasilKinerja,
    fetchSDAMData,
    fetchEkonomiData,
    fetchLingkunganData,
    fetchSosialData,
    fetchHeaderData,
  ]);

  return (
    <div className="px-2 sm:px-4 md:px-6">
      {/* Judul Responsif */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Detail Kinerja PG{" "}
          <span className="text-green-800 block sm:inline">{namaPabrik}</span> -{" "}
          Periode{" "}
          <span className="text-green-800 block sm:inline">{periode}</span>
        </h1>
      </div>

      {/* Mobile Toggle Button (Only shown on mobile) */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowMobileOptions(!showMobileOptions)}
          className="w-full bg-green-800 text-white p-3 rounded-lg flex items-center justify-between font-medium"
        >
          <span className="flex items-center gap-2">
            {OPTIONS.find((opt) => opt.id === activeOption)?.icon}
            {getCurrentOptionLabel()}
          </span>
          {showMobileOptions ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {/* Options Panel for Mobile */}
      {showMobileOptions && (
        <div className="sm:hidden mb-6 bg-white border rounded-lg shadow-lg">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full p-4 flex items-center gap-3 border-b last:border-b-0 transition-colors ${
                activeOption === option.id
                  ? "bg-green-50 text-green-800 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.icon && <span className="text-lg">{option.icon}</span>}
              <span className="text-left">{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Desktop Options Tabs (Hidden on mobile) */}
      <div className="hidden sm:flex justify-center mb-8">
        <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-xl">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-200 font-medium ${
                activeOption === option.id
                  ? "bg-green-800 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200 hover:text-green-800"
              }`}
            >
              {option.icon && <span>{option.icon}</span>}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Display Area */}
      <div className="border-2 sm:border-4 rounded-xl p-4 sm:p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Spider Chart - {getCurrentOptionLabel()}
          </h2>
        </div>

        <div className="h-[300px] sm:h-[400px] md:h-[500px]">
          <SpiderGraphEksekutif data={getCurrentSpiderData()} />
          <div className="sm:hidden mt-1 text-center">
            <p className="text-sm text-gray-500">
              Tap tombol di atas untuk mengganti dimensi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
