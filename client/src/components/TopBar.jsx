import React from 'react';

export default function TopBar({ username }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-[#F1DFE8]">
      <h2 className="text-lg font-bold text-[#2B1B2E]">Sparky Account</h2>
      <span className="text-sm font-semibold text-[#8D788D]">👤 {username || "Guest"}</span>
    </div>
  );
}

