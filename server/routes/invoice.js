import express from "express";
import { connects } from "../dbconfig/dbconfig.js";
import Task from "../models/task.js";
import { generateInvoice } from "../lib/generateInvoice.js";

const router = express.Router();

// GET /api/invoice/:orderId
router.get("/invoice/:orderId", async (req, res) => {
  try {
    await connects();
    const task = await Task.findOne({ order_id: req.params.orderId });

    if (!task) {
      return res.status(404).send("Invoice not found");
    }

    const pdfBuffer = await generateInvoice({
      ...task.toObject(),
      cart: task.cart || [],
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Invoice-${req.params.orderId}.pdf`);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error("Invoice error:", err);
    return res.status(500).send("Failed to generate invoice");
  }
});

export default router;

