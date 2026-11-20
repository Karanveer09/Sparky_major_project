import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReviewPage() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authRes = await fetch("/api/me");
      const authData = await authRes.json();
      if (!authData?.user) {
        alert("You must be logged in to submit a review.");
        navigate("/login");
        return;
      }

      const res = await fetch(`/api/services/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          userId: authData.user._id || authData.user.id,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Review added successfully!");
        setRating(0);
        setComment("");
      } else {
        setSuccess(`Error: ${data.message || "Failed to submit review"}`);
      }
    } catch (err) {
      setSuccess("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F3] pt-12 px-4">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-2xl border border-[#F1DFE8]">
        <h1 className="text-2xl font-bold mb-4 text-[#2B1B2E]">Leave a Review</h1>

        <div className="flex mb-4 gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-3xl ${
                rating >= star ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          rows={4}
          className="border border-[#F1DFE8] w-full p-3 rounded-xl mb-4 text-sm focus:outline-none focus:border-[#C2306B]"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || rating === 0}
          className="btn-primary w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

        {success && <p className="mt-4 text-green-600 text-sm font-semibold">{success}</p>}
      </div>
    </div>
  );
}

