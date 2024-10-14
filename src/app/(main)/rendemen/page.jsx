import Link from "next/link";
import React from "react";

export default function RendemenPage() {
  const sessions = [
    { id: 1, periode: "2023", batasPengisian: "16/07/2024" },
    { id: 2, periode: "2022", batasPengisian: "17/07/2024" },
    { id: 3, periode: "2021", batasPengisian: "18/07/2024" },
    { id: 4, periode: "2020", batasPengisian: "19/07/2024" },
  ];

  return (    
    <div className="min-h-screen flex justify-center items-center p-4 bg-gray-100">
      <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-lg h-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Riwayat Pengisian Sesi</h1>
        <div className="overflow-auto h-full">
          <table className="w-full bg-white border-collapse h-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-6 text-left">Periode</th>
                <th className="py-3 px-6 text-left">Batas Pengisian</th>
                <th className="py-3 px-6 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="bg-green-50 border border-green-200 rounded-lg mb-2"
                >
                  <td className="py-4 px-6 border-b">{session.periode}</td>
                  <td className="py-4 px-6 border-b">{session.batasPengisian}</td>
                  <td className="py-4 px-6 border-b">
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
      </div>
    </div>
  );
}
