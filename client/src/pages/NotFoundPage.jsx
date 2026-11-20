import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FFF7F3] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black text-[#C2306B] mb-2">404</h1>
      <h2 className="text-2xl font-bold text-[#2B1B2E] mb-4">Page Not Found</h2>
      <p className="text-sm text-[#8D788D] max-w-sm mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn-primary px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  );
}

