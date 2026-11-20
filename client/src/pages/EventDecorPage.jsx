import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CheckCircle, X, ShoppingCart, Eye, Zap, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 z-50">
      <img
        src="/images/LOGO (2).jpg"
        alt="Logo"
        className="w-44 h-auto mb-6"
      />
      <div className="w-48 h-1 bg-gray-700 rounded overflow-hidden">
        <div className="h-full bg-[#3ab4ff] animate-pulse"></div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

export default function EventDecorPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/event");
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const addToCart = (newItem) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push({ ...newItem, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
    toast.success("Item added to cart!");
  };

  const filteredServices =
    selectedCategory === "ALL"
      ? services
      : services.filter((s) =>
          (s.title || "").toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  if (loading) return <PageLoader />;

  return (
    <div className="mt-[70px] bg-gray-50 min-h-screen">
      <div className="sticky top-[70px] bg-white z-40 shadow-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-3 justify-center">
          {["ALL", "Theme", "modern", "PEDICURE", "CLEANSING", "WAXING", "BLEACH", "MAKEUP"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 border ${
                selectedCategory === cat
                  ? "bg-[#002366] text-white border-[#002366] shadow-lg"
                  : "bg-gray-50 hover:bg-gray-200 text-gray-700 border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <motion.div
                key={service._id}
                variants={itemVariants}
                className="service-card bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative w-full h-52">
                  <img
                    src={service.image || "/cleaning-placeholder.png"}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  {service.discount && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                      {service.discount} OFF
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex justify-between items-center mt-4 border-t pt-4">
                    <span className="text-2xl font-extrabold text-[#002366]">
                      ₹{service.price}
                    </span>
                    <div className="text-sm text-gray-700">
                      <span className="text-yellow-500">⭐</span>{" "}
                      {service.rating?.average || "4.8"}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex items-center justify-center flex-1 border border-[#002366]/50 text-[#002366] py-2 rounded-xl font-medium hover:bg-[#002366]/10 transition-all"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Details
                    </button>
                    <button
                      onClick={() => addToCart(service)}
                      className="flex items-center justify-center flex-1 bg-[#002366] text-white py-2 rounded-xl font-semibold hover:bg-[#4a65d6] transition-all shadow-md"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center p-10 bg-white rounded-xl shadow-lg">
              No services found in this category.
            </p>
          )}
        </motion.div>
      </main>

      <button
        onClick={() => setCartOpen(!cartOpen)}
        className="fixed bottom-6 right-6 bg-[#002366] text-white p-4 rounded-full shadow-2xl hover:bg-[#4a65d6] transition-all duration-300 z-50"
      >
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-2 py-0.5">
            {cart.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-gray-500 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedService.image || "/cleaning-placeholder.png"}
                alt={selectedService.title}
                className="w-full h-56 rounded-2xl object-cover mb-6 shadow-md"
              />
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                {selectedService.title}
              </h3>
              <p className="text-gray-600 mb-4">{selectedService.description}</p>
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-extrabold text-[#002366]">
                  ₹{selectedService.price}
                </span>
                <span className="text-yellow-500">⭐ {selectedService.rating?.average || "4.8"}</span>
              </div>
              <button
                onClick={() => {
                  addToCart(selectedService);
                  setSelectedService(null);
                }}
                className="btn-primary w-full py-3 rounded-xl font-bold"
              >
                Add to Cart
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

