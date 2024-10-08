// app/layout.jsx
import OpsiDimensi from "@/components/OpsiDimensi";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <OpsiDimensi />
      <div className="mt-6">{children}</div>
    </div>
  );
};

export default Layout;
