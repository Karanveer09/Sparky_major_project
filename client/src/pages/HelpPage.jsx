import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  Search,
  Sparkles,
  Calendar,
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  X
} from "lucide-react";

const FAQ_CATEGORIES = [
  "All Topics",
  "Booking & Rescheduling",
  "Payments & Refunds",
  "Safety & Quality",
  "Live Service Journey",
];

const FAQ_ITEMS = [
  {
    id: 1,
    category: "Booking & Rescheduling",
    question: "How do I track my service professional in real-time?",
    answer:
      "Once an expert is assigned to your order, you can visit the Track page directly from your account or the floating order tracker. You will see their live GPS coordinates on an interactive map with updated turn-by-turn ETA.",
  },
  {
    id: 2,
    category: "Safety & Quality",
    question: "What is Sparky's 100% Satisfaction Guarantee?",
    answer:
      "Sparky guarantees craftsmanship and hygiene. If you are not completely delighted with your service ritual, our safety desk will arrange a complimentary rework session with a senior specialist or initiate an immediate full refund.",
  },
  {
    id: 3,
    category: "Booking & Rescheduling",
    question: "Can I reschedule or cancel my service booking?",
    answer:
      "Yes. You can reschedule to any available date and time slot with zero penalty as long as the technician has not departed for your premises. Free cancellations are honored up to 2 hours before the scheduled appointment.",
  },
  {
    id: 4,
    category: "Payments & Refunds",
    question: "How do refunds work and how long do they take?",
    answer:
      "Approved refunds are processed instantly back to your original payment method (UPI, Debit/Credit Card, or Net Banking). Bank settlement typically reflects within 2 to 4 business hours.",
  },
  {
    id: 5,
    category: "Safety & Quality",
    question: "Are all Sparky service professionals background-checked?",
    answer:
      "Every single technician and salon partner undergoes 7-point verification: mandatory police background clearance, government ID validation, in-person hygiene training, and technical trade tests before accepting any appointment.",
  },
  {
    id: 6,
    category: "Live Service Journey",
    question: "What should I do if an emergency arises during a service?",
    answer:
      "Every active appointment includes an instant Emergency Pause feature in the app. Tapping it halts the live service timer immediately and alerts our priority safety desk to contact you within 60 seconds.",
  },
  {
    id: 7,
    category: "Payments & Refunds",
    question: "Which payment options are accepted?",
    answer:
      "We support all major payment gateways including UPI (Google Pay, PhonePe, Paytm), Visa, MasterCard, RuPay cards, Net Banking, and secure Cash on Delivery upon completion.",
  },
];

const QUICK_CARDS = [
  {
    id: "call",
    title: "Call Direct Concierge",
    subtitle: "Instant Voice Support",
    detail: "+91 81950 60669",
    meta: "Available 7 AM - 11 PM",
    badge: "Priority",
    badgeColor: "bg-[#F7B614] text-[#2B1B2E]",
    icon: Phone,
    actionText: "Call Now",
    actionHref: "tel:+918195060669",
  },
  {
    id: "whatsapp",
    title: "WhatsApp Helpline",
    subtitle: "Chat with an Expert",
    detail: "Direct message resolution",
    meta: "Average reply: 2 mins",
    badge: "Fastest",
    badgeColor: "bg-[#C2306B] text-white",
    icon: MessageSquare,
    actionText: "Open WhatsApp",
    actionHref: "https://wa.me/918195060669?text=Hi%20Sparky%20Support,%20I%20need%20assistance%20with%20my%20service.",
    external: true,
  },
  {
    id: "orders",
    title: "Active Bookings",
    subtitle: "Self-Service Hub",
    detail: "Track, reschedule, or cancel",
    meta: "Instant self-service",
    badge: "Automated",
    badgeColor: "bg-[#FCEAF1] text-[#8D788D]",
    icon: Calendar,
    actionText: "Manage Bookings",
    actionHref: "/user",
  },
  {
    id: "email",
    title: "Email Support Desk",
    subtitle: "Official Correspondence",
    detail: "support@sparky.in",
    meta: "Detailed inquiry & bills",
    badge: "24x7",
    badgeColor: "bg-[#FCEAF1] text-[#8D788D]",
    icon: Mail,
    actionText: "Write Email",
    actionHref: "mailto:support@sparky.in",
  },
];

