import React, { useEffect, useState } from "react";

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0d1117] z-[9999]">
      <div className="flex flex-col items-center relative">
        <img
          src="/images/logo.jpg"
          alt="Sparky"
          className="w-[200px] h-[80px] object-contain"
        />
        <div className="relative w-[160px] h-[4px] mt-2 bg-gray-700 rounded">
          <div className="absolute left-0 top-0 h-full bg-[#C2306B] rounded animate-loaderLine"></div>
        </div>
      </div>
    </div>
  );
}

