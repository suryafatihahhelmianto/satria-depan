"use client";

import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Global state for user
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(""); // Store the user's role

  const router = useRouter();

  // Fetch user data on provider mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchData("/api/userinfo", {
          headers: { Authorization: `Bearer ${getCookie("token")}` },
        });

        if (response.error === "Token expired") {
          router.push("/login"); // Redirect to login
          return; // Exit the function
        }

        const data = await response;
        setUser(data); // Set user data in global state
        setRole(data.level);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once

  const isAdmin = role === "ADMIN";

  return (
    <UserContext.Provider value={{ user, setUser, role, isAdmin, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
