import express from "express";
import { connects } from "../dbconfig/dbconfig.js";
import Task from "../models/task.js";

const router = express.Router();

// POST /api/tasks (fetch tasks by email)
router.post("/tasks", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    await connects();
    const tasks = await Task.find({ email }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error("Task list error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tasks/cancel
router.post("/tasks/cancel", async (req, res) => {
  try {
    await connects();
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const task = await Task.findOne({ order_id: orderId });
    if (!task) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (task.is_completed || task.is_approved) {
      return res.status(400).json({
        success: false,
        message: "This order is already approved or completed and cannot be cancelled",
      });
    }

    task.is_canceled = true;
    task.status = "Canceled";
    await task.save();

    return res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Cancel order error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

