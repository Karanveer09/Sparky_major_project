import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, CheckCircle2, User, AlertTriangle, Phone } from "lucide-react";
import { IoBagHandleOutline, IoClose } from "react-icons/io5";
import { BsShieldCheck } from "react-icons/bs";
import UserMap from "./UserMap";
import BottomNav from "./BottomNav";

export default function Navbar() {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("Tap To select Address");
  const [pendingLocation, setPendingLocation] = useState(null);

  const AMRITSAR_BOUNDS = [
    { lat: 31.709249, lng: 74.817049 },
    { lat: 31.666412, lng: 74.959695 },
    { lat: 31.569168, lng: 74.891628 },
    { lat: 31.626615, lng: 74.756365 },
  ];

  const isInsidePolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat, yi = polygon[i].lng;
      const xj = polygon[j].lat, yj = polygon[j].lng;
      const intersect =
        yi > point.lng !== yj > point.lng &&
        point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  const checkAmritsar = (lat, lng) => {
    if (!lat || !lng) return false;
    const inside = isInsidePolygon({ lat, lng }, AMRITSAR_BOUNDS);
    setOutOfBounds(!inside);
    return inside;
  };

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);

      if (currentY <= 60) {
        setNavVisible(true);
      } else if (currentY < lastScrollY.current - 4) {
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + 8) {
        setNavVisible(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("user_address");
    if (saved) {
      try {
        const { address, lat, lng } = JSON.parse(saved);
        if (address) setAddress(address);
        if (lat && lng) setPendingLocation({ lat, lng });
      } catch (e) {
        console.error("Invalid saved address");
      }
    }
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  const sliderItems = [
    { name: "Support", href: "/contact" },
    { name: "Terms & Conditions", href: "/t&c" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cancellation Policy", href: "/refund" },
  ];

  return (
    <>
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start">
              <button onClick={() => setShowMap(false)} className="btn-icon w-12 h-12 shadow-lg">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 w-full h-full relative">
              <UserMap
                setAddress={(addr, lat, lng) => {
                  setAddress(addr);
                  setPendingLocation({ lat, lng });
                }}
              />

              <AnimatePresence>
                {outOfBounds && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-[#030712]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200 }}
                      className="relative mb-8"
                    >
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping scale-150 opacity-20" />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 rounded-full flex items-center justify-center border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                        <AlertTriangle size={48} className="text-yellow-500" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">
                        Outside Our Zone
                      </h2>
                      <p className="text-slate-400 text-base max-w-[280px] leading-relaxed font-medium">
                        Sparky currently only serves the heart of{" "}
                        <span className="text-blue-400 font-extrabold underline decoration-blue-500/30 underline-offset-4">
                          Amritsar
                        </span>
                        .
                      </p>
                    </motion.div>

                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => setOutOfBounds(false)}
                      className="mt-12 px-12 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                      <span>Back to City</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-10 left-0 right-0 p-6 flex justify-center z-10">
              <button
                disabled={!pendingLocation}
                onClick={() => {
                  if (!pendingLocation) return;
                  const { lat, lng } = pendingLocation;
                  if (checkAmritsar(lat, lng)) {
                    localStorage.setItem(
                      "user_address",
                      JSON.stringify({ address, lat, lng })
                    );
                    setShowMap(false);
                  }
                }}
                className={`px-8 py-3.5 font-bold uppercase tracking-widest text-sm flex items-center gap-3 ${
                  outOfBounds || !pendingLocation
                    ? "bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed rounded-full"
                    : "btn-primary-pill"
                }`}
              >
                <CheckCircle2 size={20} /> Confirm Location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP NAV */}
      <nav
        style={{
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
        }}
        className={`
          hidden lg:block fixed top-0 left-0 right-0 z-50
          bg-white/95 backdrop-blur-xl border-b border-[#F1DFE8]
          transition-transform duration-300 ease-out
          ${scrolled ? "shadow-[0_12px_32px_rgba(105,43,79,0.08)]" : "shadow-[0_4px_20px_rgba(105,43,79,0.04)]"}
        `}
      >
        <div className="max-w-7xl mx-auto px-8 h-18 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-[950] tracking-tight text-[#2B1B2E] italic">
                SPARKY<span className="text-[#C2306B]">.</span>
              </span>
            </Link>

            <button
              onClick={() => setShowMap(true)}
              className="btn-secondary-pill flex items-center gap-2.5 px-4 py-2 text-left"
            >
              <div className="w-6 h-6 rounded-full bg-[#FCEAF1] text-[#C2306B] flex items-center justify-center shadow-xs">
                <MapPin size={13} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D788D]">
                  Current Location
                </span>
                <span className="text-xs font-black truncate max-w-[180px] text-[#2B1B2E]">
                  {address}
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#FFF7F3] p-1.5 rounded-full border border-[#F1DFE8]">
            <Link
              to="/"
              className={`px-5 py-2 text-xs font-bold ${
                isActive("/")
                  ? "btn-primary-pill text-white"
                  : "text-[#2B1B2E]/75 hover:text-[#C2306B] hover:bg-white/80 rounded-full transition-all duration-200"
              }`}
            >
              Home
            </Link>
            <Link
              to="/beauty"
              className={`px-5 py-2 text-xs font-bold ${
                isActive("/beauty") || pathname.startsWith("/services")
                  ? "btn-primary-pill text-white"
                  : "text-[#2B1B2E]/75 hover:text-[#C2306B] hover:bg-white/80 rounded-full transition-all duration-200"
              }`}
            >
              Services
            </Link>
            <Link
              to="/bookings"
              className={`px-5 py-2 text-xs font-bold ${
                isActive("/bookings")
                  ? "btn-primary-pill text-white"
                  : "text-[#2B1B2E]/75 hover:text-[#C2306B] hover:bg-white/80 rounded-full transition-all duration-200"
              }`}
            >
              My Bookings
            </Link>
            <Link
              to="/contact"
              className={`px-5 py-2 text-xs font-bold ${
                isActive("/contact") || isActive("/help")
                  ? "btn-primary-pill text-white"
                  : "text-[#2B1B2E]/75 hover:text-[#C2306B] hover:bg-white/80 rounded-full transition-all duration-200"
              }`}
            >
              Help & Support
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="btn-secondary-pill flex items-center gap-2.5 px-4 py-2 text-[#2B1B2E]"
            >
              <div className="relative">
                <IoBagHandleOutline size={18} className="text-[#2B1B2E]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C2306B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-extrabold text-[#2B1B2E]">Bag</span>
            </Link>

            <Link
              to={user ? "/user" : "/login"}
              className="btn-primary-pill flex items-center gap-2 px-5 py-2 text-xs"
            >
              <User size={14} />
              <span>{user ? user.name || "My Account" : "Login"}</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="hidden lg:block h-18" />

      {/* MOBILE BOTTOM NAV */}
      <BottomNav />

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-[70] p-8 border-r border-[#F1DFE8] shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 24 }}
            >
              <div className="flex justify-between items-center mb-10">
                <img src="/images/wLogo.png" alt="Logo" className="w-[120px] h-[30px] object-contain" />
                <button onClick={() => setMenuOpen(false)}>
                  <IoClose className="text-3xl text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-[#8D788D] text-xs font-bold uppercase tracking-widest">
                  Quick Links
                </p>
                {sliderItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-between items-center text-[#2B1B2E] font-medium hover:text-[#C2306B]"
                  >
                    {item.name}
                    <span className="text-[#8D788D]">→</span>
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-10 left-8 right-8 p-4 bg-[#FCEAF1] rounded-2xl border border-[#F1DFE8]">
                <div className="flex items-center gap-2 text-[#C2306B] mb-2">
                  <BsShieldCheck />
                  <span className="text-xs font-bold">Verified Professionals</span>
                </div>
                <p className="text-[10px] text-[#8D788D]">
                  All partners are background verified.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

