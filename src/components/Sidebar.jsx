"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AiFillHome,
  AiFillWarning,
  AiOutlineBarChart,
  AiOutlineUser,
  AiOutlineMenu, // Icon for the collapse button
} from "react-icons/ai";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  // const [isCollapsed, setIsCollapsed] = useState(false); // State to control collapse

  // Toggle collapse state
  // const toggleSidebar = () => {
  //   setIsCollapsed(!isCollapsed);
  // };

  // Array of navigation links with paths and icons
  const navLinks = [
    { name: "Home Page", path: "/", icon: <AiFillHome /> },
    {
      name: "Kinerja Rantai Pasok",
      path: "/kinerja",
      icon: <AiOutlineBarChart />,
    },
    { name: "Pengukuran Rendemen", path: "/rendemen", icon: <AiFillWarning /> },
    { name: "Data Pengguna", path: "/admin", icon: <AiOutlineUser /> },
  ];

  // Function to add 'active' styling based on the current route
  const getLinkStyle = (path) => {
    if (path === "/") {
      // Check if the pathname is exactly "/"
      return pathname === path
        ? "bg-green-600 text-white font-semibold"
        : "text-black hover:bg-green-200 hover:text-black";
    } else {
      // For other links, use startsWith
      return pathname.startsWith(path)
        ? "bg-green-600 text-white font-semibold"
        : "text-black hover:bg-green-200 hover:text-black";
    }
  };

  return (
    <div
      className={`fixed bg-ijoDash text-black h-screen p-5 z-50 flex flex-col gap-6 shadow-lg transition-all duration-300 ${
        !isOpen ? "w-[100px]" : "w-[300px]"
      }`}
    >
      {/* Collapse button */}
      {/* <button onClick={toggleSidebar} className="text-white self-end p-2 mb-4">
        <AiOutlineMenu size={24} />
      </button> */}

      {/* Sidebar Title (Hide when collapsed) */}
      {isOpen && (
        <Link href="/" className="text-3xl font-bold text-center mb-10">
          Dashboard
        </Link>
      )}

      {/* Navigation Links */}
      <nav>
        <ul className="flex flex-col gap-1">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.path}
                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 ${getLinkStyle(
                  link.path
                )}`}
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
    </div>
  );
}
