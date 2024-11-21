"use client";

import SkeletonCardBig from "@/components/common/SkeletonCardBig";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import Link from "next/link";
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

      console.log("ini response user: ", response);
    } catch (error) {
      console.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("ini userr brow: ", user);
  }, [user]);

  if (loading) return <SkeletonCardBig />;

  if (!user) return <p>No user data available</p>;

  return (
    <div className="p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-green-100 p-8 flex flex-col items-center justify-center">
            {/* <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-green-500 shadow-xl mb-4">
              <Image
                src="/placeholder.svg"
                alt="Profile Picture"
                width={192}
                height={192}
                className="object-cover"
              />
            </div> */}
            <h2 className="text-2xl font-bold text-green-800">{user.name}</h2>
            <p className="text-sm text-green-600">{user.level}</p>
            <div className="mt-6 flex gap-4">
              <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </button>
              <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </button>
              <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="md:w-2/3 p-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Biodata
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-green-600">Position</p>
                <p className="font-medium">{user.level}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Factory</p>
                <p className="font-medium">
                  {user?.dataUser?.pabrikGula?.namaPabrik || "Pabrik Admin"}
                </p>
              </div>
              {/* <div>
                <p className="text-sm text-green-600">Email</p>
                <p className="font-medium">brucewayne23@gmail.com</p>
              </div> */}
              <div>
                <p className="text-sm text-green-600">Phone</p>
                <p className="font-medium">{user.dataUser?.nomorHp}</p>
              </div>
            </div>
            <Link href={"/pengaturan"}>
              <button className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
