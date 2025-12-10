"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ISOBadgeMini() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const router = useRouter();

  const handleBadgeClick = (e) => {
    // Mencegah bubble click ke parent
    e.stopPropagation();

    // Navigasi ke halaman sertifikat
    router.push("/sertifikat");
  };

  const handleMouseInteraction = (action) => {
    if (action === "enter") {
      setIsHover(true);
      setIsFlipped(true);
    } else if (action === "leave") {
      setIsHover(false);
      setTimeout(() => setIsFlipped(false), 300);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="
          group relative w-44 h-16
          [perspective:600px] cursor-pointer
        "
        onClick={handleBadgeClick}
        onMouseEnter={() => handleMouseInteraction("enter")}
        onMouseLeave={() => handleMouseInteraction("leave")}
      >
        {/* Glassmorphism Card */}
        <div
          className="
            absolute inset-0 
            bg-gradient-to-br from-white/30 to-white/15
            backdrop-blur-md
            rounded-xl
            border border-white/40
            shadow-[0_2px_12px_rgba(0,0,0,0.08)]
            hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]
            transition-shadow duration-300
          "
        />

        {/* Card Container */}
        <div
          className={`
            relative w-full h-full
            transition-transform duration-300 ease-out
            ${isFlipped ? "[transform:rotateY(180deg)]" : ""}
          `}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side - Super Compact */}
          <div
            className="
              absolute inset-0 
              flex items-center justify-between px-3
              rounded-xl
              group-hover:scale-[1.02]
              transition-transform duration-200
            "
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Certified Text */}
            <div className="flex-shrink-0">
              <p className="text-[11px] font-semibold text-gray-800 leading-tight">
                Certified
              </p>
              <p className="text-[9px] text-gray-600">by</p>
              <div className="mt-0.5">
                <span className="text-[8px] text-blue-600 font-medium px-1.5 py-0.5 bg-blue-50 rounded">
                  Click to view
                </span>
              </div>
            </div>

            {/* Logos */}
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9">
                <Image
                  src="/img/logouasc.png"
                  alt="USAC"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-[10px] text-gray-500 font-bold">+</div>
              <div className="relative w-9 h-9">
                <Image
                  src="/img/logoaqsr.png"
                  alt="AQSR"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Back Side - ISO Details (Improved) */}
          <div
            className="
              absolute inset-0 
              rounded-xl 
              bg-gradient-to-br from-white/35 to-white/20
              backdrop-blur-md
              border border-white/40
              flex flex-col items-center justify-center
              px-2 py-1
              group-hover:scale-[1.02]
              transition-transform duration-200
            "
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Title with Click Indicator */}
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-gray-800 uppercase tracking-wide">
                Certified For
              </span>
            </div>

            {/* ISO Standards */}
            <div className="flex flex-col gap-0.5 w-full">
              <div className="flex items-center justify-between bg-blue-50/70 rounded px-2 py-1 hover:bg-blue-100/70 transition-colors">
                <span className="text-[9px] font-semibold text-blue-900">
                  ISO 29110
                </span>
                <span className="text-[8px] text-blue-700">Software Eng.</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50/70 rounded px-2 py-1 hover:bg-emerald-100/70 transition-colors">
                <span className="text-[9px] font-semibold text-emerald-900">
                  ISO 25002
                </span>
                <span className="text-[8px] text-emerald-700">
                  Quality Req.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Glow */}
        <div
          className={`
            absolute -inset-0.5 rounded-xl
            bg-gradient-to-r from-blue-400/20 via-transparent to-emerald-400/20
            opacity-0 transition-opacity duration-200
            ${isHover ? "opacity-100" : ""}
            group-hover:opacity-100
          `}
        />

        {/* Click Animation Ring */}
        <div
          className={`
            absolute -inset-1 rounded-xl
            border-2 border-transparent
            transition-all duration-300
            ${isHover ? "border-blue-300/30" : ""}
          `}
        />
      </div>

      {/* Tooltip for additional info */}
      {isHover && (
        <div
          className="
            absolute bottom-full right-0 mb-2
            w-56 p-2
            bg-white/95 backdrop-blur-sm
            rounded-lg border border-gray-200
            shadow-lg
            animate-fadeIn
          "
        >
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">✓</span>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-800 mb-0.5">
                International Quality Standards
              </h4>
              <p className="text-[10px] text-gray-600 leading-tight">
                Certified by USAC & AQSR for Software Engineering (ISO 29110)
                and Quality Requirements (ISO 25002) standards.
              </p>
              <div className="mt-1 pt-1 border-t border-gray-100">
                <p className="text-[9px] text-blue-600 font-medium">
                  Just click to view full certificates
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
