"use client";

import OpsiDetail from "@/components/OpsiDetail";
import SpiderGraph from "@/components/SpiderGraph";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function DetailPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/detail\/([a-zA-Z0-9]+)/);
  const sesiId = idMatch ? idMatch[1] : null;

  const [dataEkonomi, setDataEkonomi] = useState([]);
  const [dataSpiderEkonomi, setDataSpiderEkonomi] = useState([]);
  const [nilaiDimensiEkonomi, setNilaiDimensiEkonomi] = useState(0);

  // console.log("ini sesiid: ", sesiId);

  // const [formData, setFormData] = useState({
  //   nilaiRisiko: 0,
  //   polAmpas: 0,
  //   polBlotong: 0,
  //   polTetes: 0,
  //   rendemenKebun: 0,
  //   rendemenGerbang: 0,
  //   rendemenNPP: 0,
  //   rendemenGula: 0,
  //   kesenjanganRantai: 0,
  //   hargaAcuan: 0,
  //   hargaLelang: 0,
  //   shsTahunIni: 0,
  //   shsTahunSebel: 0,
  //   returnOE: 0,
  // });

  // const dataEkonomi = [
  //   {
  //     id: 1,
  //     indikator: "Tingkat Risiko",
  //     simbol: "E1",
  //     nilai: 0.75,
  //     kategori: "Berkelanjutan",
  //   },
  //   {
  //     id: 2,
  //     indikator: "Hilangnya Produksi",
  //     simbol: "E2",
  //     nilai: 0.425,
  //     kategori: "Cukup Berkelanjutan",
  //   },
  //   {
  //     id: 3,
  //     indikator: "Kesenjangan Keuntungan",
  //     simbol: "E3",
  //     nilai: 0.312,
  //     kategori: "Tidak Berkelanjutan",
  //   },
  //   {
  //     id: 4,
  //     indikator: "Harga Patokan Petani",
  //     simbol: "E4",
  //     nilai: 0.89,
  //     kategori: "Berkelanjutan",
  //   },
  //   {
  //     id: 5,
  //     indikator: "Tingkat Ketangkasan",
  //     simbol: "E5",
  //     nilai: 0.672,
  //     kategori: "Cukup Berkelanjutan",
  //   },
  //   {
  //     id: 6,
  //     indikator: "Return on Investment (ROI)",
  //     simbol: "E6",
  //     nilai: 0.94,
  //     kategori: "Berkelanjutan",
  //   },
  // ];

  // const dataSpiderEkonomi = [
  //   { subject: "E1", A: 75.0 },
  //   { subject: "E2", A: 42.5 },
  //   { subject: "E3", A: 31.2 },
  //   { subject: "E4", A: 89.0 },
  //   { subject: "E5", A: 67.2 },
  //   { subject: "E6", A: 94.0 },
  // ];

  const fetchEkonomiData = async () => {
    const token = getCookie("token");
    try {
      const response = await fetchData(
        `/api/dimensi/ekonomi?sesiPengisianId=${sesiId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ini token: ", token);

      console.log("ini response: ", response);

      // Persiapkan data untuk tabel
      const dataTable = [
        {
          id: 1,
          indikator: "Tingkat Risiko",
          simbol: "E1",
          nilai: (response.tingkatRisiko * 100).toFixed(1), // Nilai dikali 100 untuk jadi persentase
        },
        {
          id: 2,
          indikator: "Hilangnya Produksi",
          simbol: "E2",
          nilai: (response.hilangProduksi * 100).toFixed(1),
        },
        {
          id: 3,
          indikator: "Kesenjangan Keuntungan",
          simbol: "E3",
          nilai: (response.kesenjanganKeuntungan * 100).toFixed(1),
        },
        {
          id: 4,
          indikator: "Harga Patokan Petani",
          simbol: "E4",
          nilai: (response.hargaPatokPetan * 100).toFixed(1),
        },
        {
          id: 5,
          indikator: "Tingkat Ketangkasan",
          simbol: "E5",
          nilai: (response.tingkatKetangkasan * 100).toFixed(1),
        },
        {
          id: 6,
          indikator: "Return on Investment (ROI)",
          simbol: "E6",
          nilai: (response.returnOnInvestment * 100).toFixed(1),
        },
      ];

      // Persiapkan data untuk SpiderGraph
      const spiderData = dataTable.map((item) => ({
        subject: item.simbol,
        A: item.nilai,
      }));

      setDataEkonomi(dataTable);
      setDataSpiderEkonomi(spiderData);
      setNilaiDimensiEkonomi(response.nilaiDimenEkono);
    } catch (error) {
      console.error("Error fetching dimensi ekonomi data:", error);
    }
  };

  useEffect(() => {
    fetchEkonomiData();
  }, [sesiId]);

  return (
    <div>
      <OpsiDetail />
      <SpiderGraph data={dataSpiderEkonomi} />
      <div className="min-h-screen bg-gray-100 mb-24">
        <div className="overflow-x-auto mt-4">
          {/* <div className="flex justify-center mb-4">
            <div className="bg-ijoIsiTabel p-4 border border-black">
              <h1>Berkelanjutan</h1>
            </div>
          </div> */}
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead className="bg-ijoKepalaTabel">
              <tr>
                <th className="px-4 py-2 text-left">Indikator</th>
                <th className="px-4 py-2 text-left">Simbol</th>
                <th className="px-4 py-2 text-left">Nilai (%)</th>
              </tr>
            </thead>
            <tbody className="bg-ijoIsiTabel">
              {dataEkonomi.map((data) => (
                <tr key={data.id}>
                  <td className="px-4 py-2">{data.indikator}</td>
                  <td className="px-4 py-2">{data.simbol}</td>
                  <td className="px-4 py-2">{data.nilai}</td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 font-bold" colSpan={2}>
                  Total Nilai Dimensi Ekonomi
                </td>
                <td className="px-4 py-2 font-bold">
                  {nilaiDimensiEkonomi.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
