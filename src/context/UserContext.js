"use client";

import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Global state for user
  const [loading, setLoading] = useState(true);

  // Fetch user data on provider mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchData("/api/userinfo", {
          headers: { Authorization: `Bearer ${getCookie("token")}` },
        });
        const data = await response;
        setUser(data); // Set user data in global state
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
