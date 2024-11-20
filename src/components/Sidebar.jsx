"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AiFillHome,
  AiOutlineBarChart,
  AiOutlineUser,
  AiOutlineMenu,
} from "react-icons/ai";
import { GoGoal } from "react-icons/go";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Home Page",
      path: "/",
      icon: <AiFillHome size={isOpen ? 20 : 60} />,
      style: "text-black text-sm",
    },
    {
      name: "Kinerja Rantai Pasok",
      path: "/kinerja",
      icon: <AiOutlineBarChart size={isOpen ? 20 : 60} />,
      style: "text-black text-sm",
    },
    {
      name: "Pengukuran Rendemen",
      path: "/rendemen",
      icon: <GoGoal size={isOpen ? 20 : 60} />,
      style: "text-black text-sm",
    },
    {
      name: "Data Pengguna",
      path: "/admin",
      icon: <AiOutlineUser size={isOpen ? 20 : 60} />,
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
    <div
      className={`fixed bg-ijoDash text-white h-screen p-6 z-50 flex flex-col shadow-xl transition-all duration-300 ${
        isOpen ? "w-[300px]" : "w-[90px]"
      }`}
    >
      {/* Sidebar Title */}
      <Link href="/" className="mb-12 flex justify-center items-center">
        <span
          className={`text-4xl font-extrabold ${isOpen ? "visible" : "hidden"}`}
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
  );
}
