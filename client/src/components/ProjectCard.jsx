import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ title, status, href }) {
  return (
    <Link to={href || "#"} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow transition block">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[#C2306B] font-bold text-sm">{status}</span>
        <span className="text-xl">→</span>
      </div>
    </Link>
  );
}

