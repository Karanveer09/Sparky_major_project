import express from "express";
import Razorpay from "razorpay";
import { connects } from "../dbconfig/dbconfig.js";
import Order from "../models/Order.js";

const router = express.Router();

// POST /api/razorpay
router.post("/razorpay", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.json({ success: true, order: { id: "order_mock_" + Date.now(), amount: amount * 100 } });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      payment_capture: 1,
    });

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Razorpay Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/save-order
router.post("/save-order", async (req, res) => {
  try {
    await connects();
    const body = req.body;
    console.log("Received save-order:", body);

    const { name, phone, address, paymentMethod, total, discount, tax, delivery, subtotal, products, email } = body;

    if (!email || !products || products.length === 0) {
      return res.status(400).json({ success: false, error: "Missing email or products" });
    }

    const savedOrder = await Order.create({
      name,
      phone,
      address,
      paymentMethod,
      total,
      discount,
      tax,
      delivery,
      subtotal,
      products,
      email: email.toLowerCase(),
    });

    return res.json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Failed to save order:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

