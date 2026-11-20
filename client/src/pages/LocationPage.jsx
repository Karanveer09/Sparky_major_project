import React, { useState } from "react";
import GoogleMapComponent from "@/components/GoogleMap";

export default function LocationPage() {
  const [userLocation, setUserLocation] = useState(null);

  const handleLocationDetected = (loc) => {
    setUserLocation(loc);
    localStorage.setItem("userLocation", JSON.stringify(loc));
  };

  return (
    <div className="p-6 space-y-4 min-h-screen bg-[#FFF7F3]">
      <h1 className="text-2xl font-bold">Your Location</h1>
      <GoogleMapComponent onLocationDetected={handleLocationDetected} />
      {userLocation && (
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p><b>Latitude:</b> {userLocation.lat}</p>
          <p><b>Longitude:</b> {userLocation.lng}</p>
        </div>
      )}
    </div>
  );
}

