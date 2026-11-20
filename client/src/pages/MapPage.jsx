import React from "react";
import UserMap from "@/components/UserMap";

export default function MapPage() {
  return (
    <div className="p-6 min-h-screen bg-[#FFF7F3]">
      <h1 className="text-2xl font-bold mb-4">Select Your Location</h1>
      <UserMap setAddress={(addr) => console.log("Selected:", addr)} />
    </div>
  );
}

