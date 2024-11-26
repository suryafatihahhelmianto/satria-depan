"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import SkeletonCardBig from "@/components/common/SkeletonCardBig";
import { FaBuilding, FaPhoneAlt, FaUserTie } from "react-icons/fa"; // React Icons for details
import { BsPersonCircle } from "react-icons/bs"; // React Icon for avatar

export default function BiodataPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
      <div className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-10 w-full max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <BsPersonCircle className="text-green-600 text-7xl mb-4" />
          <h2 className="text-3xl font-bold text-green-800">{user.name}</h2>
          <p className="text-lg text-gray-600">{user.level}</p>
        </div>

        {/* User Info Section */}
        <div className="mt-10 space-y-6">
          {/* Position */}
          <div className="flex items-center p-5 bg-white/20 rounded-lg shadow hover:shadow-lg transition">
            <FaUserTie className="text-green-500 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Posisi</p>
              <p className="text-lg font-medium text-gray-800">{user.level}</p>
            </div>
          </div>

          {/* Factory Name */}
          <div className="flex items-center p-5 bg-white/20 rounded-lg shadow hover:shadow-lg transition">
            <FaBuilding className="text-green-500 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Nama Pabrik</p>
              <p className="text-lg font-medium text-gray-800">
                {user?.dataUser?.pabrikGula?.namaPabrik || "Pabrik Admin"}
              </p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-center p-5 bg-white/20 rounded-lg shadow hover:shadow-lg transition">
            <FaPhoneAlt className="text-green-500 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Nomor HP</p>
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
    </div>
  );
}
