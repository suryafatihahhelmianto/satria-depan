import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import TableInputRow from "./TableInputRow";

// Fungsi utama untuk tabel kinerja
export default function KinerjaTable({ title, rows }) {
  return (
    <div className="my-6">
      {/* Judul Tabel */}
      <h2 className="text-red-600 font-bold mt-5">{title}</h2>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-ijoKepalaTabel">
            <tr>
              <th className="px-4 py-2 w-1/3 border border-black">
                Sub Indikator
              </th>
              <th className="px-4 py-2 w-1/2 border border-black">Data</th>
              <th className="px-4 py-2 w-1/4 border border-black">Status</th>
            </tr>
          </thead>
          <tbody className="bg-ijoIsiTabel">
            {/* Memetakan setiap baris */}
            {rows.map((row, index) =>
              row.isSubtitle ? (
                // Jika baris merupakan sub-judul
                <tr key={index} className="bg-ijoIsiTabel">
                  <td
                    colSpan="3"
                    className="px-4 py-2 font-bold text-start border border-black"
                  >
                    {row.label}
                  </td>
                </tr>
              ) : (
                // Baris normal dengan input
                <TableInputRow
                  key={index}
                  label={row.label}
                  inputType={row.inputType}
                  value={row.value}
                  options={row.options}
                  onChange={row.onChange}
                  onSubmit={row.onSubmit}
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
