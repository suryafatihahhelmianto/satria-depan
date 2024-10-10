import Link from "next/link";
import React from "react";

export default function KinerjaPage() {
  const sessions = [
    { id: 1, periode: "2023", batasPengisian: "16/07/2024" },
    { id: 2, periode: "2022", batasPengisian: "17/07/2024" },
    { id: 3, periode: "2021", batasPengisian: "18/07/2024" },
    { id: 4, periode: "2020", batasPengisian: "19/07/2024" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Riwayat Pengisian Sesi</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Periode</th>
            <th className="py-2 px-4 border-b">Batas Pengisian</th>
            <th className="py-2 px-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{session.periode}</td>
              <td className="py-2 px-4 border-b">{session.batasPengisian}</td>
              <td className="py-2 px-4 border-b">
                <Link
                  className="text-blue-600 hover:text-blue-800"
                  href="/kinerja/ekonomi"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
