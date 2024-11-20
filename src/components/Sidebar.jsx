"use client";

import React, { useState, useEffect } from "react";
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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navLinks = [
    {
      name: "Home Page",
      path: "/",
      icon: <AiFillHome size={isOpen ? 20 : 30} />,
      style: "text-black text-sm",
    },
    {
      name: "Kinerja Rantai Pasok",
      path: "/kinerja",
      icon: <AiOutlineBarChart size={isOpen ? 20 : 30} />,
      style: "text-black text-sm",
    },
    {
      name: "Pengukuran Rendemen",
      path: "/rendemen",
      icon: <GoGoal size={isOpen ? 20 : 30} />,
      style: "text-black text-sm",
    },
    {
      name: "Data Pengguna",
      path: "/admin",
      icon: <AiOutlineUser size={isOpen ? 20 : 30} />,
      style: "text-black text-sm",
    },
    // {
    //   name: "Testing",
    //   path: "/testing",
    // },
  ];

  const getLinkStyle = (path) => {
    return pathname === path
      ? "bg-green-600 text-white font-semibold"
      : pathname.startsWith(path) && path !== "/"
      ? "bg-green-600 text-white font-semibold"
      : "text-gray-700 hover:bg-green-200 hover:text-gray-900";
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-green-600 text-white p-2 rounded-md"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed bg-ijoDash text-white h-screen p-6 z-40 flex flex-col shadow-xl transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isMobile ? "w-full md:w-[300px]" : isOpen ? "w-[300px]" : "w-[90px]"
        }`}
      >
        {/* Sidebar Title */}
        <Link href="/" className="mb-12 flex justify-center items-center">
          <span
            className={`text-4xl font-extrabold ${
              isOpen ? "visible" : "hidden"
            }`}
          >
            <span className="text-green-700">Satria</span>
            <span className="text-white">Keren</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-grow">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.path}
                  className={`flex items-center gap-4 py-3 px-4 rounded-lg text-lg transition-colors duration-300 ${getLinkStyle(
                    link.path
                  )} ${link.style}`}
                >
                  {/* Icon always visible */}
                  {link.icon}
                  {/* Hide link name when collapsed */}
                  {isOpen && <span>{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer text */}
        <footer className="mt-4 text-center text-l text-green-800">
          © Satria-Keren 2024
        </footer>
      </div>
    </>
  );
}
