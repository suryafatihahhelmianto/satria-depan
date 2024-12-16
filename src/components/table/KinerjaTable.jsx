import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import TableInputRow from "./TableInputRow";

// Main component for performance table
export default function KinerjaTable({ title, rows, isAdmin, type, sesiId }) {
  return (
    <div className="my-8 p-4 bg-gray-100 rounded-lg shadow-lg">
      {/* Table Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left border-b border-gray-200">
                Sub Indikator
              </th>
              <th className="px-4 py-3 text-left border-b border-gray-200">
                Data
              </th>
              <th className="px-4 py-3 text-center border-b border-gray-200">
                Status
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-center border-b border-gray-200">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Map each row */}
            {rows.map((row, index) =>
              row.isSubtitle ? (
                // If row is a subtitle
                <tr key={index} className="bg-gray-200">
                  <td
                    colSpan="3"
                    className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-300"
                  >
                    {row.capt}
                  </td>
                </tr>
              ) : (
                // Normal row with input
                <TableInputRow
                  key={index}
                  label={row.label}
                  inputType={row.inputType}
                  value={row.value}
                  options={row.options}
                  onChange={row.onChange}
                  onSubmit={row.onSubmit}
                  locked={row.locked}
                  isAdmin={isAdmin}
                  type={type}
                  sesiId={sesiId}
                  fieldName={row.fieldName}
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
