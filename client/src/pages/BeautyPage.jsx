import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  X,
  ShoppingCart,
  Trash2,
  Star,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Filter,
  ArrowRight,
  Plus
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BeautyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category")?.toUpperCase() || "ALL";

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [minCartError, setMinCartError] = useState("");
  const navigate = useNavigate();

  const MIN_CART_VALUE = 299;

  // Theme Colors
  const SAGA_GREEN = "#C2306B";
  const SAGA_SOFT = "#FCEAF1";
  const SAGA_ACCENT = "#f7b614";
  const SAGA_MAROON = "#C2306B";

  const CATEGORY_LIST = [
    "ALL",
    "FACIAL",
    "CLEANUP",
    "WAXING",
    "MAKEUP",
    "MANICURE",
    "BLEACH",
    "THREADING",
    "HAIR",
  ];

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  useEffect(() => {
    const cat = searchParams.get("category")?.toUpperCase();
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("ALL");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/facial");
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const addToCart = (service) => {
    const itemToAdd = {
      title: service.name || service.title,
      price:
        typeof service.price === "string"
          ? parseInt(service.price.replace("₹", ""))
          : service.price,
      image: service.image,
      quantity: 1,
      category: service.category,
      earning: service.earning,
      profit: service.profit,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, itemToAdd];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);

    const total = updatedCart.reduce((sum, i) => sum + i.price, 0);

    if (total < MIN_CART_VALUE) {
      const remaining = MIN_CART_VALUE - total;
      setMinCartError(`Add at least ₹${remaining} service`);
      return;
    }

    setMinCartError("");
  };

  const isItemInCart = (title) => {
    return cart.some((i) => i.title?.toLowerCase() === title?.toLowerCase());
  };

  const filteredServices =
    selectedCategory === "ALL"
      ? services
      : services.filter((s) =>
          (s.title || "").toLowerCase().includes(selectedCategory.toLowerCase())
        );

  if (loading) return <CleaningSkeleton />;

  return (
    <div className="min-h-screen bg-[#FFF7F3] text-[#2B1B2E] font-sans antialiased pb-28 lg:pb-16 selection:bg-[#F1DFE8]">
      {/* 1. PROFESSIONAL LANDSCAPE / RESPONSIVE STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#F1DFE8] shadow-[0_4px_20px_rgba(58,77,57,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate(-1)}
              className="btn-icon w-10 h-10 text-[#C2306B]"
              aria-label="Go Back"
            >
              <ChevronLeft size={20} />
            </button>

            <div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8D788D] opacity-80">
                <span>Sparky Services</span>
                <span>/</span>
                <span className="text-[#C2306B] font-extrabold">Rituals</span>
              </div>
              <h1 className="text-lg lg:text-2xl font-[900] tracking-tight text-[#2B1B2E] flex items-center gap-2">
                <span>{selectedCategory === "ALL" ? "All Services" : `${selectedCategory}`}</span>
                <span className="text-xs font-semibold text-[#8D788D] bg-[#F1DFE8] px-2.5 py-0.5 rounded-full">
                  {filteredServices.length} available
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="btn-secondary-pill px-4 py-2 flex items-center gap-2.5"
            >
              <div className="relative">
                <ShoppingCart size={19} color={SAGA_GREEN} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C2306B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold border-2 border-white shadow-sm">
                    {cart.length}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-[#8D788D] font-semibold">Your Bag</span>
                <span className="text-xs font-black text-[#2B1B2E]">
                  ₹{cartTotal}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Category Pills */}
        <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 px-4 pb-3 pt-1 scroll-smooth">
          {CATEGORY_LIST.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-[11px] font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "btn-primary-pill text-white shadow-md shadow-[#C2306B]/20"
                    : "btn-secondary-pill text-[#8D788D]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. MAIN LANDSCAPE LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* LEFT COLUMN: DESKTOP STICKY SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-[#F1DFE8] shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F1DFE8]">
                <Filter size={16} className="text-[#C2306B]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#C2306B]">
                  Filter Rituals
                </h3>
              </div>

              <div className="space-y-1.5">
                {CATEGORY_LIST.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 text-left ${
                        isActive
                          ? "btn-primary text-white shadow-md shadow-[#C2306B]/20"
                          : "text-[#8D788D] hover:bg-[#FFF7F3] hover:text-[#2B1B2E]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full transition-all ${
                            isActive ? "bg-white scale-125" : "bg-[#F1DFE8]"
                          }`}
                        />
                        <span>{cat}</span>
                      </div>

                      {isActive && <ChevronRight size={14} className="opacity-80" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FFF7F3] to-[#F1DFE8] rounded-3xl p-5 border border-[#F1DFE8] space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#C2306B]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#C2306B]">
                  Sparky Assured
                </span>
              </div>
              <ul className="text-[11px] text-[#8D788D] space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#C2306B] shrink-0" />
                  <span>100% Certified Salon Specialists</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#C2306B] shrink-0" />
                  <span>Hygienic Single-Use Sealed Kits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#C2306B] shrink-0" />
                  <span>Transparent Upfront Pricing</span>
                </li>
              </ul>
            </div>

            {cart.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-[#F1DFE8] shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#2B1B2E]">
                    Quick Bag ({cart.length})
                  </span>
                  <span className="text-sm font-black text-[#C2306B]">
                    ₹{cartTotal}
                  </span>
                </div>
                <button
                  onClick={() => setCartOpen(true)}
                  className="btn-primary w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span>Review Bag</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </aside>

          {/* RIGHT COLUMN: SERVICE SHOWCASE GRID */}
          <div className="lg:col-span-9 xl:col-span-9 space-y-6">
            <div className="hidden lg:flex items-center justify-between pb-2 border-b border-[#F1DFE8]">
              <div>
                <h2 className="text-xl font-[900] text-[#2B1B2E]">
                  {selectedCategory === "ALL" ? "All Available Rituals" : `${selectedCategory} Rituals`}
                </h2>
                <p className="text-xs text-[#8D788D] mt-0.5">
                  Showing curated beauty treatments with transparent pricing & premium ingredients.
                </p>
              </div>
              <div className="text-xs font-bold text-[#8D788D] bg-white border border-[#F1DFE8] px-3.5 py-1.5 rounded-full shadow-sm">
                {filteredServices.length} services found
              </div>
            </div>

            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#F1DFE8] shadow-sm">
                <Sparkles size={36} className="mx-auto text-[#8D788D] mb-3 opacity-60" />
                <h3 className="text-base font-extrabold text-[#2B1B2E]">No rituals found</h3>
                <p className="text-xs text-[#8D788D] mt-1">
                  Try selecting another category or check back soon for new services.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredServices.map((service) => {
                  const inCart = isItemInCart(service.title || service.name);
                  return (
                    <div
                      key={service._id || service.title}
                      className="group bg-white rounded-3xl p-5 border border-[#F1DFE8] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#F1DFE8] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#F7B614] bg-[#FFF9E6] px-2 py-0.5 rounded-full">
                            <Star size={11} fill="currentColor" />
                            <span>{service.rating || "4.8"}</span>
                          </div>

                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D788D] bg-[#FCEAF1] px-2.5 py-0.5 rounded-full">
                            {service.category || "Beauty"}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-[#2B1B2E] leading-snug tracking-tight mb-1.5 group-hover:text-[#C2306B] transition-colors">
                          {service.title}
                        </h3>

                        <p className="text-[12px] text-[#8D788D] leading-relaxed mb-4 line-clamp-2">
                          {service.description || "Deluxe skincare session with natural herbal extracts and soothing massage."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#FCEAF1] flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-[900] text-[#2B1B2E]">
                              ₹{service.price}
                            </span>
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{parseInt(service.price) + 300}
                            </span>
                          </div>

                          <button
                            onClick={() => navigate(`/services/${service.title}`)}
                            className="text-[11px] font-bold text-[#C2306B] flex items-center gap-0.5 hover:gap-1.5 transition-all mt-1"
                          >
                            <span>View Details</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>

                        <div className="relative flex flex-col items-center shrink-0">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#FCEAF1] border border-[#F1DFE8] shadow-inner">
                            <img
                              src={service.image || "/images/goldfacial.jpg"}
                              alt={service.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                          </div>

                          <button
                            onClick={() => addToCart(service)}
                            className={`absolute -bottom-2.5 px-4 py-1.5 text-[11px] font-bold shadow-md transition-all active:scale-95 ${
                              inCart
                                ? "btn-primary rounded-xl"
                                : "btn-secondary rounded-xl"
                            }`}
                          >
                            {inCart ? "Added" : "+ Add"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bag Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F1DFE8]">
                <h2 className="text-base font-black text-[#2B1B2E] uppercase">Your Bag ({cart.length})</h2>
                <button onClick={() => setCartOpen(false)} className="btn-icon w-9 h-9">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-xs text-[#8D788D] text-center py-10">Bag is empty</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-[#FFF7F3] border border-[#F1DFE8]">
                      <div>
                        <h4 className="text-xs font-extrabold text-[#2B1B2E]">{item.title}</h4>
                        <p className="text-xs font-bold text-[#C2306B]">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => {
                          const updated = [...cart];
                          updated.splice(idx, 1);
                          setCart(updated);
                          localStorage.setItem("cart", JSON.stringify(updated));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1DFE8]">
              <div className="flex justify-between text-sm font-black mb-4">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/cart");
                }}
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                Go to Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CleaningSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF7F3] p-6 lg:p-12 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-14 bg-white rounded-2xl border border-[#F1DFE8]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-[#F1DFE8]" />
          ))}
        </div>
      </div>
    </div>
  );
}

