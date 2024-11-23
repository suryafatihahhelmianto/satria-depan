"use client";

import React, { useState } from "react";
import {
  AiFillCheckCircle,
  AiFillExclamationCircle,
  AiOutlineLoading,
  AiOutlineUnlock,
} from "react-icons/ai";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";

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
      alert(`Field ${fieldName} berhasil di-unlock.`);
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

  const handleSubmit = async (fieldName, onSubmit) => {
    setSubmitLoadingStates((prevState) => ({
      ...prevState,
      [fieldName]: true,
    }));
    try {
      await onSubmit();
    } catch (error) {
      console.error(`Error submitting field ${fieldName}:`, error);
    } finally {
      setSubmitLoadingStates((prevState) => ({
        ...prevState,
        [fieldName]: false,
      }));
    }
  };

  return (
    <div className="my-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Kualitas Air Permukaan (L5)
      </h2>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white">
          <thead className="bg-[#75B798] text-white">
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
                        {parameterData?.locked ? (
                          <div className="flex items-center gap-2">
                            <AiFillCheckCircle className="text-green-500 text-xl" />
                            {isAdmin && (
                              <button
                                onClick={() => handleUnlock(fieldName)}
                                disabled={loadingStates[fieldName]}
                                className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                {loadingStates[fieldName] ? (
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
                              handleSubmit(
                                parameterData.fieldName,
                                parameterData.onSubmit
                              )
                            }
                            disabled={
                              submitLoadingStates[parameterData.fieldName]
                            }
                            className="text-2xl text-red-400 hover:text-red-500 transition-colors"
                          >
                            {submitLoadingStates[parameterData.fieldName] ? (
                              <AiOutlineLoading className="animate-spin" />
                            ) : (
                              <AiFillExclamationCircle />
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
    </div>
  );
}
