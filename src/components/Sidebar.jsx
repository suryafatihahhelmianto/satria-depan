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
} from "react-icons/ai";
import { GoGoal } from "react-icons/go";
import { useUser } from "@/context/UserContext";
import { BsBoxArrowRight, BsGearFill, BsPersonFill } from "react-icons/bs";
import Image from "next/image";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { isAdmin, role } = useUser();
  const [isMobile, setIsMobile] = useState(false); // Untuk deteksi perangkat
  const pathname = usePathname();

  // Handle resize untuk mendeteksi perangkat
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Jika lebar layar < 768px, dianggap mobile
    };

    handleResize(); // Deteksi ukuran layar saat pertama kali render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    {
      name: "Beranda",
      path: "/",
      icon: <AiFillHome size={20} />,
    },
    role !== "DIREKSI" && {
      name: "Kinerja",
      path: "/kinerja",
      icon: <AiOutlineBarChart size={20} />,
    },
    (role === "QUALITYCONTROL" || isAdmin) && {
      name: "Rendemen",
      path: "/rendemen",
      icon: <GoGoal size={20} />,
    },
    isAdmin && {
      name: "Pengguna",
      path: "/admin",
      icon: <AiOutlineUser size={20} />,
    },
  ].filter(Boolean);

  const getLinkStyle = (path) => {
    return pathname === path
      ? "bg-green-600 text-white font-semibold"
      : pathname.startsWith(path) && path !== "/"
      ? "bg-green-600 text-white font-semibold"
      : "text-gray-700 hover:bg-green-200 hover:text-gray-900";
  };

  // Handler untuk menutup sidebar setelah klik menu di mobile
  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar(); // Tutup sidebar setelah klik menu pada perangkat mobile
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-md"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed bg-ijoDash text-white py-8 px-4 h-screen z-40 flex flex-col shadow-xl transition-all duration-300 ${
          isMobile
            ? isOpen
              ? "translate-x-0 w-full"
              : "-translate-x-full w-full"
            : isOpen
            ? "w-[300px]"
            : "w-[100px]"
        }`}
      >
        {/* Sidebar Title */}
        <Link href="/" className="mb-12 flex justify-center items-center">
          {isOpen ? (
            <div className="flex gap-2">
              <Image
                src={"/img/logo-satria-keren.png"}
                alt="logo-satria-keren"
                width={30}
                height={30}
              />

              <span className="text-3xl font-extrabold">
                <span className="text-green-700">Satria</span>
                <span className="text-white">Keren</span>
              </span>
            </div>
          ) : (
            // <span className="text-4xl font-extrabold text-green-700">S</span>
            <span>
              <Image
                src={"/img/logo-satria-keren.png"}
                alt="logo-satria-keren"
                width={50}
                height={50}
              />
            </span>
          )}
        </Link>

        {/* Navigation Links */}
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
                  onClick={handleLinkClick} // Menambahkan handler klik
                >
                  {/* Icon always visible */}
                  {link.icon}
                  {/* Hide link name when collapsed */}
                  {isOpen && <span>{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
          {isMobile && (
            <ul className="mt-16 py-2 flex flex-col">
              <li>
                <Link
                  href="/biodata"
                  className="flex gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100  items-center"
                  onClick={handleLinkClick} // Menambahkan handler klik
                >
                  <BsPersonFill className="mr-2" /> Biodata
                </Link>
              </li>
              <li>
                <Link
                  href="/pengaturan"
                  className="flex gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100  items-center"
                  onClick={handleLinkClick} // Menambahkan handler klik
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
                  className="flex gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-100  items-center"
                  // onClick={handleLinkClick} // Menambahkan handler klik
                >
                  <BsBoxArrowRight className="mr-2" /> Logout
                </button>
              </li>
            </ul>
          )}
        </nav>

        {/* Footer Text */}
        {isOpen && !isMobile && (
          <footer className="mt-4 text-center text-l text-green-800">
            © Satria-Keren 2024
          </footer>
        )}
      </div>
    </>
  );
}
