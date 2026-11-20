import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Plus,
  Wrench,
  X,
  MapPin,
  Star,
  ArrowRight,
  LayoutGrid,
  Scissors, 
  User,
  AlertTriangle,
  Palette, 
  Wind, 
  CheckCircle2,
  Waves, 
  Zap, 
  Smile, 
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  SlidersHorizontal,
  Bell
} from "lucide-react";

import FloatingOrderTracker from "@/components/FloatingOrderTracker";
import AboutSections from "@/components/AboutSections";
import UserMap from "@/components/UserMap";

/* ================= DATA ================= */

const CATEGORIES = [
  { name: "BEAUTY", icon: <Sparkles size={20} />, ref: "beautyRef" },
  { name: "Beatique", icon: <Scissors size={20} />, ref: "beatiqueRef" },
  { name: "Technical", icon: <Wrench size={20} />, ref: "techRef" },
];

const CRAZY_DEAL = {
  name: "Gold Facial",
  originalPrice: "₹1,875",
  price: 999,
  image: "/images/goldfacial.jpg",
  discount: "45% OFF",
  link: "/services/facial",
  category: "Woman Services"
};

const QUICK_SERVICES = [
  { title: "Suit Stitching", discount: "30% OFF", image: "/images/stitching.jpg", price: 1299, link: "/services/stitching" },
  { title: "AC Repair", discount: "₹200 OFF", image: "/images/crazyAc.avif", price: 499, link: "/services/ac-repair" },
  { title: "Deep Cleanup", discount: "50% OFF", image: "/images/deepc.webp", price: 799, link: "/services/cleaning" },
  { title: "Manicure", discount: "Starts ₹199", image: "/images/mpm.jpg", price: 199, link: "/services/manicure", category: "Woman Services" },
];

const BESTSELLERS = [
  { id: 1, name: "Manicure", image: "/images/mpm.jpg", count: "+120 more", price: 499, link: "/services/manicure", category: "Woman Services" },
  { id: 2, name: "Plumbing", image: "/images/plumbing.jpg", count: "+80 more", price: 299, link: "/services/plumbing" },
  { id: 3, name: "Makeup", image: "/images/makeup.jpg", count: "+150 more", price: 1499, link: "/services/makeup", category: "Woman Services" },
];

const STATIC_SERVICES = [
  { title: "Manicure", price: 499, image: "/images/mpm.jpg", link: "/services/manicure", category: "Woman Services" },
  { title: "Pedicure", price: 599, image: "/images/vee.jpg", link: "/services/pedicure", category: "Woman Services" },
  { title: "Facial", price: 999, image: "/images/vee2.jpg", link: "/services/facial", category: "Woman Services" },
  { title: "Waxing", price: 699, image: "/images/wm.jpg", link: "/services/waxing", category: "Woman Services" },
  { title: "Cleaning", price: 799, image: "/images/cleanup.jpg", link: "/services/cleaning" },
  { title: "AC Repair", price: 499, image: "/images/ac.jpg", link: "/services/ac-repair" },
];

const want = [
  { id: 1, name: 'Pedicure', icon: Scissors, image: "/images/pedicure.png" },
  { id: 2, name: 'Manicure', icon: Zap, image: "/images/manicure.png" },
  { id: 3, name: 'Facial', icon: Sparkles, image: "/images/facial.png" },
  { id: 4, name: 'Bleach', icon: Palette, image: "/images/bleach.png" },
  { id: 5, name: 'Cleanup', icon: Waves, image: "/images/cleanup.png" },
  { id: 6, name: 'Waxing', icon: Wind, image: "/images/waxing.png" },
  { id: 7, name: 'Makeup', icon: Smile, image: "/images/makeup.png" },
  { id: 8, name: 'Hair', icon: MessageCircle, image: "/images/hair.png" },
];

