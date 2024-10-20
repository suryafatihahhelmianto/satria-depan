import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";

// Komponen baris input untuk tabel
export default function TableInputRow({
  label,
  inputType,
  value,
  onChange,
  onSubmit,
  options,
}) {
  const renderInput = () => {
    switch (inputType) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={onChange}
            className="p-2 bg-ijoIsiTabel w-full"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={onChange}
            className="p-2 bg-ijoIsiTabel w-full"
          />
        );
      case "dropdown":
        return (
          <select
            value={value}
            onChange={onChange}
            className="bg-ijoIsiTabel p-2 border rounded-lg w-full"
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <tr className="border-b">
      <td className="px-4 py-2 border border-black">{label}</td>
      <td className="px-4 py-2 border border-black">{renderInput()}</td>
      <td className="px-4 py-2 border border-black text-center">
        <button
          type="button"
          onClick={onSubmit}
          className="p-2 rounded-full text-2xl hover:text-gray-600"
        >
          <AiFillCheckCircle />
        </button>
      </td>
    </tr>
  );
}
