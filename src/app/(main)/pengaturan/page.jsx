"use client";

import React, { useState } from "react";

const PengaturanPage = () => {
  const [usernameLama, setUsernameLama] = useState("byunequality");
  const [usernameBaru, setUsernameBaru] = useState("");
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleUbahUsername = (e) => {
    e.preventDefault();
    // Logika untuk ubah username
    console.log("Ubah Username", usernameBaru);
  };

  const handleUbahPassword = (e) => {
    e.preventDefault();
    if (passwordBaru === konfirmasiPassword) {
      // Logika untuk ubah password
      console.log("Ubah Password", passwordBaru);
    } else {
      alert("Password baru dan konfirmasi password tidak cocok!");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('../img/tanaman.png')` }}
    >
      <div className="flex flex-col items-center p-8">
        <p className="mb-4 text-gray-800">
          Mohon untuk menjaga kerahasiaan password dan tidak membagikan ke
          siapapun!
        </p>

        {/* Form Ganti Username */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Ganti Username</h2>
          <form onSubmit={handleUbahUsername}>
            <label className="block mb-2 font-semibold">Username Lama</label>
            <input
              type="text"
              className="w-full bg-green-200 rounded px-4 py-2 mb-4"
              value={usernameLama}
              readOnly
            />
            <label className="block mb-2 font-semibold">Username Baru</label>
            <input
              type="text"
              className="w-full bg-gray-100 rounded px-4 py-2 mb-4"
              placeholder="Masukkan username baru"
              value={usernameBaru}
              onChange={(e) => setUsernameBaru(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Ubah Username
            </button>
          </form>
        </div>

        {/* Form Ganti Password */}
        <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Ganti Password</h2>
          <form onSubmit={handleUbahPassword}>
            <label className="block mb-2 font-semibold">Password Lama</label>
            <div className="relative">
              <input
                type={showPasswordOld ? "text" : "password"}
                className="w-full bg-gray-100 rounded px-4 py-2 mb-4"
                placeholder="Masukkan password lama"
                value={passwordLama}
                onChange={(e) => setPasswordLama(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setShowPasswordOld(!showPasswordOld)}
              >
                👁️
              </button>
            </div>

            <label className="block mb-2 font-semibold">Password Baru</label>
            <div className="relative">
              <input
                type={showPasswordNew ? "text" : "password"}
                className="w-full bg-gray-100 rounded px-4 py-2 mb-4"
                placeholder="Masukkan password baru"
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setShowPasswordNew(!showPasswordNew)}
              >
                👁️
              </button>
            </div>

            <label className="block mb-2 font-semibold">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                className="w-full bg-gray-100 rounded px-4 py-2 mb-4"
                placeholder="Konfirmasi password baru"
                value={konfirmasiPassword}
                onChange={(e) => setKonfirmasiPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              >
                👁️
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Password minimal 8 karakter (kombinasi huruf besar dan kecil,
              karakter #*/&^~)
            </p>

            <button
              type="submit"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Ubah Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PengaturanPage;