const promoData = {
  "Waxing": { 
    title: "3 Step Korean Wax Ritual", 
    tag: "Full Arms, Full Legs & Underarms", 
    img: "/images/waxing.png", 
    price: "799",
    layout: "elegant-minimal"
  },
  "Facial": { 
    title: "Instant Glow Facial", 
    tag: "Premium Herbal Range", 
    img: "/images/fruitfacial.webp", 
    price: "1299",
    layout: "soft-gradient" 
  },
  "Mehandi": { 
    title: "Bridal Mehandi Artist", 
    tag: "Traditional & Modern Designs", 
    img: "/images/mehandi.jpg", 
    price: "499",
    layout: "bold-split" 
  },
  "Makeup": { 
    title: "Party Makeup Look", 
    tag: "Professional MUA Choice", 
    img: "/images/makeup.png", 
    price: "1599",
    layout: "elegant-minimal" 
  },
  "Haircare": { 
    title: "Saga Hair Spa", 
    tag: "Deep Root Nourishment", 
    img: "/images/hair.jpg", 
    price: "899",
    layout: "floating-circle" 
  },
  "Bleach": { 
    title: "Oxy Glow Bleach", 
    tag: "Even Skin Tone", 
    img: "/images/bleach.png", 
    price: "299",
    layout: "soft-gradient" 
  }
};

