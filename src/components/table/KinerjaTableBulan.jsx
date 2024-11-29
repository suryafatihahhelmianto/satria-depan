import React, { useState } from "react";
import {
  AiFillCheckCircle,
  AiFillExclamationCircle,
  AiOutlineLoading,
  AiOutlineUnlock,
} from "react-icons/ai";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";

// Add the Confirmation Modal Component here

const ConfirmationModal = ({ isOpen, onConfirm, onClose }) => {
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
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-red-400 hover:text-white transition"
          >
            Periksa Kembali
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg transition bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700`}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default function KinerjaTableBulan({ data, isAdmin, type, sesiId }) {
  const uniqueFieldNames = Array.from(
    new Set(
      data.filter((item) => !item.isSubtitle).map((item) => item.fieldName)
    )
  );

  const [loadingStates, setLoadingStates] = useState(
    uniqueFieldNames.reduce((acc, fieldName) => {
      acc[fieldName] = false;
      return acc;
    }, {})
  );

  const [submitLoadingStates, setSubmitLoadingStates] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(
    uniqueFieldNames.reduce((acc, fieldName) => {
      acc[fieldName] = false;
      return acc;
    }, {})
  );

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  const getParametersByMonth = () => {
    const groupedData = {};
    let currentMonth = null;

    data.forEach((item) => {
      if (item.isSubtitle) {
        currentMonth = item.label;
        groupedData[currentMonth] = [];
      } else if (currentMonth) {
        groupedData[currentMonth].push(item);
      }
    });

    return groupedData;
  };

  const parametersByMonth = getParametersByMonth();

  const uniqueParameters = Array.from(
    new Set(data.filter((item) => !item.isSubtitle).map((item) => item.label))
  ).map((label) => {
    const item = data.find((d) => d.label === label && !d.isSubtitle);
    return { label, fieldName: item ? item.fieldName : "" };
  });

  // Unlock handler
  const handleUnlock = async (fieldName) => {
    try {
      setLoadingStates((prevState) => ({
        ...prevState,
        [fieldName]: true,
      }));
      await fetchData(`/api/logs/unlock/${type}/${sesiId}/${fieldName}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error(`Error unlocking field ${fieldName}: `, error);
      alert(`Gagal mengubah status field ${fieldName}.`);
    } finally {
      setLoadingStates((prevState) => ({
        ...prevState,
        [fieldName]: false,
      }));
    }
  };

  // Open confirmation modal
  const openConfirmationModal = (fieldName) => {
    setSelectedField(fieldName);
    setIsModalVisible(true);
  };

  // Handle submission
  const handleSubmit = async (fieldName, onSubmit) => {
    setSubmitLoadingStates((prevState) => ({
      ...prevState,
      [fieldName]: true,
    }));

    try {
      await onSubmit();

      setIsSubmitted((prevState) => ({
        ...prevState,
        [fieldName]: true,
      }));
    } catch (error) {
      console.error(`Error submitting field ${fieldName}:`, error);
    } finally {
      setSubmitLoadingStates((prevState) => ({
        ...prevState,
        [fieldName]: false,
      }));
    }
  };

  // Confirm modal actions
  const handleConfirmSubmit = () => {
    // Proceed with the submission
    const fieldName = selectedField;
    const parameterData = data.find((item) => item.fieldName === fieldName);
    if (parameterData && parameterData.onSubmit) {
      handleSubmit(fieldName, parameterData.onSubmit);
    }
    setIsModalVisible(false);
  };

  const handleCancelSubmit = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="my-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Kualitas Air Permukaan (L5)
      </h2>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white">
          <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left border-b border-gray-200">
                Parameter
              </th>
              {Object.keys(parametersByMonth).map((month, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-center border-b border-gray-200"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueParameters.map(({ label, fieldName }, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-3 border-b border-gray-300 font-medium text-gray-700">
                  {label}
                </td>
                {Object.keys(parametersByMonth).map((month, colIndex) => {
                  const parameterData = parametersByMonth[month].find(
                    (item) => item.label === label
                  );

                  return (
                    <td
                      key={colIndex}
                      className="px-4 py-3 border-b border-gray-300 text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type={parameterData?.inputType || "number"}
                          value={parameterData?.value || ""}
                          onChange={parameterData?.onChange}
                          disabled={parameterData?.locked}
                          className="w-24 p-2 text-center rounded border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {parameterData?.locked ||
                        isSubmitted[parameterData?.fieldName] ? (
                          <div className="flex items-center gap-2">
                            <AiFillCheckCircle className="text-green-500 text-xl" />
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  handleUnlock(parameterData?.fieldName)
                                }
                                disabled={
                                  loadingStates[parameterData?.fieldName]
                                }
                                className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                {loadingStates[parameterData?.fieldName] ? (
                                  <AiOutlineLoading className="animate-spin" />
                                ) : (
                                  <AiOutlineUnlock />
                                )}
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              openConfirmationModal(parameterData.fieldName)
                            }
                            disabled={
                              submitLoadingStates[parameterData.fieldName]
                            }
                            className="text-2xl text-red-400 hover:text-red-500 transition-colors"
                          >
                            {submitLoadingStates[parameterData.fieldName] ? (
                              <AiOutlineLoading className="animate-spin" />
                            ) : (
                              <div className="flex flex-col gap-2 justify-center items-center">
                                <AiFillExclamationCircle />
                                <span className="text-sm text-red-400">
                                  Simpan
                                </span>
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalVisible}
        onConfirm={handleConfirmSubmit}
        onClose={handleCancelSubmit}
      />
    </div>
  );
}
