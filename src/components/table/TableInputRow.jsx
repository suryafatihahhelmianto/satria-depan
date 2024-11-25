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
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleOpenModal = () => {
    if (!locked) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSubmit = () => {
    setIsLoading(true);
    onSubmit();
    setIsSubmitted(true);
    handleCloseModal();
    router.refresh();
  };

  const handleUnlock = async () => {
    try {
      setIsLoading(true);
      setButtonLoading(true);
      const response = await fetchData(
        `/api/logs/unlock/${type}/${sesiId}/${fieldName}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      setIsLoading(false);
      setButtonLoading(false);
      window.location.reload();
      // router.replace(router.asPath)
    } catch (error) {
      console.error("Error unlocking field: ", error);
      alert("Gagal mengubah status pengisian data");
      setIsLoading(false);
    }
  };

  const renderInput = () => {
    switch (inputType) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={onChange}
            disabled={locked}
            className={`p-2 border rounded-md w-full focus:outline-none focus:ring ${
              locked ? "bg-gray-300" : "bg-gray-100 focus:ring-green-300"
            }`}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={onChange}
            disabled={locked}
            className={`p-2 border rounded-md w-full focus:outline-none focus:ring ${
              locked ? "bg-gray-300" : "bg-gray-100 focus:ring-green-300"
            }`}
          />
        );
      case "dropdown":
        return (
          <select
            value={value}
            onChange={onChange}
            disabled={locked}
            className={`p-2 border rounded-md w-full focus:outline-none ${
              locked
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
      {/* <tr
        className={`border-b hover:bg-gray-50 transition ${
          locked ? "bg-gray-100 opacity-50" : ""
        }`}
      > */}
      <tr className={`border-b hover:bg-gray-50 transition`}>
        <td className="px-4 py-2 border border-gray-200 rounded-l-md">
          <div className="flex items-center">
            {label}
            <AiOutlineInfoCircle className="ml-2 text-green-500" />
          </div>
        </td>
        <td className="px-4 py-2 border border-gray-200">{renderInput()}</td>
        <td
          className={`px-4 py-2 border border-gray-200 text-center ${
            locked ? "bg-gray-100 opacity-50" : ""
          }`}
        >
          {locked ? (
            <div className="flex justify-center w-full">
              <AiFillCheckCircle className="text-green-500 text-center rounded-full text-3xl" />
            </div>
          ) : (
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
              locked ? "opacity-100 bg-blue-50" : "opacity-50 bg-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={handleUnlock}
              disabled={!locked}
              className={`p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
                isLoading ? "cursor-not-allowed" : ""
              }`}
            >
              {buttonLoading ? (
                <AiOutlineLoading className="animate-spin" />
              ) : (
                <AiOutlineUnlock className="text-2xl" />
              )}
            </button>
          </td>
        )}
      </tr>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
}
