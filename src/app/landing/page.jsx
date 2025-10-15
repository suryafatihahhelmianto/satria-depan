"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, TrendingUp } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function LandingPage() {
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
      }, 1500); // muncul di akhir shinee
    }
  }, [shine]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-gradient-to-b from-green-300 to-white md:gap-0">
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
          {/* Logo */}
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

          <>
            {/* Title */}
            <h1
              className={`relative mt-6 sm:mt-10 text-balance text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 sm:mb-6 inline-block overflow-visible ${
                shine ? "shine-on" : ""
              }`}
              style={{
                // clamp font-size for better scaling across breakpoints
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
              <p className="relative text-gray-700 text-sm sm:text-base md:text-xl lg:text-xl font-normal text-center leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-snug">
                Sistem Analitik dan Teknologi Rajawali-IPB untuk Inovasi Agro:{" "}
                <br className="hidden sm:block" />
                <span className="block sm:inline">
                  Pengukuran Kinerja Keberlanjutan Rantai Pasok dan Prediksi
                  Rendemen Agro Industri Gula Tebu
                </span>
              </p>
            </div>
          </>
          {/*Meng Futer*/}
          <div className="md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 bg-green-600 text-white text-xs sm:text-sm text-center py-2 px-4 sm:px-6 rounded-t-none md:rounded-t-full shadow-md mt-6 md:mt-0 whitespace-nowrap max-w-full md:w-auto">
            © 2025 <span className="font-semibold">SATRIA–KEREN v2</span>. Semua
            Hak Cipta Dilindungi.
          </div>
        </div>
      </div>

      {/* === RIGHT SIDE === */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full md:w-1/2 flex flex-col justify-start md:justify-center items-center px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-b from-green-300 to-white"
      >
        <h2 className="text-green-800 text-4xl sm:text-5xl md:text-6xl font-bold mb-8 sm:mb-12 text-center text-balance">
          Fitur Utama
        </h2>

        <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 px-0 sm:px-2">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl border-2 border-green-400 p-4 sm:p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
              <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mt-1" />
              <h3 className="text-base sm:text-lg font-semibold text-green-700">
                Analisis Kinerja Keberlanjutan Rantai Pasok
              </h3>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-center">
              Evaluasi komprehensif keberlanjutan rantai pasok agro dengan
              metrik terukur. Identifikasi area peningkatan dan optimalkan
              efisiensi operasional untuk keberlanjutan jangka panjang.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl border-2 border-green-400 p-4 sm:p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mt-1" />
              <h3 className="text-base sm:text-lg font-semibold text-green-700">
                Analisis Prediksi Rendemen
              </h3>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-center">
              Memanfaatkan analitik prediktif untuk memperkirakan rendemen gula
              tebu dengan akurasi tinggi. Mengoptimalkan perencanaan produksi
              dan keputusan berbasis data yang andal.
            </p>
          </div>
        </div>

        <Link href="/login" className="mt-8 sm:mt-10">
          <button className="relative px-7 sm:px-10 py-3 font-bold text-white rounded-full bg-gradient-to-r from-emerald-500 to-green-700 shadow-lg overflow-hidden group transition-all duration-500 hover:scale-105">
            <span className="relative z-10 text-sm sm:text-base">
              MASUK KE SISTEM
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000 ease-in-out"></span>
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-4 group-hover:ring-green-200 transition-all duration-500"></div>
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
