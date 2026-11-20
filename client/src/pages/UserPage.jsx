import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoLogOutOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoChevronForward,
  IoBagCheckOutline,
  IoPersonCircleOutline,
  IoShieldCheckmarkOutline
} from "react-icons/io5";
import { motion } from "framer-motion";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const THEME_GREEN = "#C2306B";

  useEffect(() => {
    async function initProfile() {
      try {
        const authRes = await fetch("/api/me");
        const authData = await authRes.json();

        if (!authData.user) {
          navigate("/login");
          return;
        }

        setUser(authData.user);

        const orderRes = await fetch("/api/orders/by-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: authData.user.phone }),
        });

        const orderData = await orderRes.json();
        setTasks(orderData.orders || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfcfa]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-[#FCEAF1] border-t-[#C2306B] rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8D788D] animate-pulse">
            Authenticating
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#fbfcfa] pb-32 font-sans text-[#2B1B2E] relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.08)]">
        <main className="w-full pt-0.5">
          <header className="relative pt-10 pb-14 overflow-hidden bg-gradient-to-b from-[#a4c4a7] via-[#e8f0e8] to-[#F7F9F7]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_60%)] pointer-events-none" />

            <div className="w-full relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-6"
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white to-[#f1f3eb] flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-white">
                  <IoPersonCircleOutline size={95} className="text-gray-300" />
                </div>

                <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border-4 border-white flex items-center justify-center shadow-md">
                  <IoShieldCheckmarkOutline size={14} className="text-white" />
                </div>
              </motion.div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-1">
                Your Account
              </h1>

              <p className="text-gray-500 text-sm font-medium tracking-tight">
                {user.phone || user.email}
              </p>

              <div className="flex gap-3 mt-5">
                <span className="text-[10px] font-semibold bg-gradient-to-br from-white to-[#FCEAF1] text-[#C2306B] px-4 py-1.5 rounded-full shadow-sm border border-white">
                  Verified
                </span>

                <button
                  onClick={handleLogout}
                  className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-4 py-1.5 rounded-full shadow-sm border border-rose-100 flex items-center gap-1"
                >
                  <IoLogOutOutline size={12} /> Logout
                </button>
              </div>
            </div>
          </header>

          <section className="px-6 mt-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-[12px] font-extrabold uppercase tracking-[0.15em] text-[#8D788D]">
                  Activity Log
                </h3>
                <p className="text-[10px] font-semibold text-gray-400 uppercase mt-0.5">
                  Manage your past bookings
                </p>
              </div>

              <span className="px-4 py-1.5 text-[10px] font-bold rounded-full bg-gradient-to-br from-[#FCEAF1] to-[#e8f0e8] text-[#C2306B] border border-[#F1DFE8]">
                {tasks.length} RECORDS
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="bg-gradient-to-br from-white via-[#fbfcfa] to-[#FCEAF1] rounded-2xl p-12 text-center shadow-sm border border-[#f1f3eb]">
                <div className="w-20 h-20 rounded-full bg-[#fbfcfa] flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <IoBagCheckOutline size={36} className="text-gray-300" />
                </div>
                <p className="text-[#2B1B2E] font-bold uppercase text-[11px] tracking-widest opacity-40">
                  No active bookings found
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    key={task._id}
                    className="bg-gradient-to-br from-white via-[#fbfcfa] to-[#FCEAF1] rounded-2xl p-6 shadow-sm border border-[#f1f3eb] relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <p className="text-[9px] font-extrabold text-gray-300 uppercase tracking-[0.2em] mb-1">
                          Ref No: {task.order_id}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {task.cart?.map((item, i) => (
                            <span
                              key={i}
                              className="text-[12px] font-bold text-[#2B1B2E] italic uppercase tracking-tight bg-gradient-to-br from-[#fbfcfa] to-[#f9faf7] px-2.5 py-1 rounded-lg border border-[#f1f3eb]"
                            >
                              {item.name || item.title}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-[#C2306B] tracking-tighter">
                          ₹{task.total}
                        </p>
                        <div className="inline-block bg-emerald-50 text-emerald-600 text-[8px] font-bold px-2 py-0.5 rounded uppercase mt-1">
                          Success
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-dashed border-[#f1f3eb] pt-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#FCEAF1] rounded-xl">
                          <IoCalendarOutline className="text-[#C2306B]" size={16} />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-tight text-[#8D788D]">
                          {task.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#FCEAF1] rounded-xl">
                          <IoTimeOutline className="text-[#C2306B]" size={16} />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-tight text-[#8D788D]">
                          {task.timeSlot}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/track/${task.order_id}`)}
                      className="btn-primary mt-6 w-full py-3 rounded-xl flex items-center justify-center gap-2 font-extrabold uppercase tracking-[0.2em]"
                    >
                      <span className="text-[11px]">Live Track Status</span>
                      <IoChevronForward size={14} className="text-white/80" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
        <div className="h-10" />
      </div>
    </div>
  );
}

