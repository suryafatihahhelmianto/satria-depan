"use client";

import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  AiFillCheckCircle,
  AiOutlineLoading,
  AiOutlineInfoCircle,
  AiFillExclamationCircle,
  AiOutlineUnlock,
} from "react-icons/ai";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-3xl font-bold text-gray-500 hover:text-red-500 transition"
          aria-label="Close modal"
          disabled={isLoading} // Nonaktifkan tombol close saat loading
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
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-red-400 hover:text-white transition"
            disabled={isLoading} // Nonaktifkan tombol saat loading
          >
            Periksa Kembali
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg transition ${
              isLoading
                ? "bg-green-400 text-white cursor-wait"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            }`}
            disabled={isLoading} // Nonaktifkan tombol saat loading
          >
            {isLoading ? (
              <AiOutlineLoading className="animate-spin text-xl" /> // Ikon loading
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TableInputRow({
  label,
  inputType,
  value,
  onChange,
  onSubmit,
  options,
  locked,
  isAdmin,
  type,
  sesiId,
  fieldName,
  capt,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localLocked, setLocalLocked] = useState(locked);

  const router = useRouter();

  const resetState = async () => {
    try {
      setButtonLoading(true);
      await fetchData(`/api/logs/unlock/${type}/${sesiId}/${fieldName}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      setIsSubmitted(false);
      setLocalLocked(false);
    } catch (error) {
      console.error("Error unlocking field: ", error);
      alert("Gagal mengubah status pengisian data");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleOpenModal = () => {
    if (!localLocked) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsLoading(true);
      await onSubmit();
      setIsSubmitted(true);
      setLocalLocked(true);
    } catch (error) {
      console.error("Error while submitting:", error);
    } finally {
      setIsLoading(false);
      handleCloseModal();
      router.refresh();
    }
  };

  const handleUnlock = async () => {
    await resetState();
  };

  const renderInput = () => {
    switch (inputType) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={onChange}
            disabled={localLocked || isLoading || isSubmitted} // Tambahkan kondisi isLoading untuk menonaktifkan input
            className={`p-2 border rounded-md w-full focus:outline-none focus:ring ${
              localLocked || isLoading
                ? "bg-gray-300"
                : "bg-gray-100 focus:ring-green-300"
            }`}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={onChange}
            disabled={localLocked || isLoading || isSubmitted} // Tambahkan kondisi isLoading untuk menonaktifkan input
            className={`p-2 border rounded-md w-full focus:outline-none focus:ring ${
              localLocked || isLoading
                ? "bg-gray-300"
                : "bg-gray-100 focus:ring-green-300"
            }`}
          />
        );
      case "dropdown":
        return (
          <select
            value={value}
            onChange={onChange}
            disabled={localLocked || isLoading || isSubmitted} // Tambahkan kondisi isLoading untuk menonaktifkan input
            className={`p-2 border rounded-md w-full focus:outline-none ${
              localLocked || isLoading
                ? "bg-gray-300"
                : "bg-gray-100 focus:ring focus:ring-green-300"
            }`}
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
      <tr className={`border-b hover:bg-gray-50 transition`}>
        <td className="px-4 py-2 border border-gray-200 rounded-l-md">
          <div className="relative group">
            <div className="flex items-center">
              {label}
              <AiOutlineInfoCircle className="ml-2 text-green-500" />
            </div>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {capt || label}
            </span>
          </div>
        </td>
        <td className="px-4 py-2 border border-gray-200">{renderInput()}</td>
        <td
          className={`px-4 py-2 border border-gray-200 text-center ${
            localLocked ? "bg-gray-100 opacity-50" : ""
          }`}
        >
          {localLocked ? (
            <div className="flex justify-center w-full">
              <AiFillCheckCircle className="text-green-500 text-center rounded-full text-3xl" />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenModal}
              disabled={isLoading || isSubmitted} // Tambahkan isLoading agar tombol simpan tidak bisa diklik selama proses
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
                <div className="flex flex-col gap-2 justify-center items-center">
                  <AiFillExclamationCircle className="animate-pulse text-red-500" />
                  <span className="text-sm text-red-400">Simpan</span>
                </div>
              )}
            </button>
          )}
        </td>
        {isAdmin && (
          <td
            className={`px-4 py-2 border border-gray-200 text-center rounded-r-md ${
              localLocked ? "opacity-100 bg-blue-50" : "opacity-50 bg-gray-200"
            }`}
          >
            <div className="relative group">
              <button
                type="button"
                onClick={handleUnlock}
                disabled={!localLocked || buttonLoading}
                className={`p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
                  buttonLoading ? "cursor-not-allowed" : ""
                }`}
              >
                {buttonLoading ? (
                  <AiOutlineLoading className="animate-spin" />
                ) : (
                  <AiOutlineUnlock className="text-2xl" />
                )}
              </button>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-50 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Unlock
              </span>
            </div>
          </td>
        )}
      </tr>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
