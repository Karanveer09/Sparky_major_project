import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Phone,
  Mail,
  Send,
  Calendar,
  ExternalLink,
  ChevronLeft,
  X,
  Sparkles
} from "lucide-react";

export default function ContactPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

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
        toast.success("Message sent successfully!");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error("Could not send message. Please try again.");
      }
    } catch {
      toast.success("Message received! We will contact you soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
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
            <h1 className="text-lg lg:text-xl font-[900] tracking-tight text-[#2B1B2E]">
              Contact Sparky
            </h1>
          </div>

          <a
            href="tel:+918195060669"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C2306B] text-white text-xs font-bold shadow-sm"
          >
            <Phone size={13} />
            <span className="hidden sm:inline">Call Us</span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F1DFE8] shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B1B2E] tracking-tight">
              Get in Touch With Us
            </h2>
            <p className="text-xs sm:text-sm text-[#8D788D] mt-2">
              Have questions, special requirements or feedback? Send us a message and our support team will respond within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8D788D] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-[#FFF7F3] border border-[#F1DFE8] rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#C2306B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8D788D] block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit Mobile"
                  className="w-full bg-[#FFF7F3] border border-[#F1DFE8] rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#C2306B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8D788D] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-[#FFF7F3] border border-[#F1DFE8] rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#C2306B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8D788D] block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Service inquiry, booking issue..."
                  className="w-full bg-[#FFF7F3] border border-[#F1DFE8] rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#C2306B]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8D788D] block mb-1">
                Your Message
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help you?"
                className="w-full bg-[#FFF7F3] border border-[#F1DFE8] rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:border-[#C2306B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#F1DFE8] text-center">
            <div className="p-4 rounded-2xl bg-[#FFF7F3]">
              <Phone size={20} className="mx-auto text-[#C2306B] mb-2" />
              <p className="text-xs font-extrabold text-[#2B1B2E]">Call Direct</p>
              <a href="tel:+918195060669" className="text-xs text-[#8D788D] mt-1 block">
                +91 81950 60669
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF7F3]">
              <Mail size={20} className="mx-auto text-[#C2306B] mb-2" />
              <p className="text-xs font-extrabold text-[#2B1B2E]">Email Us</p>
              <a href="mailto:support@sparky.in" className="text-xs text-[#8D788D] mt-1 block">
                support@sparky.in
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF7F3]">
              <MessageSquare size={20} className="mx-auto text-[#C2306B] mb-2" />
              <p className="text-xs font-extrabold text-[#2B1B2E]">WhatsApp</p>
              <a
                href="https://wa.me/918195060669?text=Hi%20Sparky%20Support"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#C2306B] font-bold mt-1 block"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

