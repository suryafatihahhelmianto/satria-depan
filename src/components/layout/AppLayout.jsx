"use client";

import { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`transition-all duration-300 w-full p-8 ${
          isSidebarOpen ? "md:ml-[300px]" : "md:ml-[100px]"
        } md:mt-24`}
      >
        {children}
      </div>
    </div>
  );
}
