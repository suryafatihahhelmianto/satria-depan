"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link"; // Import Link from Next.js for navigation
import {
  BsFillPersonFill,
  BsFillGearFill,
  BsBoxArrowRight,
} from "react-icons/bs"; // Add more icons as needed

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Detect if the component is mounted to avoid hydration error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown when clicking outside of it
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
    <div className="fixed top-0 w-full border-b z-50 p-6 bg-white flex justify-between items-center">
      {/* Other Navbar Content */}

      {/* User Profile Button (aligned to the right) */}
      <div className="relative ml-auto" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="rounded-full border text-gray-500 text-4xl p-1 hover:bg-gray-200"
        >
          <BsFillPersonFill />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-10">
            {/* Biodata Link */}
            <Link
              href="/biodata"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
            >
              <BsFillPersonFill className="mr-2" /> Biodata
            </Link>

            <hr />

            {/* Pengaturan Link */}
            <Link
              href="/pengaturan"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
            >
              <BsFillGearFill className="mr-2" /> Pengaturan
            </Link>

            <hr />

            {/* Logout Button */}
            <button
              onClick={() => {
                document.cookie =
                  "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/login";
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center"
            >
              <BsBoxArrowRight className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
