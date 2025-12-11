"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = ({ className = "" }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`
        group
        fixed z-[9999]
        p-2 rounded-full bg-white border border-green-300 
        shadow-lg hover:bg-green-50 active:scale-95 transition
        ${className}
      `}
    >
      <ArrowLeft className="w-5 h-5 text-green-600" />
      <span
        className="absolute inset-0 
                            bg-gradient-to-r from-transparent via-green-500 to-transparent 
                            opacity-0 
                            group-hover:opacity-100 
                            translate-x-[-200%] 
                            group-hover:translate-x-[200%] 
                            transition-all duration-1000 ease-in-out"
      ></span>

      {/* Tooltip */}
      <span
        className="
          absolute left-1/2 top-full mt-2 
          -translate-x-1/2
          bg-black text-white text-xs 
          px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 
          transition
          whitespace-nowrap
          pointer-events-none
        "
      >
        Back
      </span>
    </button>
  );
};

export default BackButton;
