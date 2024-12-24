"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { formatNumberToIndonesian } from "@/tools/formatNumber";
import { formatTanggal } from "@/tools/formatTanggal";

export default function DetailPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/rendemen\/([a-zA-Z0-9]+)/);
  const detailId = idMatch ? idMatch[1] : null;

  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const jenisOptions = {
    0: "Mandiri",
    1: "PC",
    2: "R1",
    3: "R2",
    4: "R3",
    5: "RC",
    6: "TRS I KM B",
    7: "TRS I KM C",
    8: "TRS I KM E",
    9: "TRS II KM B",
    10: "TRS II KM C",
    11: "TRS II KM D",
    12: "TRS II KM E",
    13: "TRS II KM K",
    14: "TRT I KM B",
    15: "TRT I KM K",
    16: "TRT II KM B",
    17: "TRT II KM C",
    18: "TRT II KM K",
    19: "TRT III KM C",
  };

  const masaTanamOptions = {
    0: "5A",
    1: "5B",
    2: "6A",
    3: "6B",
    4: "7A",
    5: "7B",
    6: "8A",
    7: "8B",
    8: "9A",
    9: "9B",
    10: "10A",
    11: "10B",
    12: "11A",
    13: "11B",
    14: "12A",
    15: "12B",
  };

  const varietasOptions = {
    0: "BL",
    1: "CENING",
    2: "GMP1",
    3: "GMP2",
    4: "GMP3",
    5: "KK",
    6: "KENTUNG",
    7: "LAMPUNG3",
    8: "PA8213",
    9: "PA8218",
    10: "PA822",
    11: "PA822 (KB II)",
    12: "PA828",
    13: "PA1301",
    14: "PA1303",
    15: "PA1401",
    16: "PA1601",
    17: "PA197",
    18: "PS851",
    19: "PS862",
    20: "PS864",
    21: "PS865",
    22: "PS881",
    23: "PS882",
    24: "PSJK922",
    25: "PSJT941",
  };

  const kemasakanOptions = {
    0: "Awal",
    1: "Awal Tengah",
    2: "Tengah",
    3: "Tengah Lambat",
  };

  useEffect(() => {
    if (!detailId) {
      console.error("Detail ID tidak ditemukan.");
      return;
    }

    const fetchDetailData = async () => {
      try {
        setLoading(true);
        const response = await fetchData(`/api/rendemen/detail/${detailId}`, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });

        setDetailData(response.data);
      } catch (err) {
        setError("Gagal mengambil data detail.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [detailId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              Detail Rendemen <span>{formatTanggal(detailData.tanggal)}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Blok Kebun</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {detailData.blokKebun || "Data tidak tersedia"}
                </p>
              </div>

              <div>
                <label className="block text-gray-700">Jenis</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {jenisOptions[detailData.jenis]}
                </p>
              </div>

              <div>
                <label className="block text-gray-700">Masa Tanam</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {masaTanamOptions[detailData.mt]}
                </p>
              </div>
              <div>
                <label className="block text-gray-700">Varietas</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {varietasOptions[detailData.varietas]}
                </p>
              </div>
              <div>
                <label className="block text-gray-700">Kemasakan</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {kemasakanOptions[detailData.kemasakan]}
                </p>
              </div>

              <div>
                <label className="block text-gray-700">Brix</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {detailData.brix !== undefined
                    ? formatNumberToIndonesian(detailData.brix)
                    : "Data tidak tersedia"}
                </p>
              </div>

              {/* <div>
                <label className="block text-gray-700">Pol</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {detailData.pol !== undefined
                    ? formatNumberToIndonesian(detailData.pol)
                    : "Data tidak tersedia"}
                </p>
              </div> */}
              <div>
                <label className="block text-gray-700">Curah Hujan</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {detailData.curahHujan !== undefined
                    ? formatNumberToIndonesian(detailData.curahHujan)
                    : "Data tidak tersedia"}
                </p>
              </div>

              {/* <div>
                <label className="block text-gray-700">
                  Harka Kemurnian (HK)
                </label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {detailData.hk !== undefined
                    ? formatNumberToIndonesian(detailData.hk)
                    : "Data tidak tersedia"}
                </p>
              </div>

              <div>
                <label className="block text-gray-700">Nilai Nira (NN)</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {detailData.nn !== undefined
                    ? formatNumberToIndonesian(detailData.nn)
                    : "Data tidak tersedia"}
                </p>
              </div>

              <div>
                <label className="block text-gray-700">
                  Faktor Kemasakan (FK)
                </label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {detailData.fk !== undefined
                    ? formatNumberToIndonesian(detailData.fk)
                    : "Data tidak tersedia"}
                </p>
              </div> */}
            </div>

            {detailData.nilaiRendemen && (
              <div className="mt-6">
                <h3 className="text-center bg-green-600 text-white py-2 rounded-t-lg">
                  Nilai Rendemen
                </h3>
                <div className="bg-green-100 p-8 rounded-b-lg">
                  <p className="text-center text-6xl font-bold">
                    {formatNumberToIndonesian(detailData.nilaiRendemen)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
