import express from "express";
import nodemailer from "nodemailer";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

// POST /api/sendEmail
router.post("/sendEmail", async (req, res) => {
  try {
    const { name, email, orderDetails, total } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Sparky" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Sparky Order Confirmation 💅",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #002366;">Thank you for your order, ${name}!</h2>
          <p>We’ve received your order and are getting it ready.</p>
          <p>Total: ₹${total}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/test-upload
router.get("/test-upload", async (req, res) => {
  try {
    if (!supabase?.storage) {
      return res.json({ status: "Supabase not configured" });
    }
    const { data, error } = await supabase.storage.from("invoices").upload("test.txt", "HELLO");
    return res.json({ data, error });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

