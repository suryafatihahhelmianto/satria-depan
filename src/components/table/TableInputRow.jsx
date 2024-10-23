import React, { useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiOutlineLoading } from "react-icons/ai"; // Import a loading icon

// Komponen modal konfirmasi
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-5xl font-semibold text-gray-600 hover:text-red-600"
          aria-label="Close modal"
        >
          &times; {/* Using "×" as the close icon */}
        </button>

        <h2 className="text-xl font-bold mb-4">PERIKSA KEMBALI!</h2>
        <p className="mb-6">Apakah Anda yakin format masukan sudah sesuai?</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Periksa Kembali
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-ijoKepalaTabel text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen baris input untuk tabel
export default function TableInputRow({
  label,
  inputType,
  value,
  onChange,
  onSubmit,
  options,
}) {
  // State untuk menandai jika tombol telah ditekan dan loading
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  const handleConfirmSubmit = () => {
    setIsLoading(true); // Set loading state to true
    onSubmit(); // Call the provided onSubmit function
    setIsSubmitted(true);
    handleCloseModal(); // Close the modal
    // Simulate a delay for demonstration purposes
    setTimeout(() => {
      setIsLoading(false); // Reset loading state after some time
    }, 1000); // Adjust the duration as needed
  };

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
    <>
      <tr className="border-b">
        <td className="px-4 py-2 border border-black">{label}</td>
        <td className="px-4 py-2 border border-black">{renderInput()}</td>
        <td className="px-4 py-2 border border-black text-center">
          <button
            type="button"
            onClick={handleOpenModal}
            disabled={isLoading} // Disable button when loading
            className={`p-3 rounded-full text-3xl hover:text-gray-600 ${
              isSubmitted ? "text-green-600" : "text-gray-900"
            }`}
          >
            {isLoading ? (
              <AiOutlineLoading className="animate-spin" /> // Loading spinner
            ) : (
              <AiFillCheckCircle />
            )}
          </button>
        </td>
      </tr>

      {/* Modal Konfirmasi */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
}
