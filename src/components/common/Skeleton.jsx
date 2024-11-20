import React from "react";

const Skeleton = ({ rows = 2 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-300 rounded-md animate-pulse"
        ></div>
      ))}
    </div>
  );
};

export default Skeleton;
