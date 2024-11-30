"use client";

import Link from "next/link";
import { BarChart2, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "react-icons/fa";

export default function LandingPage() {
  // Variants untuk animasi
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3 } },
  };

  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlip((prevFlip) => !prevFlip);
    }, 5000);

    // Membersihkan interval ketika komponen unmount
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setFlip((prevFlip) => !prevFlip);
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <motion.section
        className="relative w-full bg-gradient-to-b from-green-300 to-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto flex flex-col items-center justify-center text-center py-20 px-6 space-y-8">
          {/* Floating Logo */}
          <motion.div
            className="relative w-40 h-40 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
            initial={{ scale: 0 }}
            animate={{
              scale: 1, // Efek scale
              rotateY: flip ? 360 : 0, // Efek flip 360 derajat
              transition: { duration: 2, ease: "easeInOut" }, // Mengatur durasi dan transisi flip
            }}
            onClick={handleClick} // Menambahkan event klik
            style={{
              transformStyle: "preserve-3d", // Untuk menjaga elemen flip 3D
            }}
          >
            <Image
              src="/img/logo-satria-keren.png"
              alt="logo-satria-keren"
              width={500}
              height={500}
              className="rounded-full"
            />
          </motion.div>

          {/* Main Text */}
          <motion.h1
            className="text-green-800 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
          >
            SATRIA-KEREN
          </motion.h1>
          <motion.div
            className="space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}
          >
            <p className="text-lg sm:text-xl max-w-2xl font-medium drop-shadow-md">
              Sistem Analitik dan Teknologi Rajawali-IPB untuk Inovasi Agro
            </p>
            <p className="text-md sm:text-lg max-w-2xl font-medium drop-shadow-md">
              Pengukuran Kinerja Keberlanjutan Rantai Pasok dan Prediksi
              Rendemen
            </p>
          </motion.div>

          {/* Button */}
          <motion.div>
            <Link href="/login">
              <button className="mt-6 px-10 py-4 bg-white text-green-600 text-lg font-semibold rounded-full shadow-lg hover:bg-green-50 hover:scale-105 transition-transform duration-300">
                Masuk ke Sistem
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <motion.div
          className="container mx-auto px-6 md:px-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-12 text-green-700">
            Fitur Utama
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <motion.div
              className="group bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              variants={featureVariants}
            >
              <div className="p-6 flex flex-col items-center text-center group-hover:scale-105">
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-4 transition-transform duration-300">
                  <BarChart2 className="h-8 w-8" />
                  <h3 className="text-xl font-semibold">
                    Analisis Kinerja Keberlanjutan Rantai Pasok
                  </h3>
                </div>
                <p className="text-gray-600">
                  Evaluasi komprehensif keberlanjutan rantai pasok agro dengan
                  metrik terukur. Identifikasi area peningkatan dan optimalkan
                  efisiensi operasional untuk keberlanjutan jangka panjang.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="group bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2  transition-all duration-300"
              variants={featureVariants}
            >
              <div className="p-6 flex flex-col items-center text-center group-hover:scale-105">
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-4 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8" />
                  <h3 className="text-xl font-semibold">
                    Analisis Prediksi Rendemen
                  </h3>
                </div>
                <p className="text-gray-600">
                  Manfaatkan analitik prediktif untuk memperkirakan hasil panen
                  dengan akurasi tinggi. Optimalkan perencanaan produksi dan
                  keputusan berbasis data yang andal.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-white py-8 text-center text-green-800 border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.3 } }}
      >
        <p className="text-sm">
          © 2024 SATRIA-KEREN. Semua Hak Cipta Dilindungi.
        </p>
      </motion.footer>
    </div>
  );
}
