"use client";

import SkeletonCardBig from "@/components/common/SkeletonCardBig";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import React, { useEffect, useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const PengaturanPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [usernameLama, setUsernameLama] = useState("");
  const [usernameBaru, setUsernameBaru] = useState("");
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [loadingUsername, setLoadingUsername] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleUbahUsername = async (e) => {
    e.preventDefault();
    setLoadingUsername(true);

    if (!usernameBaru.trim()) {
      alert("Username baru tidak boleh kosong!");
      return;
    }

    try {
      const token = getCookie("token");

      const response = await fetchData("/api/users/change-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername: usernameBaru }),
      });

      if (response.error) {
        alert(`Error: ${response.error}`);
        return;
      }

      alert("Username berhasil diubah!");
      setUsernameBaru(""); // Reset input field
      fetchUserData(); // Refresh user data
    } catch (error) {
      console.error("Error updating username", error);
      alert("Terjadi kesalahan saat mengubah username");
    } finally {
      setLoadingUsername(false);
    }
  };

  const handleUbahPassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);

    if (
      !passwordLama.trim() ||
      !passwordBaru.trim() ||
      !konfirmasiPassword.trim()
    ) {
      alert("Semua field harus diisi!");
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      const token = getCookie("token");

      const response = await fetchData("/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordLama,
          newPassword: passwordBaru,
        }),
      });

      if (response.error) {
        alert(`Error: ${response.error}`);
        return;
      }

      alert("Password berhasil diubah!");
      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiPassword(""); // Reset all input fields
    } catch (error) {
      console.error("Error updating password", error);
      alert("Terjadi kesalahan saat mengubah password");
    } finally {
      setLoadingPassword(false);
    }
  };

  const fetchUserData = async () => {
    const cookie = getCookie("token");
    try {
      const response = await fetchData("/api/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie}`, // Ambil token dari localStorage
        },
      });
      setUser(response);

      console.log("ini response user: ", response);
    } catch (error) {
      console.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div>
        <SkeletonCardBig />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center">
      <div className="flex flex-col items-center p-8">
        <p className="flex mb-4 p-4 bg-red-500 text-white rounded-lg animate-pulse shadow-lg">
          <AiOutlineWarning className="text-2xl mr-3" />
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
              value={user?.username}
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
              className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded hover:bg-green-800 ${
                loadingUsername ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loadingUsername}
            >
              {loadingUsername ? "Mengubah..." : "Ubah Username"}
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
                {showPasswordNew ? (
                  <AiOutlineEyeInvisible className="text-2xl" />
                ) : (
                  <AiOutlineEye className="text-2xl" />
                )}
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
                className="absolute right-3 top-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowPasswordNew(!showPasswordNew)}
              >
                {showPasswordNew ? (
                  <AiOutlineEyeInvisible className="text-2xl" />
                ) : (
                  <AiOutlineEye className="text-2xl" />
                )}
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
                {showPasswordNew ? (
                  <AiOutlineEyeInvisible className="text-2xl" />
                ) : (
                  <AiOutlineEye className="text-2xl" />
                )}
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Password minimal 8 karakter (kombinasi huruf besar dan kecil,
              karakter #*/&^~)
            </p>

            <button
              type="submit"
              className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded hover:bg-green-800 ${
                loadingPassword ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loadingPassword}
            >
              {loadingPassword ? "Mengubah..." : "Ubah Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PengaturanPage;
