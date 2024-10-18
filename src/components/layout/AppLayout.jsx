"use client";

// AppLayout.jsx
import dynamic from "next/dynamic";

// Dynamically import Sidebar without SSR
const Sidebar = dynamic(() => import("../Sidebar"), { ssr: false });

export default function AppLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="min-h-screen bg-gray-100 px-4 pl-[320px] mt-5 w-full">
        <div className="mt-20">{children}</div>
      </div>
    </div>
  );
}
