"use client";

import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { useEffect, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs"; // Icon for user avatar

export default function BiodataPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const cookie = getCookie("token");
    try {
      const response = await fetchData("/api/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie}`, // Ambil token dari localStorage
        },
      });
      setUser(response);
      console.log("ini respons: ", response);
    } catch (error) {
      console.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>No user data available</p>;
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Header section */}
        <div className="flex items-start">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gray-200 flex justify-center items-center rounded-lg">
            <BsFillPersonFill className="text-6xl text-gray-500" />
          </div>

          {/* User info */}
          <div className="ml-6 flex-1">
            <h1 className="text-2xl font-bold text-white bg-green-500 px-4 py-2 rounded-md inline-block">
              {user.name}
            </h1>

            <div className="flex mt-4">
              {/* Job Title */}
              <div className="mr-6">
                <h2 className="text-sm font-semibold text-gray-600">Jabatan</h2>
                <p className="bg-gray-200 px-4 py-2 rounded-md">{user.level}</p>
              </div>

              {/* Factory */}
              <div>
                <h2 className="text-sm font-semibold text-gray-600">Pabrik</h2>
                <p className="bg-gray-200 px-4 py-2 rounded-md">Pabrik A</p>
              </div>
            </div>

            {/* Email */}
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-600">Email</h2>
              <p className="bg-gray-200 px-4 py-2 rounded-md">
                brucewayne23@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Factory Address */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-600">Alamat Pabrik</h2>
          <p className="bg-gray-200 px-4 py-4 rounded-md">
            Jalan Sukarja, Desa Sukamamur, Kecamatan Sidareja, Las Vegas
          </p>
        </div>
      </div>
    </div>
  );
}
