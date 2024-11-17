import React, { useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiOutlineLoading, AiOutlineWarning } from "react-icons/ai";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { AiFillExclamationCircle } from "react-icons/ai";

// Redesigned modal component
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-3xl font-bold text-gray-500 hover:text-red-500 transition"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Periksa Kembali!
        </h2>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin format masukan sudah sesuai?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Periksa Kembali
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

// Redesigned input row component
export default function TableInputRow({
  label,
  inputType,
  value,
  onChange,
  onSubmit,
  options,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSubmit = () => {
    setIsLoading(true);
    onSubmit();
    setIsSubmitted(true);
    handleCloseModal();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const renderInput = () => {
    switch (inputType) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={onChange}
            className="p-2 bg-gray-100 border rounded-md w-full focus:outline-none focus:ring focus:ring-green-300"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={onChange}
            className="p-2 bg-gray-100 border rounded-md w-full focus:outline-none focus:ring focus:ring-green-300"
          />
        );
      case "dropdown":
        return (
          <select
            value={value}
            onChange={onChange}
            className="bg-gray-100 p-2 border rounded-md w-full focus:outline-none focus:ring focus:ring-green-300"
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
    <>
      <tr className="border-b hover:bg-gray-50 transition">
        <td className="px-4 py-2 border border-gray-200 rounded-l-md">
          <div className="flex items-center">
            {label} <AiOutlineInfoCircle className="ml-2 text-green-500" />
          </div>
        </td>
        <td className="px-4 py-2 border border-gray-200">{renderInput()}</td>
        <td className="px-4 py-2 border border-gray-200 text-center rounded-r-md">
          <button
            type="button"
            onClick={handleOpenModal}
            disabled={isLoading}
            className={`p-3 rounded-full text-3xl hover:bg-gray-200 transition ${
              isSubmitted ? "text-green-500" : "text-gray-700"
            }`}
          >
            {isSubmitted ? (
              isLoading ? (
                <AiOutlineLoading className="animate-spin" />
              ) : (
                <AiFillCheckCircle />
              )
            ) : (
              <AiFillExclamationCircle className="animate-pulse text-red-500" />
            )}
          </button>
        </td>
      </tr>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
}
