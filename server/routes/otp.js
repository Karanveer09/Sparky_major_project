import express from "express";
import twilio from "twilio";
import nodemailer from "nodemailer";
import { SignJWT } from "jose";
import { connects } from "../dbconfig/dbconfig.js";
import Otp from "../models/Otp.js";
import User from "../models/usermodel.js";

const router = express.Router();
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "sparky_jwt_secret_fallback_key_2026"
);

const twilioClient = twilio(
  process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH || process.env.TWILIO_AUTH_TOKEN
);

const normalizePhone = (phone) =>
  phone.replace("whatsapp:", "").replace(/\D/g, "").slice(-10);

const normalizeEmail = (email) => email.trim().toLowerCase();

// POST /api/send-otp
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone required" });
    }
    await connects();

    const normalized = normalizePhone(phone);
    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.deleteMany({ phone: normalized });
    await Otp.create({
      phone: normalized,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("OTP SAVED IN DB:", normalized, otp);

    try {
      await twilioClient.messages.create({
        from: process.env.TWILIO_PHONE || process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:+91${normalized}`,
        body: `🔐 Your login OTP is ${otp}. It expires in 5 minutes.`,
      });
    } catch (twErr) {
      console.warn("Twilio send warning:", twErr.message);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// POST /api/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP required" });
    }

    const normalized = normalizePhone(phone);
    await connects();

    const record = await Otp.findOne({ phone: normalized });
    if (!record) {
      return res.status(400).json({ error: "OTP not found" });
    }

    if (Date.now() > record.expiresAt.getTime()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.otp !== String(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await Otp.deleteOne({ _id: record._id });

    let user = await User.findOne({ phone: normalized });
    if (!user) {
      user = await User.create({ phone: normalized });
    }

    const token = await new SignJWT({
      userId: user._id.toString(),
      phone: user.phone,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(SECRET);

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/send-email-otp
router.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await connects();
    const normalized = normalizeEmail(email);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email: normalized });
    await Otp.create({
      email: normalized,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Sparky" <${process.env.EMAIL_USER}>`,
      to: normalized,
      subject: "Your Sparky verification code",
      html: `
        <div style="font-family: Arial, sans-serif; color:#111;">
          <p style="font-size:16px; margin:0;">Your Sparky verification code is:</p>
          <h2 style="margin:10px 0; letter-spacing:4px; font-size:28px; color:#1A2421;">${otp}</h2>
          <p style="font-size:14px; color:#555;">This code expires in 5 minutes.</p>
        </div>
      `,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Email OTP Error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

// POST /api/verify-email-otp
router.post("/verify-email-otp", async (req, res) => {
  try {
    const { email, otp, phone } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Missing data" });
    }

    await connects();
    const normalized = normalizeEmail(email);
    const record = await Otp.findOne({ email: normalized });

    if (!record) {
      return res.status(400).json({ error: "OTP not found" });
    }

    if (Date.now() > record.expiresAt) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ error: "OTP expired" });
    }

    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await Otp.deleteOne({ _id: record._id });

    let user = await User.findOne({ email: normalized });
    if (!user) {
      user = await User.create({ email: normalized, phone });
    }

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(SECRET);

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({ success: true, user });
  } catch (err) {
    console.error("VERIFY EMAIL OTP ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

