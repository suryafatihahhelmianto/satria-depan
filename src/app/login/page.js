"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/tools/api";
import Router from "next/router"; // Import Router untuk menggunakan event

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true); // Aktifkan loading saat mulai navigasi
    };

    const handleRouteChangeComplete = () => {
      setLoading(false); // Matikan loading saat navigasi selesai
    };

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);

    // Cleanup event listeners
    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah pengiriman formulir default
    setLoading(true); // Set loading ke true saat proses login dimulai

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
    } finally {
      setLoading(false); // Set loading ke false setelah proses selesai
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

          {/* Tampilkan loading spinner saat loading */}
          {loading ? (
            <div className="flex justify-center items-center mb-4">
              <div className="loader"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-ijoTebu text-white py-2 px-4 rounded-lg hover:bg-green-400 transition duration-300"
            >
              Login
            </button>
          )}
        </form>
      </div>

      {/* Loading Spinner CSS */}
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3; /* Light grey */
          border-top: 4px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
