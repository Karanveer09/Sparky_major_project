import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ServicesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/beauty", { replace: true });
  }, [navigate]);

  return null;
}

