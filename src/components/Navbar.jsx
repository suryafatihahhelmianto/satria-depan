"use client";

import React, { useEffect, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 pl-[290px] w-full border-b p-6 bg-white z-0 flex md:flex-row justify-between items-start lg:items-center`}
    >
      <button className="outline outline-zinc-200 p-2 rounded hover:cursor-pointer hover:bg-zinc-100">
        <AiOutlineMenu />
      </button>

      <BsFillPersonFill />
    </div>
  );
}
