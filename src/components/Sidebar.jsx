"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AiFillHome,
  AiFillWarning,
  AiOutlineBarChart,
  AiOutlineUser,
} from "react-icons/ai";

export default function Sidebar() {
  const pathname = usePathname();

  // Array of navigation links with paths and icons
  const navLinks = [
    { name: "Home Page", path: "/", icon: <AiFillHome /> },
    {
      name: "Kinerja Rantai Pasok",
      path: "/kinerja",
      icon: <AiOutlineBarChart />,
    },
    { name: "Pengukuran Rendemen", path: "/rendemen", icon: <AiFillWarning /> },
    { name: "Data Pengguna", path: "/pengguna", icon: <AiOutlineUser /> },
  ];

  // Function to add 'active' styling based on the current route
  const getLinkStyle = (path) => {
    return pathname === path
      ? "bg-green-600 text-white font-semibold"
      : "text-black hover:bg-green-200 hover:text-black";
  };

  return (
    <div className="fixed bg-ijoDash text-black w-[300px] h-screen p-5 flex flex-col gap-6 shadow-lg">
      {/* Sidebar Title */}
      <Link href="/" className="text-3xl font-bold text-center mb-10">
        Dashboard
      </Link>

      {/* Navigation Links */}
      <nav>
        <ul className="flex flex-col gap-1">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.path}
                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${getLinkStyle(
                  link.path
                )}`}
              >
                {link.icon} {/* Icon here */}
                {link.name} {/* Link name */}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
