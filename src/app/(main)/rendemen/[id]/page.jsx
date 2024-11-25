"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { formatNumberToIndonesian } from "@/tools/formatNumber";

export default function DetailPage() {
  const pathname = usePathname();
  const idMatch = pathname.match(/\/rendemen\/([a-zA-Z0-9]+)/);
  const detailId = idMatch ? idMatch[1] : null;

  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
            <h2 className="text-xl font-semibold mb-6">Detail Rendemen</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Blok Kebun</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {detailData.blokKebun || "Data tidak tersedia"}
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

              <div>
                <label className="block text-gray-700">Pol</label>
                <p className="bg-green-100 w-full p-2 rounded">
                  {detailData.pol !== undefined
                    ? formatNumberToIndonesian(detailData.pol)
                    : "Data tidak tersedia"}
                </p>
              </div>

              <div>
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
              </div>
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
