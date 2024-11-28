"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  BsFillPersonFill,
  BsFillGearFill,
  BsBoxArrowRight,
} from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { GiSugarCane } from "react-icons/gi";
import { useUser } from "@/context/UserContext";

export default function Navbar({ isSidebarOpen, toggleSidebar }) {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 w-full border-b z-50 p-6 bg-green-50 justify-between items-center hidden lg:flex transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "lg:flex lg:ml-[300px]" : "lg:ml-0 w-full"
      }`}
      style={{
        width: isSidebarOpen ? "calc(100% - 300px)" : "calc(100% - 100px)",
        marginLeft: isSidebarOpen ? "300px" : "100px",
        transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
      }}
    >
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="self-end p-2 mb-4 bg-white border rounded-lg hover:bg-green-100 transition-colors duration-200"
        >
          <AiOutlineMenu size={24} className="text-green-700" />
        </button>
      </div>

      <div className="relative ml-auto" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex gap-2 items-center justify-center hover:bg-green-200 p-2 rounded-md transition-colors duration-200"
        >
          <span className="rounded-full border text-green-600 text-4xl p-1 hover:bg-green-100">
            <BsFillPersonFill />
          </span>
          <h1 className="text-green-800">{user?.name}</h1>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-10">
            <Link
              href="/biodata"
              className="flex px-4 py-2 text-green-800 hover:bg-green-100 items-center transition-colors duration-200"
            >
              <BsFillPersonFill className="mr-2" /> Biodata
            </Link>
            <hr className="border-green-200" />
            <Link
              href="/pengaturan"
              className="flex px-4 py-2 text-green-800 hover:bg-green-100 items-center transition-colors duration-200"
            >
              <BsFillGearFill className="mr-2" /> Pengaturan
            </Link>
            <hr className="border-green-200" />
            <button
              onClick={() => {
                document.cookie =
                  "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/landing";
              }}
              className="flex w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 items-center transition-colors duration-200"
            >
              <BsBoxArrowRight className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
