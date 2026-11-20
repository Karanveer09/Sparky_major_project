import express from "express";
import { connects } from "../dbconfig/dbconfig.js";
import Worker from "../models/Worker.js";

const router = express.Router();

const getWorkerPrefix = (category = "") => {
  const c = category.toLowerCase().trim();
  if (c.includes("woman") || c.includes("makeup")) return "MU";
  if (c.includes("event")) return "ED";
  if (c.includes("clean")) return "CL";
  return null;
};

// GET /api/workers
router.get("/workers", async (req, res) => {
  try {
    await connects();
    const category = req.query.category;

    if (!category) {
      return res.status(200).json([]);
    }

    const prefix = getWorkerPrefix(category);
    if (!prefix) {
      return res.status(200).json([]);
    }

    const workers = await Worker.find({
      availability: "AVAILABLE",
      workerId: new RegExp(`^${prefix}`),
    })
      .select("workerId name rating experience availability role")
      .sort({ rating: -1, experience: -1 });

    return res.status(200).json(workers);
  } catch (error) {
    console.error("Error fetching workers:", error);
    return res.status(500).json({ error: "Failed to fetch workers" });
  }
});

// POST /api/workers/rate
router.post("/workers/rate", async (req, res) => {
  try {
    await connects();
    const { workerId, stars } = req.body;

    if (!workerId || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const worker = await Worker.findOne({ workerId });
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const currentCount = worker.rating?.count ?? 0;
    const currentAverage = worker.rating?.average ?? 0;
    const newCount = currentCount + 1;
    const newAverage = (currentAverage * currentCount + stars) / newCount;

    worker.rating = {
      average: Number(newAverage.toFixed(1)),
      count: newCount,
    };

    await worker.save({ validateBeforeSave: false });
    return res.json({ success: true });
  } catch (error) {
    console.error("Rating error:", error);
    return res.status(500).json({ error: "Failed to submit rating" });
  }
});

export default router;

