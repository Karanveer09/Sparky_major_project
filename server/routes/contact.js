import express from "express";
import { connects } from "../dbconfig/dbconfig.js";
import Contact from "../models/contact.js";
import Newsletter from "../models/newsletter.js";

const router = express.Router();

// POST /api/contact
router.post("/contact", async (req, res) => {
  try {
    await connects();
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const contact = await Contact.create({ firstName, lastName, email, message });
    return res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/newsletter
router.post("/newsletter", async (req, res) => {
  try {
    await connects();
    const { email, subscribed } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already subscribed" });
    }

    const sub = await Newsletter.create({ email, subscribed: subscribed ?? true });
    return res.status(201).json({ success: true, data: sub });
  } catch (error) {
    console.error("Newsletter error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

