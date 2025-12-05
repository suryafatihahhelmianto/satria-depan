import BackButton from "@/components/ButtonBack";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="w-full px-1 pt-1">
      <BackButton className="top-24 left-[320px]" />
      {children}
    </div>
  );
};

export default Layout;
