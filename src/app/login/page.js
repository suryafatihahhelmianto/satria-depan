"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/tools/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah pengiriman formulir default

    try {
      const response = await fetchData("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username,
          password,
        },
      });

      document.cookie = `token=${response.token}; path=/; max-age=86400;`;

      // Tangani respons sukses
      setSuccessMessage(response.message);
      // Simpan token atau lakukan tindakan lain setelah login berhasil
      router.push("/kinerja");

      // Reset form
      setUsername("");
      setPassword("");
      setError("");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) {
      // Jika token ada, redirect ke halaman dashboard
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {/* Header Section */}
      <div className="text-center mb-5">
        <div className="flex justify-center items-center mb-3">
          <div className="mr-4">
            <Image
              src="/img/logoipb.png"
              alt="Logo IPB"
              width={150}
              height={150}
            />
          </div>
          <div>
            <Image
              src="/img/logorajawali.png"
              alt="Logo Rajawali"
              width={150}
              height={150}
            />
          </div>
        </div>
        <h2 className="text-green-600 text-lg font-medium">
          Selamat datang di{" "}
          <strong className="text-green-800">SATRIA KEREN</strong>
        </h2>
      </div>

      {/* Login Form Section */}
      <div className="bg-green-700 p-8 rounded-lg shadow-lg w-80">
        <form className="flex flex-col" onSubmit={handleLogin}>
          <label htmlFor="username" className="text-left text-white mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:border-green-400"
          />

          <label htmlFor="password" className="text-left text-white mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 mb-6 border rounded-lg focus:outline-none focus:ring focus:border-green-400"
          />

          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <button
            type="submit"
            className="bg-ijoTebu text-white py-2 px-4 rounded-lg hover:bg-green-400 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
