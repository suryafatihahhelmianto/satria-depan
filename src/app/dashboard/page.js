"use client";
import { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import CSS untuk Circular Progress Bar

export default function Dashboard() {
  // State untuk mengatur dropdown apakah tabel terbuka atau tidak
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [isDropdownOpen3, setIsDropdownOpen3] = useState(false);
  const [isDropdownOpen4, setIsDropdownOpen4] = useState(false);

  // Fungsi untuk toggle dropdown Tabel 1
  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };

  // Fungsi untuk toggle dropdown Tabel 2
  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  // Fungsi untuk toggle dropdown Tabel 3
  const toggleDropdown3 = () => {
    setIsDropdownOpen3(!isDropdownOpen3);
  };

  // Fungsi untuk toggle dropdown Tabel 4
  const toggleDropdown4 = () => {
    setIsDropdownOpen4(!isDropdownOpen4);
  };

  // Data untuk progress bar
  const progressData = [
    { score: 100, color: '#4CAF50' },  // Untuk Tabel 1 - 100%
    { score: 50, color: '#FFBF00' },   // Untuk Tabel 2 - 50%
    { score: 25, color: '#FFAA00' },   // Untuk Tabel 3 - 25%
    { score: 0, color: '#FF0000' },    // Untuk Tabel 4 - 0%
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-8">
      {/* Card besar yang membungkus seluruh halaman */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-5xl">

        {/* Judul Halaman */}
        <h1 className="text-3xl font-bold mb-8">Dimensi Ekonomi</h1>

        {/* Card pertama untuk Tabel 1 - Tingkat Risiko Rantai Pasok (E1) */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
          {/* Judul Tabel dan Skor dengan Progress Bar */}
          <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={toggleDropdown1}>
            <h2 className="text-red-600 font-bold text-left">Tingkat Risiko Rantai Pasok (E1)</h2>
            <div className="flex items-center space-x-2">
              <span className="text-right text-lg font-bold text-blue-600">1.000</span>
              <div style={{ width: 50, height: 50 }}>
                <CircularProgressbar
                  value={progressData[0].score}
                  text={`${progressData[0].score}%`}
                  styles={buildStyles({
                    pathColor: progressData[0].color,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
            </div>
          </div>

          {isDropdownOpen1 && (
            <div className="mt-4">
              <table className="w-full table-auto border-collapse border border-gray-300 text-center">
                <thead className='bg-ijoKepalaTabel text-white'>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Indikator</th>
                    <th className="border border-gray-300 px-4 py-2">Batas Minimal</th>
                    <th className="border border-gray-300 px-4 py-2">Batas Maksimal</th>
                    <th className="border border-gray-300 px-4 py-2">Target</th>
                    <th className="border border-gray-300 px-4 py-2">Data Input</th>
                  </tr>
                </thead>
                <tbody className='bg-ijoIsiTabel text-white'>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Tingkat risiko rantai pasok</td>
                    <td className="border border-gray-300 px-4 py-2">Sangat Rendah</td>
                    <td className="border border-gray-300 px-4 py-2">Sangat Tinggi</td>
                    <td className="border border-gray-300 px-4 py-2">Min</td>
                    <td className="border border-gray-300 px-4 py-2">Sedang</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Card kedua untuk Tabel 2 - Potensi Kehilangan Produksi (E2) */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={toggleDropdown2}>
            <h2 className="text-red-600 font-bold text-left">Potensi Kehilangan Produksi (E2)</h2>
            <div className="flex items-center space-x-2">
              <span className="text-right text-lg font-bold text-blue-600">0.500</span>
              <div style={{ width: 50, height: 50 }}>
                <CircularProgressbar
                  value={progressData[1].score}
                  text={`${progressData[1].score}%`}
                  styles={buildStyles({
                    pathColor: progressData[1].color,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
            </div>
          </div>

          {isDropdownOpen2 && (
            <div className="mt-4">
              <table className="w-full table-auto border-collapse border border-gray-300 text-center">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Indikator</th>
                    <th className="border border-gray-300 px-4 py-2">Batas Minimal</th>
                    <th className="border border-gray-300 px-4 py-2">Batas Maksimal</th>
                    <th className="border border-gray-300 px-4 py-2">Target</th>
                    <th className="border border-gray-300 px-4 py-2">Data Input</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Pol ampas (%) (stasiun gilingan)</td>
                    <td className="border border-gray-300 px-4 py-2">0</td>
                    <td className="border border-gray-300 px-4 py-2">3</td>
                    <td className="border border-gray-300 px-4 py-2">Min</td>
                    <td className="border border-gray-300 px-4 py-2">-</td>
                  </tr>
                  {/* ... Isi tabel lain */}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Card ketiga untuk Tabel 3 - Distribusi Keuntungan yang Adil (E3) */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={toggleDropdown3}>
            <h2 className="text-red-600 font-bold text-left">Distribusi Keuntungan yang Adil (E3)</h2>
            <div className="flex items-center space-x-2">
              <span className="text-right text-lg font-bold text-blue-600">0.250</span>
              <div style={{ width: 50, height: 50 }}>
                <CircularProgressbar
                  value={progressData[2].score}
                  text={`${progressData[2].score}%`}
                  styles={buildStyles({
                    pathColor: progressData[2].color,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
            </div>
          </div>

          {isDropdownOpen3 && (
            <div className="mt-4">
              <table className="w-full table-auto border-collapse border border-gray-300 text-center">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Indikator</th>
                    <th className="border border-gray-300 px-4 py-2">Batas Minimal</th>
                    <th className="border border-gray-300 px-4 py-2">Batas Maksimal</th>
                    <th className="border border-gray-300 px-4 py-2">Target</th>
                    <th className="border border-gray-300 px-4 py-2">Data Input</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Distribusi keuntungan yang adil</td>
                    <td className="border border-gray-300 px-4 py-2">15</td>
                    <td className="border border-gray-300 px-4 py-2">30</td>
                    <td className="border border-gray-300 px-4 py-2">Min</td>
                    <td className="border border-gray-300 px-4 py-2">54.86</td>
                  </tr>
                  {/* Sub-row untuk Distribusi Keuntungan */}
                  <tr>
                    <td className="border-l border-gray-300 px-6 py-2 text-gray-500">Keuntungan Petani</td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2">68.90</td>
                  </tr>
                  <tr>
                    <td className="border-l border-gray-300 px-6 py-2 text-gray-500">Keuntungan BUMDES</td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2">31.10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Card keempat untuk Tabel 4 - Harga Patokan Petani (E4) */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={toggleDropdown4}>
            <h2 className="text-red-600 font-bold text-left">Harga Patokan Petani (E4)</h2>
            <div className="flex items-center space-x-2">
              <span className="text-right text-lg font-bold text-blue-600">0.861</span>
              <div style={{ width: 50, height: 50 }}>
                <CircularProgressbar
                  value={progressData[3].score}
                  text={`${progressData[3].score}%`}
                  styles={buildStyles({
                    pathColor: progressData[3].color,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
            </div>
          </div>

          {isDropdownOpen4 && (
            <div className="mt-4">
              <table className="w-full table-auto border-collapse border border-gray-300 text-center">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Indikator</th>
                    <th className="border border-gray-300 px-4 py-2">Batas Minimal</th>
                    <th className="border border-gray-300 px-4 py-2">Batas Maksimal</th>
                    <th className="border border-gray-300 px-4 py-2">Target</th>
                    <th className="border border-gray-300 px-4 py-2">Data Input</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Harga patokan petani</td>
                    <td className="border border-gray-300 px-4 py-2">0</td>
                    <td className="border border-gray-300 px-4 py-2">6.87</td>
                    <td className="border border-gray-300 px-4 py-2">Min</td>
                    <td className="border border-gray-300 px-4 py-2">0.95</td>
                  </tr>
                  {/* Sub-row untuk Harga Patokan Petani */}
                  <tr>
                    <td className="border-l border-gray-300 px-6 py-2 text-gray-500">Harga Acuan/Referensi</td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2">10,500</td>
                  </tr>
                  <tr>
                    <td className="border-l border-gray-300 px-6 py-2 text-gray-500">Harga Lelang</td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2">10,601</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
