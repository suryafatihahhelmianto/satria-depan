"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import SkeletonCardBig from "@/components/common/SkeletonCardBig";
import { motion } from "framer-motion";
import { FaBuilding, FaPhoneAlt, FaUserTie } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import Image from "next/image";

export default function BiodataPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animate, setAnimate] = useState(false);

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

  if (loading) return <SkeletonCardBig />;
  if (!user) return <p>No user data available</p>;

  const flipVariants = {
    flipped: { rotateY: 180 },
    unflipped: { rotateY: 0 },
  };

  const avatarVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.2, 1], transition: { duration: 0.5 } },
  };

  const lineVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  const handleAvatarClick = () => {
    setAnimate(true);
  };

  const confettiStyles = Array.from({ length: 50 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    transform: `scale(${Math.random()})`,
    opacity: Math.random(),
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden">
      <motion.div
        className="relative w-full max-w-4xl h-[600px] perspective"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="absolute w-full h-full transform-style-3d"
          variants={flipVariants}
          animate={isFlipped ? "flipped" : "unflipped"}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* FRONT SIDE */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-white/50 to-white/10 backdrop-blur-lg border border-gray-300 shadow-lg rounded-2xl flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <motion.div
              className="relative"
              onClick={handleAvatarClick}
              variants={avatarVariants}
              animate={animate ? "animate" : "initial"}
              onAnimationComplete={() => setAnimate(false)}
            >
              <BsPersonCircle className="text-green-600 text-8xl mb-4 cursor-pointer" />
            </motion.div>
            <h2 className="text-3xl font-bold text-green-800">{user.name}</h2>
            <p className="text-lg text-gray-600">{user.level}</p>
            <div className="mt-10 space-y-6 w-full">
              <div className="flex items-center p-5 bg-white/30 rounded-lg shadow hover:shadow-lg transition">
                <FaUserTie className="text-green-500 text-2xl mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Posisi</p>
                  <p className="text-lg font-medium text-gray-800">
                    {user.level}
                  </p>
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
            <div className="mt-10 w-full">
              <Link href={"/pengaturan"}>
                <button className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-6 rounded-full shadow-lg hover:opacity-90 transition">
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>

          {/* BACK SIDE */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 shadow-lg rounded-2xl flex items-center justify-center p-8"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image
                src="/img/logo-satria-keren.png"
                alt="Logo"
                width={400}
                height={400}
              />
              <div className="mt-8 text-center">
                <p className="text-gray-700">
                  Thank you for being a part of our community!
                </p>
                <p className="text-gray-700 mt-2">
                  Flip the card to view your profile information.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
