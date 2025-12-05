"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AiFillHome,
  AiOutlineBarChart,
  AiOutlineUser,
  AiOutlineMenu,
  AiOutlineClose,
  AiFillDashboard,
  AiFillCalculator,
  AiOutlineMobile,
} from "react-icons/ai";
import { AiOutlineBook } from "react-icons/ai";
import { ArrowLeft } from "lucide-react";

import { GoGoal } from "react-icons/go";
import { BsBoxArrowRight, BsGearFill, BsPersonFill } from "react-icons/bs";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { isAdmin, role } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const pathname = usePathname();

  // Deteksi mode mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Notice muncul setiap sidebar dibuka di mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      setShowNotice(true);
    }
  }, [isMobile, isOpen]);

  const navLinks = [
    !isMobile && {
      name: "Beranda",
      path: "/",
      icon: <AiFillHome size={20} />,
    },
    isMobile && {
      name: "Kinerja Keberlanjutan Rantai Pasok",
      path: "/",
      icon: <AiFillDashboard size={20} />,
    },
    !isMobile &&
      role !== "DIREKSI" && {
        name: "Kinerja",
        path: "/kinerja",
        icon: <AiOutlineBarChart size={20} />,
      },
    !isMobile &&
      (role === "QUALITYCONTROL" || isAdmin) && {
        name: "Prediksi Rendemen",
        path: "/rendemen",
        icon: <GoGoal size={20} />,
      },
    {
      name: "Kalkulator Prediksi Rendemen",
      path: "/kalkulator",
      icon: <AiFillCalculator size={20} />,
    },
    !isMobile &&
      isAdmin && {
        name: "Pengguna",
        path: "/admin",
        icon: <AiOutlineUser size={20} />,
      },
    {
      name: "Quick Manual",
      path: "/manual",
      icon: <AiOutlineBook size={20} />,
    },
  ].filter(Boolean);

  const getLinkStyle = (path) =>
    pathname === path
      ? "bg-green-600 text-white font-semibold"
      : pathname.startsWith(path) && path !== "/"
      ? "bg-green-600 text-white font-semibold"
      : "text-gray-700 hover:bg-green-200 hover:text-gray-900";

  const handleLinkClick = () => {
    if (isMobile) toggleSidebar();
  };

  return (
    <>
      {/* Tombol toggle sidebar (mobile) */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-md"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      )}

      {/* Sidebar utama */}
      <div
        className={`fixed bg-ijoDash text-white py-8 px-4 h-screen z-40 flex flex-col justify-between shadow-xl transition-all duration-300 ${
          isMobile
            ? isOpen
              ? "translate-x-0 w-full"
              : "-translate-x-full w-full"
            : isOpen
            ? "w-[300px]"
            : "w-[100px]"
        }`}
      >
        {!["/", "/executive-dashboard"].includes(pathname) && (
          <button
            onClick={() => history.back()}
            className={`
              group absolute top-24 z-[9999] p-2 rounded-full bg-white border 
              border-green-300 shadow-lg
              transition duration-300 ease-in-out
              opacity-20 scale-90 
              hover:opacity-100 hover:scale-100 
              active:scale-95
              ${isOpen ? "left-[320px]" : "left-[120px]"}
            `}
          >
            <ArrowLeft className="w-5 h-5 text-green-600" />

            {/* Tooltip */}
            <span
              className="
                absolute left-1/2 top-full mt-2 -translate-x-1/2
                bg-black text-white text-xs px-2 py-1 rounded 
                opacity-0 group-hover:opacity-100 transition
                whitespace-nowrap pointer-events-none
              "
            >
              Back
            </span>
          </button>
        )}

        {/* Bagian atas: logo + menu */}
        <div>
          {/* Logo */}
          <Link href="/" className="mb-12 flex justify-center items-center">
            {isOpen ? (
              <div className="flex flex-col items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-16 h-16 rounded-full bg-white animate-spin-slow"></div>
                  <Image
                    src={"/img/logo-satria-keren.png"}
                    alt="logo-satria-keren"
                    width={50}
                    height={50}
                    className="relative"
                  />
                </div>
                <span className="mt-3 text-4xl font-extrabold text-center">
                  <span className="text-green-700">Satria</span>
                  <span className="text-white">Keren</span>
                </span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-white border-4 border-white animate-spin-slow"></div>
                <span className="relative z-10">
                  <Image
                    src={"/img/logo-satria-keren.png"}
                    alt="logo-satria-keren"
                    width={50}
                    height={50}
                  />
                </span>
              </div>
            )}
          </Link>

          {/* Navigasi utama */}
          <nav className="flex-grow">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className={`flex items-center ${
                      isOpen ? "gap-4 py-3 px-4" : "justify-center py-3 px-2"
                    } rounded-lg text-lg transition-colors duration-300 ${getLinkStyle(
                      link.path
                    )}`}
                    onClick={handleLinkClick}
                  >
                    {link.icon}
                    {isOpen && <span>{link.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Menu tambahan mobile */}
            {isMobile && (
              <ul className="mt-16 py-2 flex flex-col">
                <li>
                  <Link
                    href="/biodata"
                    className="flex gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 items-center"
                    onClick={handleLinkClick}
                  >
                    <BsPersonFill className="mr-2" /> Biodata
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pengaturan"
                    className="flex gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 items-center"
                    onClick={handleLinkClick}
                  >
                    <BsGearFill className="mr-2" /> Pengaturan
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      document.cookie =
                        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      window.location.href = "/landing";
                    }}
                    className="flex gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 items-center"
                  >
                    <BsBoxArrowRight className="mr-2" /> Logout
                  </button>
                </li>
              </ul>
            )}
          </nav>
        </div>

        {/* Bagian bawah: notice + footer */}
        <div>
          {isMobile && showNotice && (
            <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-900 rounded-xl px-5 py-4 shadow-lg text-left mb-4 animate-fadeIn animate-pulse-slow">
              <p className="text-base font-semibold flex items-center gap-2">
                <AiOutlineMobile
                  size={20}
                  className="text-yellow-600 animate-bounce-slow"
                />
                <span>
                  📱 <b>Layar kecil terdeteksi</b>
                </span>
              </p>
              <p className="text-sm mt-2 leading-snug">
                Beberapa fitur mungkin tidak tersedia. Gunakan perangkat dengan{" "}
                <b>layar lebih besar</b> untuk pengalaman penuh.
              </p>
            </div>
          )}

          <footer className="text-center text-sm text-green-800 mt-2">
            © Satria-Keren v2 2025
          </footer>
        </div>
      </div>
    </>
  );
}
