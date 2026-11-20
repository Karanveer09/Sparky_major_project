import express from "express";
import { connects } from "../dbconfig/dbconfig.js";
import Task from "../models/task.js";
import Order from "../models/Order.js";
import { generateInvoice } from "../lib/generateInvoice.js";
import { supabase } from "../lib/supabase.js";
import { sendWhatsAppMessage } from "../lib/twilio.js";

const router = express.Router();

const normalizePhone = (phone) => {
  if (phone.startsWith("+")) return phone;
  return `+91${phone}`;
};

// POST /api/orders (Create Order)
router.post("/orders", async (req, res) => {
  try {
    await connects();
    const body = req.body;

    if (
      !body.customerName ||
      !body.phone ||
      !body.address ||
      !body.pincode ||
      !body.date ||
      !body.timeSlot ||
      !Array.isArray(body.cart) ||
      body.cart.length === 0
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const serviceOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const task = await Task.create({
      ...body,
      paymentMethod: body.paymentMethod || "Pay After Service",
      serviceOtp: {
        code: serviceOtp,
        verified: false,
        generatedAt: new Date(),
      },
    });

    const customerPhone = normalizePhone(body.phone);
    const workerPhone = "+918195060669";
    const cartText = body.cart.map((item) => `${item.name || item.title} (${item.qty || item.quantity || 1})`).join(", ");

    try {
      await sendWhatsAppMessage(customerPhone, `ORDER CONFIRMED\nCustomer: ${body.customerName}\nService: ${cartText}`);
    } catch (err) {
      console.warn("Customer WhatsApp failed:", err.message);
    }

    try {
      await sendWhatsAppMessage(workerPhone, `NEW TASK\nCustomer: ${body.customerName}\nService: ${cartText}`);
    } catch (err) {
      console.warn("Worker WhatsApp failed:", err.message);
    }

    let invoiceUrl = null;
    try {
      const pdfBuffer = await generateInvoice(task.toObject());
      if (Buffer.isBuffer(pdfBuffer) && supabase?.storage) {
        const fileName = `invoice-${task.order_id}.pdf`;
        const { error } = await supabase.storage.from("invoices").upload(fileName, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

        if (!error) {
          const { data } = supabase.storage.from("invoices").getPublicUrl(fileName);
          invoiceUrl = data?.publicUrl;
          await Task.findByIdAndUpdate(task._id, { invoiceUrl, invoiceGeneratedAt: new Date() });
        }
      }
    } catch (invErr) {
      console.warn("Invoice generation warning:", invErr.message);
    }

    return res.status(201).json({ success: true, orderId: task.order_id, invoiceUrl });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:orderId
router.get("/orders/:orderId", async (req, res) => {
  try {
    await connects();
    const { orderId } = req.params;
    const task = await Task.findOne({ order_id: orderId });

    if (!task) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({ task });
  } catch (err) {
    console.error("Fetch order error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/orders/by-phone
router.post("/orders/by-phone", async (req, res) => {
  try {
    const { phone } = req.body;
    await connects();
    const query = phone ? { phone } : {};
    const orders = await Task.find(query).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("orders by phone error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/orders/cancel
router.post("/orders/cancel", async (req, res) => {
  try {
    await connects();
    const { orderId } = req.body;

    const task = await Task.findOne({ order_id: orderId });
    if (!task) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (task.is_completed || task.is_canceled) {
      return res.status(400).json({ error: "Order cannot be canceled" });
    }

    task.is_canceled = true;
    task.status = "Canceled";
    await task.save();

    return res.json({ success: true });
  } catch (err) {
    console.error("Cancel error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/order/cancel (Single order cancellation in Order collection)
router.post("/order/cancel", async (req, res) => {
  try {
    const { orderId } = req.body;
    await connects();

    const order = await Order.findById(orderId);
    if (!order || order.isDispatched) {
      return res.status(400).json({ success: false, message: "Cannot cancel" });
    }

    await Order.findByIdAndDelete(orderId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders/add-addon
router.post("/orders/add-addon", async (req, res) => {
  try {
    await connects();
    const { orderId, addon } = req.body;

    if (!orderId || !addon?.name || !addon?.price) {
      return res.status(400).json({ message: "Invalid add-on data" });
    }

    const task = await Task.findOne({ order_id: orderId });
    if (!task) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (task.is_completed || task.is_canceled) {
      return res.status(400).json({ message: "Cannot modify this order" });
    }

    task.cart.push({
      name: addon.name,
      price: addon.price,
      quantity: addon.quantity || 1,
      category: "addon",
      earning: addon.earning,
      profit: addon.profit,
    });

    const subtotal = task.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal * 0.1;
    const total = subtotal - discount;

    task.subtotal = subtotal;
    task.discount = discount;
    task.total = total;

    await task.save();

    return res.json({
      success: true,
      message: "Add-on added successfully",
      task,
    });
  } catch (err) {
    console.error("Add-on Error:", err);
    return res.status(500).json({ message: err.message || "Server Error" });
  }
});

export default router;

