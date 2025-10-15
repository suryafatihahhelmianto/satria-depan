"use client";

import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchData("/api/userinfo", {
          headers: { Authorization: `Bearer ${getCookie("token")}` },
        });

        if (response.error === "Token expired") {
          router.push("/login");
          return;
        }

        const data = await response;
        setUser(data);
        setRole(data.level);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]); // ✅ fix: add router dependency

  const isAdmin = role === "ADMIN";

  return (
    <UserContext.Provider value={{ user, setUser, role, isAdmin, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
