import React, { useEffect, useState } from 'react';

export default function SaleScroller() {
  const sales = [
    '💄 Salon at Home starting ₹199',
    '💅 Manicure & Pedicure 40% OFF',
    '✨ Instant Glow Facial at ₹999',
    '❄️ AC Repair & Cleaning Deals',
    '🚿 Bathroom Deep Cleaning 50% OFF',
    '🏷️ Flat ₹200 OFF on First Booking!',
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sales.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [sales.length]);

  return (
    <div className="bg-[#2B1B2E] text-white py-2.5 overflow-hidden text-center">
      <div
        key={sales[current]}
        className="text-sm font-bold text-[#FFD9C9] animate-fade-in duration-500 tracking-wide"
      >
        {sales[current]}
      </div>
    </div>
  );
}

