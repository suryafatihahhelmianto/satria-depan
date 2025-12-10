"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCertificate,
  FaDownload,
  FaStar,
  FaCalendarAlt,
  FaCheckCircle,
  FaGlobeAmericas,
  FaLeaf,
  FaSeedling,
  FaIndustry,
} from "react-icons/fa";
import { SiAdobeacrobatreader } from "react-icons/si";
import { TbCertificate } from "react-icons/tb";
import { GiSugarCane } from "react-icons/gi";
import { MdEco } from "react-icons/md";
import SkeletonCardBig from "@/components/common/SkeletonCardBig";
import Bek from "@/components/ButtonBack";

export default function SertifikatPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  const certificates = [
    {
      id: "iso29110",
      title: "ISO/IEC 29110-1-1:2024",
      subtitle: "Systems and Software Engineering",
      description:
        "Sertifikasi sistem dan rekayasa perangkat lunak untuk pengukuran kinerja keberlanjutan rantai pasok dan prediksi rendemen agroindustri gula tebu.",
      fileName:
        "ISOIEC 29110-1-12024 - Fakultas Teknologi Pertanian, Institut Pertanian Bogor.pdf",
      filePath: "/iso/iso29110.pdf",
      certNumber: "17900",
      issueDate: "27/11/2025",
      expiryDate: "27/11/2026",
      recertDate: "26/11/2028",
      accreditation: "USAC - United States Accreditation Council",
      icon: FaCertificate,
      color: "from-teal-600 to-emerald-500",
      borderColor: "border-teal-300/30",
      glowColor: "shadow-emerald-500/20",
      features: [
        "Sistem rekayasa perangkat lunak",
        "Pengukuran keberlanjutan",
        "Manajemen rantai pasok",
      ],
    },
    {
      id: "iso25002",
      title: "ISO/IEC 25002:2024",
      subtitle: "Quality Requirements and Evaluation",
      description:
        "Model kualitas dan evaluasi untuk sistem perangkat lunak dalam mengukur kinerja keberlanjutan dan prediksi hasil agroindustri gula tebu.",
      fileName:
        "ISO 25002 - Fakultas Teknologi Pertanian, Institut Pertanian Bogor.pdf",
      filePath: "/iso/iso25002.pdf",
      certNumber: "17899",
      issueDate: "27/11/2025",
      expiryDate: "26/11/2026",
      recertDate: "26/11/2028",
      accreditation: "USAC - United States Accreditation Council",
      icon: TbCertificate,
      color: "from-green-600 to-lime-500",
      borderColor: "border-green-300/30",
      glowColor: "shadow-lime-500/20",
      features: [
        "Model kualitas perangkat lunak",
        "Evaluasi kinerja sistem",
        "Standar internasional",
      ],
    },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return <SkeletonCardBig />;

  const handlePreview = (certId) => {
    setSelectedCert(certId);
    const cert = certificates.find((c) => c.id === certId);
    if (cert) {
      window.open(cert.filePath, "_blank");
    }
  };

  const handleDownload = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-12 px-4 relative overflow-hidden">
      {/* Sugar Cane Pattern Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(30)].map((_, i) => (
          <GiSugarCane
            key={i}
            className="absolute text-emerald-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
      <Bek className="left-[100px] opacity-45 hover:opacity-100" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-emerald-200/20 to-teal-200/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Sugar Cane Theme */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl mb-6 border border-emerald-200/30">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl text-center font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Sertifikasi Internasional
              </h1>
              <p className="text-lg text-center text-emerald-600 mt-2">
                SATRIA-KEREN - Agroindustri Gula Tebu Berkelanjutan
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 rounded-full">
              <MdEco className="text-emerald-600" />
              <span className="text-emerald-700 font-medium">
                Berkelanjutan
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-teal-100 rounded-full">
              <FaLeaf className="text-teal-600" />
              <span className="text-teal-700 font-medium">
                Ramah Lingkungan
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full">
              <FaIndustry className="text-green-600" />
              <span className="text-green-700 font-medium">Agroindustri</span>
            </div>
          </div>
        </motion.div>

        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-white/90 to-emerald-50/90 backdrop-blur-sm border border-emerald-200/30 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-4">
              <FaSeedling className="text-4xl text-emerald-500 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-emerald-800 mb-3">
                  Tentang Sertifikasi SATRIA-KEREN
                </h2>
                <p className="text-gray-700 mb-4">
                  Sertifikasi internasional ini mengakui keunggulan sistem
                  perangkat lunak
                  <span className="font-semibold text-emerald-700">
                    {" "}
                    SATRIA-KEREN
                  </span>{" "}
                  dalam mengukur kinerja keberlanjutan rantai pasok dan
                  memprediksi rendemen agroindustri gula tebu.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-3xl font-bold text-emerald-600">
                      ISO/IEC
                    </div>
                    <div className="text-sm text-emerald-700">
                      Standar Internasional
                    </div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-xl">
                    <div className="text-3xl font-bold text-teal-600">2025</div>
                    <div className="text-sm text-teal-700">Versi 2.0</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-3xl font-bold text-green-600">
                      USAC
                    </div>
                    <div className="text-sm text-green-700">
                      Akreditasi Amerika
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificates Grid - More Balanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 ${cert.glowColor} blur-2xl opacity-0 hover:opacity-50 transition-opacity duration-500 rounded-3xl`}
              />

              {/* Certificate Card */}
              <div
                className={`relative bg-gradient-to-br from-white/95 to-white/70 backdrop-blur-md border ${cert.borderColor} rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col`}
              >
                {/* Ribbon  */}
                <div className="absolute top-0 right-0 overflow-hidden w-28 h-28">
                  <div
                    className={`absolute bg-gradient-to-r ${cert.color} text-white 
                    px-4 py-1 font-bold text-[11px] tracking-wide
                    transform rotate-45 
                    top-6 -right-10 w-44 text-center
                    shadow-lg border-y border-white/40`}
                  >
                    TERAKREDITASI
                  </div>
                </div>

                {/* Header with Icon */}
                <div className={`bg-gradient-to-r ${cert.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <cert.icon className="text-white text-3xl" />
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {cert.title}
                        </h3>
                        <p className="text-white/90 text-sm">{cert.subtitle}</p>
                      </div>
                    </div>
                    <FaStar className="text-amber-300 text-2xl" />
                  </div>
                </div>

                {/* Content - More Balanced */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-6 flex-grow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                        <GiSugarCane className="text-emerald-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-emerald-800">
                          SATRIA-KEREN Project
                        </h4>
                        <p className="text-emerald-600 text-sm">
                          Agroindustri Gula Tebu
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {cert.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-500 mb-3">
                        FITUR UTAMA:
                      </h5>
                      <div className="space-y-2">
                        {cert.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Certificate Details - More Compact */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/60 rounded-lg p-4 border border-emerald-100">
                        <div className="text-xs text-gray-500 mb-1">
                          No. Sertifikat
                        </div>
                        <div className="font-bold text-gray-800">
                          {cert.certNumber}
                        </div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-4 border border-emerald-100">
                        <div className="text-xs text-gray-500 mb-1">Status</div>
                        <div className="font-bold text-emerald-600 flex items-center">
                          <FaCheckCircle className="mr-2" />
                          Aktif
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/60 rounded-lg p-4 border border-emerald-100">
                        <div className="flex items-center text-gray-500 mb-1">
                          <FaCalendarAlt className="text-sm mr-2" />
                          <span className="text-xs">Diterbitkan</span>
                        </div>
                        <div className="font-semibold text-gray-800">
                          {cert.issueDate}
                        </div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-4 border border-emerald-100">
                        <div className="flex items-center text-gray-500 mb-1">
                          <FaCalendarAlt className="text-sm mr-2" />
                          <span className="text-xs">Berlaku hingga</span>
                        </div>
                        <div className="font-semibold text-gray-800">
                          {cert.expiryDate}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                      <div className="flex items-center text-gray-500 mb-1">
                        <FaGlobeAmericas className="text-sm mr-2" />
                        <span className="text-xs">Lembaga Akreditasi</span>
                      </div>
                      <div className="font-semibold text-emerald-800">
                        {cert.accreditation}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePreview(cert.id)}
                      className={`flex-1 bg-gradient-to-r ${cert.color} text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300`}
                    >
                      <SiAdobeacrobatreader className="text-lg" />
                      <span>Lihat Sertifikat</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        handleDownload(cert.filePath, cert.fileName)
                      }
                      className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300"
                    >
                      <FaDownload className="text-sm" />
                      <span className="text-sm">Unduh</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-white/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-8 border border-emerald-200/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  3
                </div>
                <div className="text-sm text-emerald-700 font-semibold">
                  Tahun Masa Berlaku
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">IPB</div>
                <div className="text-sm text-teal-700 font-semibold">
                  Institut Pertanian Bogor
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  100%
                </div>
                <div className="text-sm text-green-700 font-semibold">
                  Kesesuaian Standar
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-emerald-200">
              <p className="text-center text-gray-600">
                <span className="font-semibold text-emerald-700">
                  SATRIA-KEREN
                </span>{" "}
                - Software Pengukuran Kinerja Keberlanjutan Rantai Pasok dan
                Prediksi Rendemen Agroindustri Gula Tebu
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confetti Celebration */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background:
                    i % 3 === 0
                      ? "linear-gradient(135deg, #10b981, #34d399)"
                      : i % 3 === 1
                      ? "linear-gradient(135deg, #059669, #0d9488)"
                      : "linear-gradient(135deg, #047857, #0f766e)",
                }}
                initial={{
                  x: "50vw",
                  y: "50vh",
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1, 0],
                  opacity: [1, 0.5, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.2,
                  delay: Math.random() * 0.3,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
