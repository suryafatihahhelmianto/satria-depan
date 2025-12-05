"use client";

import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

// 🔹 Helper function — bisa kamu taruh di file terpisah nanti
function isMobile() {
  if (typeof window === "undefined") return false; // aman buat Next.js SSR
  return window.innerWidth < 768;
}

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setIsSidebarOpen(false); // auto close di mobile
      } else {
        setIsSidebarOpen(true); // auto open di desktop
      }
    };

    handleResize(); // cek awal saat mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`transition-all duration-300 w-full p-7 ${
          isSidebarOpen ? "md:ml-[300px]" : "md:ml-[100px]"
        } md:mt-16`}
      >
        {children}
      </div>
    </div>
  );
}