export default function HomePage() {
  const beautyRef = useRef(null);
  const beatiqueRef = useRef(null);
  const techRef = useRef(null);
  const searchRef = useRef(null);
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [address, setAddress] = useState("Tap To Select Address");
  const navigate = useNavigate();
  const [orders, setorders] = useState([]);
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selected, setSelected] = useState(null);
  const [minCartError, setMinCartError] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const AMRITSAR_BOUNDS = [
    { lat: 31.670068, lng: 74.862815 },
    { lat: 31.657253, lng: 74.919065 },
    { lat: 31.596597, lng: 74.877805 },
    { lat: 31.630555, lng: 74.779767 },
  ];

  const isInsidePolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat, yi = polygon[i].lng;
      const xj = polygon[j].lat, yj = polygon[j].lng;
      const intersect = yi > point.lng !== yj > point.lng &&
        point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const active = orders.find(order => 
    order.status !== 'cancelled' && order.status !== 'completed'
  );

  const refs = { beautyRef, beatiqueRef, techRef };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(Array.isArray(data) ? data : data.services || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/by-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: "" }),
        });
        const data = await res.json();
        setorders(data.orders || data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Scroll-direction detection for mobile header
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 40) {
        setHeaderVisible(true);
      } else if (currentY < lastScrollY.current - 4) {
        setHeaderVisible(true);
      } else if (currentY > lastScrollY.current + 8) {
        setHeaderVisible(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkAmritsar = (lat, lng) => {
    if (!lat || !lng) return false;
    const inside = isInsidePolygon({ lat, lng }, AMRITSAR_BOUNDS);
    setOutOfBounds(!inside);
    return inside;
  };

  const getCartTotal = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  const MIN_CART_VALUE = 299;

  const handleBooking = (service) => {
    const itemToAdd = {
      title: service.name || service.title,
      price: typeof service.price === 'string'
        ? parseInt(service.price.replace('₹', ''))
        : service.price,
      image: service.image,
      quantity: 1,
      category: service.category,
      earning: service.earning,
      profit: service.profit,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(itemToAdd);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    const total = getCartTotal();

    if (total < MIN_CART_VALUE) {
      const remaining = MIN_CART_VALUE - total;
      setMinCartError(`Add at least ₹${remaining} service`);
      return;
    }

    setMinCartError("");
    navigate("/checkout");
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const filtered = services.filter((s) => {
      const serviceTitle = (s.name || s.title || "").toLowerCase();
      const serviceCategory = (s.category || "").toLowerCase();
      const searchTerm = query.toLowerCase();
      return serviceTitle.includes(searchTerm) || serviceCategory.includes(searchTerm);
    });

    setResults(filtered.slice(0, 6));
    setOpen(true);
  }, [query, services]);

  useEffect(() => {
    const savedAddress = localStorage.getItem("user_address_text");
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (servicesLoading || services.length === 0) {
    return <SparkySkeletonPage />;
  }

  const handleWantClick = (wantName) => {
    setSelected(wantName);
    const serviceElements = document.querySelectorAll("h3, h2");
    let targetElement = null;

    for (const el of serviceElements) {
      if (el.textContent.toLowerCase().includes(wantName.toLowerCase())) {
        targetElement = el;
        break;
      }
    }

    if (targetElement) {
      const offset = 120;
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });

      const card = targetElement.closest('.group');
      if (card) {
        card.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
        setTimeout(() => {
          card.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
        }, 2000);
      }
    }
  };

  return (
    <div 
      style={{
        background: "linear-gradient(180deg, #FFF8F6 0%, #FFF1F5 52%, #FFF7FB 100%)",
      }} 
      className="min-h-screen w-full flex justify-center text-[#2B1B2E]"
    >
      <div className="w-full max-w-full lg:max-w-7xl min-h-screen relative overflow-hidden">
        <div className="min-h-screen text-[#2B1B2E] pb-32 lg:pb-16 font-sans overflow-x-hidden">
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
                  <UserMap setAddress={(addr, lat, lng) => {
                    setAddress(addr);
                    setPendingLocation({ lat, lng });
                  }} />

                  <AnimatePresence>
                    {outOfBounds && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-[#2B1B2E]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                      >
                        <div className="relative mb-8">
                          <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping scale-150 opacity-20" />
                          <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 rounded-full flex items-center justify-center border border-yellow-500/30">
                            <AlertTriangle size={48} className="text-yellow-500" />
                          </div>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Not Serving In Your Area</h2>
                        <p className="text-slate-300 text-base max-w-[280px]">Sparky currently only serves the heart of <span className="text-[#FFD9C9] font-extrabold underline decoration-[#C2306B]/50">Amritsar</span>.</p>
                        <button onClick={() => setOutOfBounds(false)} className="btn-secondary mt-12 px-7 py-3 text-[10px] uppercase tracking-[0.2em]">
                          Back
                        </button>
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
                        localStorage.setItem("user_address", JSON.stringify({ address, lat, lng }));
                        localStorage.setItem("user_address_text", address);
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

          {/* ================= MOBILE HEADER ================= */}
          <header
            style={{ 
              transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
              background: 'linear-gradient(110deg, #FFF0EB 0%, #FCEAF1 55%, #F0E5FF 100%)',
            }}
            className="
              lg:hidden
              fixed top-0 left-0 right-0
              z-50
              px-5 pt-3 pb-4
              rounded-b-[30px]
              border-b border-[#F1DFE8]
              shadow-[0_8px_24px_rgba(105,43,79,0.06)]
              transition-transform duration-300 ease-out
            "
          >
            <div className="flex items-center justify-between mb-3 h-[44px]">
              <div
                onClick={() => setShowMap(true)}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-[#F1DFE8] flex items-center justify-center shadow-xs shrink-0">
                  <MapPin size={15} className="text-[#C2306B]" />
                </div>

                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[13px] font-[700] text-[#2B1B2E] tracking-tight">
                    Home
                  </span>
                  <span className="text-[10px] text-[#8D788D] font-medium truncate max-w-[170px]">
                    {address}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[16px] font-[900] tracking-[0.2em] text-[#2B1B2E]">
                  SPARKY<span className="text-[#C2306B]">.</span>
                </span>
                <div className="w-8 h-8 rounded-full bg-white/90 border border-[#F1DFE8] flex items-center justify-center text-[#2B1B2E] shadow-xs">
                  <Bell size={15} className="text-[#2B1B2E]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div ref={searchRef} className="relative flex-1">
                <div className="flex items-center h-[44px] bg-white rounded-full px-4 border border-[#F1DFE8] shadow-xs">
                  <Search size={15} className="text-[#8D788D] mr-2 shrink-0" />
                  <input
                    placeholder="Search services"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[12px] font-medium text-[#2B1B2E] placeholder:text-[#8D788D]"
                  />
                  {query && (
                    <X
                      size={14}
                      className="text-[#8D788D] hover:text-[#2B1B2E] cursor-pointer"
                      onClick={() => setQuery("")}
                    />
                  )}
                </div>

                {open && results.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-[1.6rem] shadow-xl border border-[#F1DFE8] z-[999] overflow-hidden">
                    {results.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setQuery("");
                          setOpen(false);
                          setSelectedService(item);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFF7F3] cursor-pointer transition-colors"
                      >
                        <img
                          src={item.image || "/images/placeholder.jpg"}
                          className="w-10 h-10 rounded-xl object-cover"
                          alt=""
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#2B1B2E]">{item.name || item.title}</p>
                          <p className="text-xs text-[#8D788D]">{item.category}</p>
                        </div>
                        <span className="font-extrabold text-sm text-[#C2306B]">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/beauty')}
                className="btn-icon w-[44px] h-[44px] text-[#C2306B] shrink-0"
                aria-label="Filter"
              >
                <SlidersHorizontal size={17} />
              </button>
            </div>
          </header>

          <div className="lg:hidden h-[116px]" />

          {/* ================= HERO SECTION (Desktop Only) ================= */}
          <section className="hidden lg:block relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-white via-white/80 to-[#FFF7F3]">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C2306B]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#8E4FD6]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCEAF1] border border-[#F1DFE8] shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C2306B] animate-pulse" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C2306B]">
                    About Sparky • The Home Service Revolution
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2B1B2E] tracking-tight leading-[1.12]"
                >
                  Salon Luxury & Master Repairs,{" "}
                  <span className="bg-gradient-to-r from-[#C2306B] via-[#A83DAA] to-[#8E4FD6] bg-clip-text text-transparent">
                    Delivered to Your Door.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm sm:text-base md:text-lg text-[#8D788D] font-medium leading-relaxed max-w-2xl mx-auto pt-2"
                >
                  Sparky was built on a simple promise: make professional home and
                  beauty services effortless, safe, and transparent. No endless phone
                  calls, no bargaining, and no compromises on hygiene.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-3 pt-4"
                >
                  <Link
                    to="/beauty"
                    className="btn-primary-pill px-6 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Explore Services</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="btn-secondary-pill px-6 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <PhoneCall size={15} className="text-[#C2306B]" />
                    <span>Contact Us</span>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 max-w-4xl mx-auto"
              >
                {[
                  { value: "15,000+", label: "Bookings Fulfilled", icon: CheckCircle2 },
                  { value: "4.9 / 5", label: "Customer Satisfaction", icon: Star },
                  { value: "100%", label: "Background Verified", icon: ShieldCheck },
                  { value: "< 30 Min", label: "Rapid Booking Match", icon: Zap },
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F1DFE8] shadow-[0_8px_25px_rgba(105,43,79,0.04)] text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#FCEAF1] text-[#C2306B] flex items-center justify-center mb-2">
                        <Icon size={18} />
                      </div>
                      <span className="text-xl sm:text-2xl font-black text-[#2B1B2E] tracking-tight">
                        {s.value}
                      </span>
                      <span className="text-[11px] font-bold text-[#8D788D] uppercase tracking-wider mt-0.5">
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* ================= MAIN CONTENT ================= */}
          <main className="px-2 sm:px-4 lg:px-6 space-y-8 pt-2">
            <section className="mt-2 px-2 sm:px-4">
              <div className="max-w-md lg:max-w-7xl mx-auto p-4 sm:p-6 lg:p-7 rounded-[24px] bg-white border border-[#F1DFE8] shadow-[0_4px_18px_rgba(105,43,79,0.07)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-[#F5E8ED]">
                  <div>
                    <h2 className="text-[18px] sm:text-xl lg:text-2xl font-[800] tracking-tight text-[#2B1B2E]">
                      Our Specialities & Rituals
                    </h2>
                    <p className="text-xs text-[#8D788D] mt-0.5">Select a category to view curated treatments</p>
                  </div>

                  <button
                    onClick={() => navigate('/beauty')}
                    className="text-xs font-bold text-[#C2306B] hover:text-[#A82058] flex items-center gap-1 self-start sm:self-auto transition-colors"
                  >
                    <span>View Full Catalog</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3.5 lg:gap-4">
                  {want.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => handleWantClick(cat.name)}
                      className="group flex flex-col items-center gap-2 p-1.5 rounded-2xl hover:bg-[#FFF7F3] transition-all"
                    >
                      <div 
                        style={{
                          background: "linear-gradient(180deg, #FFF7F3 0%, #FFF1F4 65%, #F8E5ED 100%)",
                        }}
                        className="relative w-full aspect-square max-w-[76px] sm:max-w-[84px] rounded-2xl overflow-hidden border border-[#F1DFE8] shadow-xs group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200"
                      >
                        <img
                          src={cat.image || "/images/sremovebg.png"}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          alt={cat.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#C2306B]/5 to-transparent opacity-40" />
                      </div>

                      <span className="text-[11px] sm:text-xs font-bold text-center text-[#2B1B2E] group-hover:text-[#C2306B] transition-colors tracking-tight">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {minCartError && (
              <div className="fixed bottom-13 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xs bg-white/90 backdrop-blur-2xl border border-[#F1DFE8] shadow-[0_10px_40px_rgba(105,43,79,0.12)] rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#C2306B] via-[#A83DAA] to-[#8E4FD6] flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-[#C2306B]/30">
                    ₹
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#2B1B2E] leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2306B] via-[#A83DAA] to-[#8E4FD6] font-bold">
                      {minCartError}
                    </span> more
                  </p>
                  <p className="text-[10px] text-[#8D788D] font-medium">
                    to proceed to checkout
                  </p>

                  <div className="mt-2 h-[3px] w-full bg-[#F5E8ED] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C2306B] via-[#A83DAA] to-[#8E4FD6] transition-all duration-700 ease-out rounded-full"
                      style={{ width: "70%" }} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MOBILE-ONLY BEAUTY SERVICES */}
            <section ref={beautyRef} className="pt-1 lg:hidden">
              <FloatingOrderTracker activeOrder={active} />

              {[
                "Waxing",
                "Facial",
                "Mehandi",
                "Haircare",
                "Threading",
                "Makeup",
                "Bleach",
                "Cleanup",
                "Manicure",
                "Pedicure",
                "Hair",
                "Mehndi",
              ].map((subCat) => {
                const filteredServices = services.filter(
                  (item) =>
                    item.category === "Woman Services" &&
                    (item.name || item.title || "")
                      .toLowerCase()
                      .includes(subCat.toLowerCase())
                );

                if (filteredServices.length === 0) return null;
                const displayServices = filteredServices.slice(0, 6);

                return (
                  <div key={subCat} className="mb-7">
                    <div className="mb-3 flex items-center justify-between px-3">
                      <h3 className="flex items-center gap-2 text-[15px] font-extrabold tracking-tight text-[#2B1B2E]">
                        <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[#E98CB0] to-[#A51F56]" />
                        {subCat}
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/beauty?category=${encodeURIComponent(subCat.toUpperCase())}`)
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-[#C2306B]/15 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C2306B] shadow-sm backdrop-blur-md transition-colors hover:bg-[#FFF0F6]"
                      >
                        View All
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 px-2 sm:px-4">
                      {displayServices.map((item) => {
                        const image = item.image || item.imageUrl || item.thumbnail || item.photo;
                        const title = item.name || item.title || subCat;

                        return (
                          <div
                            key={item._id || item.id}
                            onClick={() => setSelectedService(item)}
                            className="group min-w-0 overflow-hidden rounded-[20px] border border-[#F3E8ED] bg-white p-2.5 shadow-[0_3px_12px_rgba(194,48,107,0.04)] transition-all duration-300 active:scale-[0.98]"
                          >
                            <div className="relative aspect-[4/4.3] overflow-hidden rounded-[14px] bg-[#FCEEF4]">
                              {image ? (
                                <img
                                  src={image}
                                  alt={title}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Wrench className="text-[#C2306B]/40" size={25} />
                                </div>
                              )}

                              <div className="absolute inset-0 bg-gradient-to-t from-[#321321]/10 to-transparent" />

                              <button
                                type="button"
                                aria-label={`Select ${title}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedService(item);
                                }}
                                className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-white/60 bg-gradient-to-br from-[#E98CB0] via-[#C2306B] to-[#A51F56] text-white shadow-[0_4px_12px_rgba(194,48,107,0.25)] transition-transform hover:scale-105 active:scale-90"
                              >
                                <Plus size={18} strokeWidth={2.5} />
                              </button>
                            </div>

                            <h4 className="mt-3 min-h-[30px] line-clamp-2 text-[11px] font-bold leading-[1.4] text-[#2B1B2E]">
                              {title}
                            </h4>

                            <div className="mt-2 flex items-center justify-between gap-1">
                              <span className="h-2 w-12 rounded-full bg-[#FCEEF4]" />
                              <span className="h-2 w-5 rounded-full bg-[#FCEEF4]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Desktop Only About Sections */}
            <div className="hidden lg:block">
              <AboutSections />
            </div>
          </main>

          {/* ================= BOTTOM SLIDE DRAWER ================= */}
          <div 
            onClick={() => setSelectedService(null)}
            className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px] transition-opacity duration-300 ${selectedService ? "opacity-100 visible" : "opacity-0 invisible"}`}
          />
          
          <div
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFF7F3 100%)",
            }}
            className={`fixed 
              z-[70]
              overflow-hidden
              border-t border-[#F1DFE8]
              transition-all duration-300 ease-out
              bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] rounded-t-[2.5rem] shadow-[0_-18px_45px_rgba(105,43,79,0.18)]
              lg:top-1/2 lg:bottom-auto lg:left-1/2 lg:-translate-x-1/2 lg:max-w-lg lg:rounded-[2.5rem] lg:shadow-2xl lg:border
              ${selectedService 
                ? "translate-y-0 lg:-translate-y-1/2 opacity-100 visible" 
                : "translate-y-full lg:opacity-0 lg:invisible pointer-events-none"}`}
          >
            <div className="w-10 h-1.5 bg-[#F1DFE8] rounded-full mx-auto mt-3 mb-3 lg:hidden" />

            {selectedService && (
              <div className="px-6 pb-7 pt-1">
                <div className="relative w-full h-56 rounded-[1.9rem] overflow-hidden mb-5 shadow-[0_12px_28px_rgba(105,43,79,0.12)] border border-white/60">
                  <img
                    src={selectedService.image}
                    className="w-full h-full object-cover"
                    alt="Service Detail"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-white/10" />
                  <button
                    onClick={() => setSelectedService(null)}
                    className="btn-icon w-9 h-9 absolute top-3 right-3 shadow-md"
                  >
                    <X size={16} className="text-[#2B1B2E]" />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-[20px] font-semibold text-[#2B1B2E] leading-snug tracking-tight">
                      {selectedService.name || selectedService.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-yellow-500">
                        <Star size={13} fill="currentColor" />
                        <span className="ml-1 text-[12px] font-semibold text-[#2B1B2E]">
                          4.9
                        </span>
                      </div>
                      <span className="text-[#C2306B]">•</span>
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-[#C2306B]">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[22px] font-semibold text-[#C2306B] tracking-tight">
                      ₹{selectedService.price || "799"}
                    </p>
                    <p className="text-[9px] text-[#8D788D] uppercase tracking-widest">
                      Base
                    </p>
                  </div>
                </div>

                <p className="text-[#6F5B70] leading-relaxed mb-6 font-normal text-[13px]">
                  {selectedService.description ||
                    "Premium at-home service delivered by trained professionals using hygienic, salon-grade products."}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleBooking(selectedService)}
                    className="btn-primary flex-1 py-3.5 text-[11px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Book Now<ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => navigate(`/services/${selectedService.title}`)}
                    className="btn-secondary flex-1 py-3.5 text-[11px] font-semibold uppercase tracking-widest"
                  >
                    Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Skeleton({ className }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#F7E5EE] ${className}`} />
  );
}

function HeaderSkeleton() {
  return (
    <header className="bg-gradient-to-br from-[#C2306B] via-[#A51F56] to-[#7B1040] px-4 pt-5 pb-8 rounded-b-[2.5rem] shadow-lg">
      <Skeleton className="h-3.5 w-28 mb-2 bg-white/30" />
      <Skeleton className="h-5 w-44 mb-5 bg-white/30" />
      <Skeleton className="h-12 w-full rounded-2xl bg-white/40" />
    </header>
  );
}

function ServicesGridSkeleton() {
  return (
    <section className="mt-5 px-4">
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#F1DFE8]">
        <Skeleton className="h-5 w-36 mx-auto mb-5" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="h-2.5 w-12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceSectionSkeleton() {
  return (
    <section className="pt-5">
      <div className="px-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-1 h-5 rounded-full bg-[#E98CB0]" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3 px-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[20px] p-2.5 border border-[#F1DFE8] shadow-sm">
            <Skeleton className="w-full aspect-square rounded-[14px] mb-2.5 bg-[#FCEEF4]" />
            <Skeleton className="h-2.5 w-full mb-1" />
            <Skeleton className="h-2.5 w-2/3 mb-2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="w-5 h-5 rounded-full bg-[#FCEEF4]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SparkySkeletonPage() {
  return (
    <div className="min-h-screen bg-[#FFF7F3] flex justify-center">
      <div className="w-full max-w-full lg:max-w-7xl min-h-screen pb-3 relative overflow-hidden">
        <HeaderSkeleton />
        <ServicesGridSkeleton />
        <ServiceSectionSkeleton />
        <ServiceSectionSkeleton />
        <ServiceSectionSkeleton />
      </div>
    </div>
  );
}

