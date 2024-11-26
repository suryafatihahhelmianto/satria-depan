"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import SkeletonCardBig from "@/components/common/SkeletonCardBig";
import { motion } from "framer-motion";
import { FaBuilding, FaPhoneAlt, FaUserTie } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

export default function BiodataPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false); // State to control animation

  const fetchUserData = async () => {
    const cookie = getCookie("token");
    try {
      const response = await fetchData("/api/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });
      setUser(response);
    } catch (error) {
      console.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAvatarClick = () => {
    if (!animate) {
      setAnimate(true);
    }
  };

  if (loading) return <SkeletonCardBig />;
  if (!user) return <p>No user data available</p>;

  // Animation Variants
  const avatarVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.6, 1],
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [1, 0], // Fade out at the end
      scale: 1.5,
      rotate: 360,
      transition: {
        duration: 1, // Match duration with reset
        ease: "easeOut",
      },
    },
  };

  const confettiStyles = [...Array(30)].map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 0.5}s`,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden">
      <div className="bg-gradient-to-br from-white/50 to-white/10 backdrop-blur-lg border border-gray-300 shadow-2xl rounded-2xl p-8 w-full max-w-4xl relative">
        {/* Confetti */}
        {animate &&
          confettiStyles.map((style, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
              style={{
                ...style,
                animation: "confetti 1.5s ease-out forwards",
              }}
            ></div>
          ))}

        {/* Header Section */}
        <div className="flex flex-col items-center text-center relative">
          <motion.div
            className="relative"
            onClick={handleAvatarClick}
            variants={avatarVariants}
            animate={animate ? "animate" : "initial"}
            onAnimationComplete={() => setAnimate(false)} // Reset after animation completes
          >
            <BsPersonCircle className="text-green-600 text-8xl mb-4 cursor-pointer" />
            {animate && (
              <>
                <motion.div
                  className="absolute -top-12 -left-12 w-48 h-48 rounded-full border-4 border-green-500"
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.div
                  className="absolute -top-16 -left-16 w-64 h-64 rounded-full border-4 border-blue-500 opacity-60"
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                />
              </>
            )}
          </motion.div>
          <h2 className="text-3xl font-bold text-green-800">{user.name}</h2>
          <p className="text-lg text-gray-600">{user.level}</p>
        </div>

        {/* User Info Section */}
        <div className="mt-10 space-y-6">
          <div className="flex items-center p-5 bg-white/30 rounded-lg shadow hover:shadow-lg transition">
            <FaUserTie className="text-green-500 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Posisi</p>
              <p className="text-lg font-medium text-gray-800">{user.level}</p>
            </div>
          </div>
          <div className="flex items-center p-5 bg-white/30 rounded-lg shadow hover:shadow-lg transition">
            <FaBuilding className="text-green-500 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Nama Pabrik</p>
              <p className="text-lg font-medium text-gray-800">
                {user?.dataUser?.pabrikGula?.namaPabrik || "Pabrik Admin"}
              </p>
            </div>
          </div>
          <div className="flex items-center p-5 bg-white/30 rounded-lg shadow hover:shadow-lg transition">
            <FaPhoneAlt className="text-green-500 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Nomor HP</p>
              <p className="text-lg font-medium text-gray-800">
                {user.dataUser?.nomorHp || "Not Available"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-10">
          <Link href={"/pengaturan"}>
            <button className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-6 rounded-full shadow-lg hover:opacity-90 transition">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
          }
          100% {
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
