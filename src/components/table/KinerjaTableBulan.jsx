import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";

export default function KinerjaTableBulan({ data }) {
  // Mengambil label bulan dari data yang memiliki "isSubtitle: true"
  const months = data
    .filter((item) => item.isSubtitle)
    .map((item) => item.label);

  // Mengelompokkan parameter berdasarkan bulan
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

  // Mengambil semua label parameter unik dari semua bulan
  const uniqueParameters = Array.from(
    new Set(data.filter((item) => !item.isSubtitle).map((item) => item.label))
  );

  return (
    <div className="my-6">
      <h2 className="text-red-600 font-bold mt-5">
        Kualitas Air Permukaan (L5)
      </h2>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-ijoKepalaTabel">
            <tr>
              <th className="px-4 py-2 w-1/4 border border-black">Parameter</th>
              {months.map((month, index) => (
                <th key={index} className="px-4 py-2 border border-black">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-ijoIsiTabel">
            {uniqueParameters.map((paramLabel, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                <td className="px-4 py-2 border border-black font-bold">
                  {paramLabel}
                </td>
                {months.map((month, colIndex) => {
                  const parameterData = parametersByMonth[month].find(
                    (item) => item.label === paramLabel
                  );

                  return (
                    <td
                      key={colIndex}
                      className="px-4 py-2 border border-black text-center"
                    >
                      {parameterData ? (
                        <div className="flex items-center justify-center">
                          <input
                            type={parameterData.inputType}
                            value={parameterData.value}
                            onChange={parameterData.onChange}
                            className="p-2 bg-ijoIsiTabel w-2/3 mr-2"
                          />
                          <button
                            onClick={parameterData.onSubmit}
                            className={`p-3 rounded-full text-3xl hover:text-gray-600`}
                          >
                            <AiFillCheckCircle />
                          </button>
                        </div>
                      ) : (
                        "-"
                      )}
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
