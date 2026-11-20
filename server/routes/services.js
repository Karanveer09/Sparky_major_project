import express from "express";
import mongoose from "mongoose";
import { connects } from "../dbconfig/dbconfig.js";
import Service from "../models/servicemodel.js";
import Task from "../models/task.js";

const router = express.Router();

// GET /api/services
router.get("/services", async (req, res) => {
  try {
    await connects();
    const services = await Service.find();
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
});

// GET /api/services/cleaning
router.get("/services/cleaning", async (req, res) => {
  try {
    await connects();
    const services = await Service.find({ category: "Cleaning" });
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching cleaning services:", error);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
});

// GET /api/services/facial
router.get("/services/facial", async (req, res) => {
  try {
    await connects();
    const services = await Service.find({ category: "Woman Services" });
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching facial services:", error);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
});

// GET /api/services/event
router.get("/services/event", async (req, res) => {
  try {
    await connects();
    const services = await Service.find({ category: "Event Decor" });
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching event decor services:", error);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
});

// POST /api/services/review
router.post("/services/review", async (req, res) => {
  try {
    const { orderId, userId, comment, rating } = req.body;
    await connects();

    const task = await Task.findOne({ order_id: orderId });
    if (!task) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Review recorded successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ message: "Error adding review" });
  }
});

// GET /api/service
router.get("/service", async (req, res) => {
  try {
    await connects();
    const services = await Service.find();
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch services" });
  }
});

// GET /api/service/:id
router.get("/service/:id", async (req, res) => {
  try {
    await connects();
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    return res.json(service);
  } catch (error) {
    console.error("Error in GET service:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;

