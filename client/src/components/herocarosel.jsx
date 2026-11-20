import React, { useState, useEffect, useRef } from "react";
import { Search, Mic, ChevronDown, User, Loader2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATIC_SERVICES = [
  { title: "Manicure", price: 499, image: "/images/mpm.jpg", link: "/beauty" },
  { title: "Pedicure", price: 599, image: "/images/mpm.jpg", link: "/beauty" },
  { title: "Facial", price: 999, image: "/images/goldfacial.webp", link: "/beauty" },
  { title: "Waxing", price: 699, image: "/images/wm.jpg", link: "/beauty" },
  { title: "Cleaning", price: 799, image: "/images/cleanup.png", link: "/clean" },
  { title: "Geyser Repair", price: 499, image: "/images/massage.jpeg", link: "/services" },
];

const CATEGORIES = [
  { name: "All", icon: "🧺" },
  { name: "Winter", icon: "❄️" },
  { name: "Electronics", icon: "🎧" },
  { name: "Beauty", icon: "💄" },
  { name: "Decor", icon: "🏠" },
];

export default function HeroCarousel() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const filtered = STATIC_SERVICES.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
    setOpen(true);
    setLoading(false);
  }, [query]);

  return (
    <div className="md:hidden w-full min-h-screen bg-white flex flex-col font-sans">
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-tight">Sparky in</span>
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-black italic">15 minutes</h1>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 mt-0.5">
              <span className="uppercase">HOME</span>
              <span className="text-gray-300">-</span>
              <span className="truncate max-w-[150px]">Amritsar City Center</span>
              <ChevronDown size={14} className="text-gray-800" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <User size={20} />
            </div>
          </div>
        </div>

        <div ref={searchRef} className="relative z-50">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" size={18} />
            ) : (
              <Search className="text-gray-400" size={18} />
            )}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search "Deep Cleaning"...'
              className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] placeholder-gray-400 font-medium"
            />
            <Mic className="text-gray-400" size={18} />
          </div>

          {open && results.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xl">
              {results.map((s) => (
                <div
                  key={s.title}
                  onClick={() => navigate(s.link)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer"
                >
                  <img src={s.image} className="w-10 h-10 rounded-lg object-cover" alt={s.title} />
                  <p className="flex-1 text-sm font-bold">{s.title}</p>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <nav className="flex items-center gap-6 overflow-x-auto px-5 py-4 no-scrollbar">
        {CATEGORIES.map((cat, idx) => (
          <div key={cat.name} className="flex flex-col items-center min-w-fit gap-1">
            <div className={`text-2xl h-10 w-10 flex items-center justify-center ${idx === 0 ? "border-b-2 border-black" : ""}`}>
              {cat.icon}
            </div>
            <span className={`text-[11px] font-bold ${idx === 0 ? "text-black" : "text-gray-400"}`}>{cat.name}</span>
          </div>
        ))}
      </nav>

      <main className="flex-1 bg-[#f3f4f6]/50 p-4 space-y-4">
        <section className="pt-2">
          <h2 className="text-lg font-black tracking-tight mb-4">Bestsellers</h2>
          <div className="grid grid-cols-3 gap-3 pb-8">
            {STATIC_SERVICES.slice(0, 3).map((s) => (
              <div
                key={s.title}
                onClick={() => navigate(s.link)}
                className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col items-center cursor-pointer"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{s.title}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

