import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookForm({ service, onClose }) {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [time, settime] = useState("");
  const [date, setdate] = useState("");
  const [phone, setphone] = useState("");
  const [error, seterror] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !name || !address || !date || !time) {
      seterror("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          date,
          timeSlot: time,
          pincode: "143001",
          cart: [
            {
              name: service.title || service.name,
              price: service.price,
              quantity: 1,
            },
          ],
        }),
      });

      if (res.ok) {
        seterror("");
        alert("Booking Confirmed!");
        navigate("/bookings");
      } else {
        seterror("Booking failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      seterror("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-white sm:bg-white/40 backdrop-blur-none sm:backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white border p-6 rounded-lg shadow-xl mt-[17px] w-[95%] h-[90%] sm:h-[60%] sm:w-[750px] relative flex flex-col sm:flex-row gap-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <div className="flex-1 bg-white/20 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3 text-gray-800">
            Book: {service?.title || service?.name}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              onChange={(e) => setname(e.target.value)}
              type="text"
              placeholder="Your Name"
              className="border p-2 rounded"
            />
            <input
              onChange={(e) => setphone(e.target.value)}
              type="text"
              placeholder="Phone Number"
              className="border p-2 rounded"
            />
            <input
              onChange={(e) => setaddress(e.target.value)}
              type="text"
              placeholder="Address"
              className="border p-2 rounded"
            />
            <label htmlFor="date">Date</label>
            <input
              onChange={(e) => setdate(e.target.value)}
              type="date"
              name="date"
              id="date"
              className="border p-2 rounded"
            />
            <label htmlFor="time">Time</label>
            <input
              onChange={(e) => settime(e.target.value)}
              type="time"
              name="time"
              id="time"
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#1e263b] to-[#3a3954] text-white py-2 rounded hover:bg-gradient-to-l"
            >
              Confirm Booking
            </button>
            {error && <div className="text-white bg-red-500 p-3 rounded">{error}</div>}
          </form>
        </div>

        <div className="flex-1 flex flex-col items-center text-center bg-white/20 p-4 rounded-lg">
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
            <img
              src={service?.image || "/images/placeholder.jpg"}
              alt={service?.title || "Service"}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{service?.title || service?.name}</h3>
          <p className="text-gray-700 text-sm mt-1">{service?.description}</p>
          <p className="text-[#1e263b] font-semibold text-base mt-2">₹ {service?.price}</p>
        </div>
      </div>
    </div>
  );
}

