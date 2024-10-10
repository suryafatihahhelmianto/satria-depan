import React from "react";

// Komponen FieldInput untuk merender input dan tombol submit
export default function FieldInput({ label, value, onChange, onSubmit }) {
  return (
    <tr className="border-b">
      <td className="px-4 py-2">{label}</td>
      <td className="px-4 py-2">
        <input
          type="number"
          value={value}
          onChange={onChange}
          className="p-2 bg-ijoIsiTabel"
        />
      </td>
      <td className="px-4 py-2">
        <button
          type="button"
          onClick={onSubmit}
          className="p-2 rounded bg-green-500"
        >
          ✔️
        </button>
      </td>
    </tr>
  );
}
