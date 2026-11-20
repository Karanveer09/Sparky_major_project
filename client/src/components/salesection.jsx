import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SaleSection() {
  return (
    <Link to="/beauty">
      <div className="w-full flex justify-center items-center min-h-[220px] px-4 my-6">
        <div className="relative w-full max-w-7xl h-64 overflow-hidden rounded-3xl shadow-xl bg-gradient-to-r from-[#C2306B] via-[#8E4FD6] to-[#2B1B2E] p-8 text-white flex flex-col justify-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FFD9C9]">Special Offer</span>
          <h2 className="text-2xl sm:text-4xl font-black mt-2">Up to 50% OFF on Salon Packages</h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-md">Experience professional beauty rituals delivered at home with sterile single-use kits.</p>
          <div className="mt-4">
            <span className="btn-primary-pill px-6 py-2.5 text-xs uppercase tracking-wider">Book Now</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