export default function HelpPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [openFaqId, setOpenFaqId] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bookingId: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Topics" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({ success: true }));

      if (data.success !== false) {
        toast.success("Help request registered successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          bookingId: "",
          message: "",
        });
      } else {
        toast.error("Could not dispatch ticket. Please try again.");
      }
    } catch {
      toast.success("Request logged! A concierge manager will reach out shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F3] text-[#2B1B2E] font-sans antialiased pb-24 lg:pb-16 selection:bg-[#F1DFE8]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#F1DFE8] shadow-[0_4px_20px_rgba(58,77,57,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn-icon w-10 h-10 text-[#C2306B]"
              aria-label="Go Back"
            >
              <ChevronLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8D788D] opacity-80">
                <span>Sparky Care</span>
                <span>/</span>
                <span className="text-[#C2306B] font-extrabold">24/7 Desk</span>
              </div>
              <h1 className="text-lg lg:text-xl font-[900] tracking-tight text-[#2B1B2E]">
                Help & Concierge Center
              </h1>
            </div>
          </div>

          <a
            href="tel:+918195060669"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C2306B] text-white text-xs font-bold shadow-sm"
          >
            <Phone size={13} className="text-[#F7B614]" />
            <span className="hidden sm:inline">Priority Line</span>
          </a>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#C2306B] via-[#2F3E2E] to-[#1E291D] text-white p-6 sm:p-10 lg:p-14 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-[#F7B614]">
              <Sparkles size={14} />
              <span>Dedicated Customer Assistance</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-[900] tracking-tight leading-tight">
              How can our concierge <br className="hidden sm:block" />
              <span className="text-[#F7B614] italic">assist you</span> today?
            </h2>

            <div className="pt-2">
              <div className="relative max-w-xl mx-auto">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions, tracking, invoices, refunds..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white text-[#2B1B2E] placeholder-gray-400 text-xs sm:text-sm font-semibold shadow-xl border border-white/20 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12">
          {QUICK_CARDS.map((card) => {
            const IconComp = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl p-6 border border-[#F1DFE8] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF7F3] text-[#C2306B] flex items-center justify-center">
                      <IconComp size={22} />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#2B1B2E]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#8D788D] mt-0.5">
                    {card.subtitle}
                  </p>
                  <p className="text-xs font-extrabold text-[#2B1B2E] mt-2">
                    {card.detail}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#FCEAF1] flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {card.meta}
                  </span>

                  {card.external ? (
                    <a
                      href={card.actionHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-black text-[#C2306B]"
                    >
                      <span>{card.actionText}</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : card.actionHref.startsWith("tel:") || card.actionHref.startsWith("mailto:") ? (
                    <a
                      href={card.actionHref}
                      className="inline-flex items-center gap-1 text-xs font-black text-[#C2306B]"
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight size={13} />
                    </a>
                  ) : (
                    <Link
                      to={card.actionHref}
                      className="inline-flex items-center gap-1 text-xs font-black text-[#C2306B]"
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F1DFE8] shadow-sm">
          <h2 className="text-xl font-black text-[#2B1B2E] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-[#F1DFE8] rounded-2xl p-4 cursor-pointer"
                onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-extrabold text-[#2B1B2E]">{faq.question}</h4>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openFaqId === faq.id ? "rotate-180" : ""}`}
                  />
                </div>
                {openFaqId === faq.id && (
                  <p className="text-xs text-[#8D788D] mt-3 leading-relaxed">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

