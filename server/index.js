import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connects } from "./dbconfig/dbconfig.js";

// Routes
import authRoutes from "./routes/auth.js";
import otpRoutes from "./routes/otp.js";
import servicesRoutes from "./routes/services.js";
import ordersRoutes from "./routes/orders.js";
import tasksRoutes from "./routes/tasks.js";
import paymentsRoutes from "./routes/payments.js";
import workersRoutes from "./routes/workers.js";
import contactRoutes from "./routes/contact.js";
import invoiceRoutes from "./routes/invoice.js";
import miscRoutes from "./routes/misc.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connects()
  .then(() => console.log("✅ MongoDB Connected to Sparky Database"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Mount API routes
app.use("/api", authRoutes);
app.use("/api", otpRoutes);
app.use("/api", servicesRoutes);
app.use("/api", ordersRoutes);
app.use("/api", tasksRoutes);
app.use("/api", paymentsRoutes);
app.use("/api", workersRoutes);
app.use("/api", contactRoutes);
app.use("/api", invoiceRoutes);
app.use("/api", miscRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Production: Serve React client build ---
const clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));

// SPA fallback: any non-API route serves index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Sparky Express Server running on port ${PORT}`);
});

