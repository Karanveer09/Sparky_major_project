import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function GoogleMapComponent({ onLocationDetected }) {
  const [location, setLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(loc);
        onLocationDetected?.(loc);
      },
      () => {}
    );
  }, [onLocationDetected]);

  if (!isLoaded) return <p className="p-4 text-center text-sm text-gray-500">Loading Map...</p>;
  if (!location) return <p className="p-4 text-center text-sm text-gray-500">Detecting location...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
      <Marker position={location} />
    </GoogleMap>
  );
}

