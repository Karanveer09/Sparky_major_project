import express from "express";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { connects } from "../dbconfig/dbconfig.js";
import User from "../models/usermodel.js";

const router = express.Router();
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "sparky_jwt_secret_fallback_key_2026"
);

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request:", email);
    await connects();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (password && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    }

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
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

    return res.json({ message: "Login success", user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, name, password, email, phone } = req.body;
    await connects();

    let existing = await User.findOne({ $or: [{ email }, { phone: phone || "" }] });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const newUser = await User.create({
      username: username || name,
      email,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "Register success", user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Error occurred while registering" });
  }
});

// POST /api/logout
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res.json({ success: true });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});

// GET /api/me
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.session;
    if (!token) {
      return res.status(401).json({ user: null });
    }

    const { payload } = await jwtVerify(token, SECRET);
    if (!payload?.userId) {
      return res.status(401).json({ user: null });
    }

    await connects();
    const user = await User.findById(payload.userId).select("phone email username");
    if (!user) {
      return res.status(404).json({ user: null });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        phone: user.phone || null,
        email: user.email || null,
        name: user.username || null,
      },
    });
  } catch (error) {
    console.error("ME API ERROR:", error);
    return res.status(401).json({ user: null });
  }
});

// POST /api/userexist
router.post("/userexist", async (req, res) => {
  try {
    await connects();
    const { email } = req.body;
    const user = await User.findOne({ email });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

