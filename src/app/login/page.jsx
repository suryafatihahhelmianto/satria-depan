"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { AiOutlineUser, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/tools/api";
import Router from "next/router";
import ISO from "@/components/Iso";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const [flip, setFlip] = useState(false);

  // 🔁 Auto spin tiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setFlip((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => setFlip((prev) => !prev);

  const [shine, setShine] = useState(false);
  const [showThumb, setShowThumb] = useState(false);

  // State untuk loading dengan progress bar - DISEDERHANAKAN
  const [loadingText, setLoadingText] = useState("Menyiapkan sistem...");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingIntervalRef = useRef(null);

  // Hanya 3-4 pesan loading yang bergantian secara acak
  const loadingMessages = [
    "🔍 Memverifikasi kredensial...",
    "🧠 Mengakses sistem analitik...",
    "🌾 Menghubungkan ke database tebu...",
    "⚡ Memuat dashboard utama...",
    "🔐 Membuat sesi pengguna...",
    "📊 Menyiapkan data kinerja...",
  ];

  useEffect(() => {
    if (loading) {
      // Mulai dari 10%
      setLoadingProgress(10);

      // Simulasi progress yang lebih realistis (lambat di awal, cepat di akhir)
      loadingIntervalRef.current = setInterval(() => {
        setLoadingProgress((prev) => {
          // Algorithm: semakin tinggi progress, semakin lambat naiknya
          let increment;
          if (prev < 30) increment = 1; // Lambat di awal
          else if (prev < 60) increment = 2; // Sedang
          else if (prev < 85) increment = 3; // Cepat
          else increment = 0.5; // Sangat lambat di akhir (mendekati 100%)

          const newProgress = Math.min(prev + increment, 95); // Hingga 95%

          // Jika sudah 95%, berhenti (nanti akan langsung ke 100% saat API sukses)
          if (newProgress >= 95) {
            clearInterval(loadingIntervalRef.current);
            return 95;
          }

          return newProgress;
        });
      }, 300);

      // Ganti pesan loading secara periodik
      const messageInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setLoadingText(loadingMessages[randomIndex]);
      }, 1500);

      return () => {
        clearInterval(loadingIntervalRef.current);
        clearInterval(messageInterval);
      };
    } else {
      // Reset progress ketika loading selesai
      setLoadingProgress(0);
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    }
  }, [loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShine(true);
      setTimeout(() => setShine(false), 1800); // durasi shine
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (shine) {
      setTimeout(() => {
        setShowThumb(true);
        setTimeout(() => setShowThumb(false), 1200); // jempol muncul bentar
      }, 1500); // muncul di akhir shine
    }
  }, [shine]);

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Mulai progress dari 10%
      setLoadingProgress(10);
      setLoadingText("🔍 Memverifikasi kredensial...");

      // API call dengan timeout yang realistis
      const response = await fetchData("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: { username, password },
        timeout: 10000, // 10 detik timeout
      });

      // Update progress ke 70% setelah API response
      setLoadingProgress(70);
      setLoadingText("Kredensial valid! Membuat sesi...");

      document.cookie = `token=${response.token}; path=/; max-age=86400;`;

      // Update progress ke 90%
      setLoadingProgress(90);
      setLoadingText("Login berhasil! Mengarahkan ke dashboard...");

      // Tunggu sebentar untuk menunjukkan progress 100%
      setTimeout(() => {
        setLoadingProgress(100);
        setSuccessMessage("Login Berhasil, Tunggu Sebentar Yaa...");

        // Redirect setelah progress complete
        setTimeout(() => {
          router.push("/");
        }, 800);
      }, 500);

      setUsername("");
      setPassword("");
    } catch (error) {
      setError("Login gagal. Silakan periksa username dan password Anda.");
      setLoading(false);
      setLoadingProgress(0);

      // Hapus interval jika ada
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }

      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-green-300 to-white">
      {/* === LEFT SIDE === */}
      <div className="relative w-full md:w-1/2 h-[60vh] sm:h-[65vh] md:h-auto overflow-hidden">
        <Image
          src="/img/tebumbahikmah.jpeg"
          alt="Latar tebu"
          fill
          className="object-cover opacity-50"
          priority
        />

        {/* Overlay + Text */}
        <div className="absolute inset-0 z-10 flex flex-col justify-start md:justify-center items-center text-center px-4 sm:px-6 pt-10 sm:pt-16 md:pt-0">
          {/* Logo animasi */}
          <div
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 relative mb-4 sm:mb-6 mx-auto"
            style={{ perspective: "1200px" }}
            onClick={handleClick}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-white p-2 sm:p-3 border-4 border-green-300 shadow-xl flex items-center justify-center"
              animate={{
                rotateY: flip ? 360 : 0,
                transition: { duration: 2, ease: "easeInOut" },
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Logo depan */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src="/img/logo-satria-keren.png"
                  alt="Logo SATRIA-KEREN depan"
                  fill
                  className="object-contain rounded-full"
                />
              </div>

              {/* Logo belakang */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <Image
                  src="/img/logo-satria-keren.png"
                  alt="Logo SATRIA-KEREN belakang"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Title */}
          <h1
            className={`relative mt-6 sm:mt-10 text-balance text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 sm:mb-6 inline-block overflow-visible ${
              shine ? "shine-on" : ""
            }`}
            style={{
              fontSize: "clamp(1.8rem, 5vw + 0.5rem, 5.5rem)",
              WebkitTextStrokeWidth: "clamp(2px, 0.4vw, 5px)",
              WebkitTextStrokeColor: "#1e5c2a",
              WebkitTextFillColor: "white",
              textShadow: `
            0 0 clamp(2px, 0.4vw, 6px) #1e5c2a,
            0 0 clamp(4px, 0.8vw, 10px) #1e5c2a,
            0 0 clamp(6px, 1.2vw, 14px) #1e5c2a
          `,
              color: "white",
            }}
          >
            <span className="relative inline-block">
              SATRIA–KEREN
              <span className="lux-shine"></span>
              <AnimatePresence>
                {showThumb && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, y: 10 }}
                    animate={{ scale: 1.1, opacity: 1, y: -6 }}
                    exit={{ scale: 0, opacity: 0, y: 10 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="thumb-star absolute top-3 left-[96%] sm:top-4 sm:left-[98%] transform -translate-x-1/2"
                  >
                    <FaStar className="text-yellow-300 drop-shadow-[0_0_8px_rgba(34,197,94,0.7)] text-2xl sm:text-3xl md:text-4xl rotate-[15deg]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
          </h1>

          {/* Subtitle */}
          <div className="relative mt-4 sm:mt-4 md:mt-4 rounded-2xl shadow-lg px-3 sm:px-6 md:px-6 py-4 sm:py-5 md:py-6 w-full max-w-3xl mx-auto bg-white overflow-hidden">
            <p className="relative text-gray-700 text-sm sm:text-base md:text-xl lg:text-xl font-normal text-center leading-relaxed">
              Sistem Analitik dan Teknologi Rajawali-IPB untuk Inovasi Agro:{" "}
              <br className="hidden sm:block" />
              <span className="block sm:inline">
                Pengukuran Kinerja Keberlanjutan Rantai Pasok dan Prediksi
                Rendemen Agro Industri Gula Tebu
              </span>
            </p>
          </div>

          {/* Footer */}
          <div className="md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 bg-green-600 text-white text-xs sm:text-sm text-center py-2 px-4 sm:px-6 rounded-t-none md:rounded-t-full shadow-md mt-6 md:mt-0 whitespace-nowrap max-w-full md:w-auto">
            © 2025 <span className="font-semibold">SATRIA–KEREN v2</span>. Semua
            Hak Cipta Dilindungi.
          </div>
        </div>
      </div>

      {/* === RIGHT SIDE === */}
      <div className="flex justify-center items-center w-full md:w-1/2 p-6 bg-gradient-to-b from-green-300 to-white mb-8 md:mb-0">
        {/* Card Wrapper */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-md text-center">
          {/* Header Section */}
          <div className="mb-5">
            <div className="flex flex-wrap justify-center items-center gap-4 mb-3">
              <Image
                src="/img/logoipb.png"
                alt="Logo IPB"
                width={100}
                height={100}
                className="object-contain"
              />
              <Image
                src="/img/logoidfood.png"
                alt="Logo ID Food"
                width={100}
                height={100}
                className="object-contain"
              />
              <Image
                src="/img/logorajawali.png"
                alt="Logo Rajawali"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <h2 className="text-green-700 text-base sm:text-lg font-medium">
              Selamat datang di{" "}
              <strong className="text-green-800">SATRIA–KEREN</strong>
            </h2>
          </div>

          {/* Form Login Section */}
          <div className="bg-green-700 p-6 rounded-xl shadow-lg">
            <form className="flex flex-col" onSubmit={handleLogin}>
              {/* Username */}
              <label
                htmlFor="username"
                className="text-left text-white mb-2 flex items-center gap-1"
              >
                <AiOutlineUser className="text-white text-lg" />
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:border-green-400 w-full"
              />

              {/* Password */}
              <label
                htmlFor="password"
                className="text-left text-white mb-2 flex items-center gap-1"
              >
                <RiLockPasswordLine className="text-white text-lg" />
                Password
              </label>

              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="p-2 w-full border rounded-lg focus:outline-none focus:ring focus:border-green-400 pr-12"
                />

                {/* Buka Tutup Passwrod */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="relative group p-2 text-black hover:text-green-800 transition-colors duration-200 focus:outline-none"
                  >
                    {showPassword ? (
                      <AiFillEye size={20} />
                    ) : (
                      <AiFillEyeInvisible size={20} />
                    )}
                    <span className="absolute right-0 -top-9 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100 whitespace-nowrap">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Error / Success */}
              {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
              {successMessage && (
                <p className="text-green-300 text-sm mb-2">{successMessage}</p>
              )}

              {/* Button */}
              <button
                type="submit"
                className={`bg-ijoTebu text-white py-2 px-4 rounded-lg hover:bg-green-400 transition duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <ISO className="mt-9" />
          </div>
        </div>
      </div>

      {/* === LOADING MODAL UX DENGAN PROGRESS BAR YANG LEBIH REALISTIS === */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col justify-center items-center z-50"
          >
            {/* Main Loading Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-green-900/90 to-green-800/90 p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-green-400/30"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-green-300 border-t-transparent relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/30 to-green-600/30 blur-sm"></div>
                  </div>
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Sedang masuk ke SATRIA-KEREN
                </h3>
              </div>

              {/* Dynamic Progress Bar - SIMPLE */}
              <div className="mb-6">
                {/* Progress Bar Container */}
                <div className="relative h-3 bg-green-900/50 rounded-full overflow-hidden mb-3">
                  {/* Progress Fill */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full relative"
                    initial={{ width: "0%" }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {/* Glow effect */}
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </motion.div>
                </div>

                {/* Progress Info */}
                <div className="flex justify-between items-center text-xs text-green-200 mb-4">
                  <span>Loading...</span>
                  <span className="font-bold">{loadingProgress}%</span>
                </div>
              </div>

              {/* Dynamic Loading Text */}
              <motion.div
                key={loadingText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-6"
              >
                <div className="inline-flex items-center justify-center gap-2 bg-green-800/30 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-green-300"
                    >
                      ●
                    </motion.span>
                    <span className="text-green-100 text-sm">
                      {loadingText}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Simple Status */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-green-300 text-xs bg-green-900/30 px-3 py-1 rounded">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-green-400 rounded-full"
                  />
                  <span>Harap tunggu sebentar...</span>
                </div>
              </div>
            </motion.div>

            {/* Cancel Button (optional) */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => {
                setLoading(false);
                setLoadingProgress(0);
                if (loadingIntervalRef.current) {
                  clearInterval(loadingIntervalRef.current);
                }
              }}
              className="mt-6 px-4 py-2 text-sm text-green-300 hover:text-white hover:bg-green-800/30 rounded-lg transition-colors"
            >
              Batalkan
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tambahkan style untuk animasi */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
