"use client";

import SpiderGraphEksekutif from "@/components/SpiderGraphEksekutif";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import {
  FaChartLine,
  FaIndustry,
  FaLeaf,
  FaUsers,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

export default function OpsiDetailEksekutif() {
  const [periode, setPeriode] = useState(0);
  const [namaPabrik, setNamaPabrik] = useState("");
  const [dataSpiderHasil, setDataSpiderHasil] = useState([]);
  const [dataSpiderSDAM, setDataSpiderSDAM] = useState([]);
  const [dataSpiderEkonomi, setDataSpiderEkonomi] = useState([]);
  const [dataSpiderLingkungan, setDataSpiderLingkungan] = useState([]);
  const [dataSpiderSosial, setDataSpiderSosial] = useState([]);

  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail-eksekutif\/([a-zA-Z0-9]+)/); // Capture ID after /detail-eksekutif/
  const id = idMatch ? idMatch[1] : null; // Extract ID if present

  const getKategori = (nilai) => {
    if (nilai >= 0 && nilai <= 25) return "Tidak Berkelanjutan";
    if (nilai > 25 && nilai <= 50) return "Kurang Berkelanjutan";
    if (nilai > 50 && nilai <= 75) return "Cukup Berkelanjutan";
    if (nilai > 75 && nilai <= 100) return "Berkelanjutan";
    return "Tidak Diketahui";
  };

  // Function to determine the active button style
  const getButtonStyle = (path) => {
    return pathname.startsWith(path)
      ? "bg-green-800 text-white font-semibold shadow-md transform transition-transform scale-105"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-green-800 font-medium shadow-sm";
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

      // Prepare data for the table
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

      // Prepare data for the table
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

      // Prepare data for SpiderGraph
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

      // Prepare data for the table
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

      // Prepare data for SpiderGraph
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
    if (!id) return; // ✅ hindari fetch kalau id belum siap

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
  }, [id]); // ✅ tambahkan dependency id

  useEffect(() => {
    fetchHasilKinerja();
    fetchSDAMData();
    fetchEkonomiData();
    fetchLingkunganData();
    fetchSosialData();
    fetchHeaderData();
  }, [fetchHeaderData]);

  return (
    <div>
      <div className="flex justify-center mb-8">
        <h1 className="font-bold text-5xl">
          Detail Kinerja PG <span className="text-green-800">{namaPabrik}</span>{" "}
          - Periode <span className="text-green-800">{periode}</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 md:gap-8 text-center">
        <Link
          href={`/detail-eksekutif/${id ? id : ""}/hasil`} // Add ID to URL if present
          className="border-4 rounded-lg"
        >
          <SpiderGraphEksekutif data={dataSpiderHasil} />
          <button className={`${getButtonStyle(
            `/detail-eksekutif/${id ? id : ""}/hasil`)} p-3 rounded-lg transition-all duration-200 w-full`}>Agregat</button>
        </Link>
        <Link
          href={`/detail-eksekutif/${id ? id : ""}/sumber-daya`} // Add ID to URL if present
          className="border-4 rounded-lg"
        >
          <SpiderGraphEksekutif data={dataSpiderSDAM} />
          <button className={`${getButtonStyle(
            `/detail-eksekutif/${id ? id : ""}/sumber-daya`)} p-3 rounded-lg transition-all duration-200 w-full`}>Sumber Daya</button>
        </Link>
        <Link
          href={`/detail-eksekutif/${id ? id : ""}/ekonomi`} // Add ID to URL if present
          className="border-4 rounded-lg"
        >
          <SpiderGraphEksekutif data={dataSpiderEkonomi} />
          <button className={`${getButtonStyle(
            `/detail-eksekutif/${id ? id : ""}/ekonomi`)} p-3 rounded-lg transition-all duration-200 w-full`}>Ekonomi</button>
        </Link>
        <Link
          href={`/detail-eksekutif/${id ? id : ""}/lingkungan`} // Add ID to URL if present
          className="border-4 rounded-lg"
        >
          <SpiderGraphEksekutif data={dataSpiderLingkungan} />
          <button className={`${getButtonStyle(
            `/detail-eksekutif/${id ? id : ""}/lingkungan`)} p-3 rounded-lg transition-all duration-200 w-full`}>Lingkungan</button>
        </Link>
        <Link
          href={`/detail-eksekutif/${id ? id : ""}/sosial`} // Add ID to URL if present
          className="border-4 rounded-lg"
        >
          <SpiderGraphEksekutif data={dataSpiderSosial} />
          <button className={`${getButtonStyle(
            `/detail-eksekutif/${id ? id : ""}/sosial`)} p-3 rounded-lg transition-all duration-200 w-full`}>Sosial</button>
        </Link>
      </div>
    </div>
  );
}
