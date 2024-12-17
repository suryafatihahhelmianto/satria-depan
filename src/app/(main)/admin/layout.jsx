"use client";

import { useUser } from "@/context/UserContext"; // Import your UserContext
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { role, loading } = useUser(); // Access role and loading state from UserContext
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "ADMIN") {
      // Redirect non-admin users to a different page
      router.push("/");
    }
  }, [role, loading, router]);

  if (loading) {
    // Show a loading state until the user role is determined
    return <p>Loading...</p>;
  }

  if (role !== "ADMIN") {
    // Optionally render nothing or a fallback message while redirecting
    return null;
  }

  return <div>{children}</div>; // Render children for admin users
}
