// app/layout.jsx
import OpsiDimensi from "@/components/OpsiDimensi";
import Sidebar from "@/components/Sidebar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="w-full px-4 pt-4">
      <OpsiDimensi />
      {children}
    </div>
  );
};

export default Layout;
