import express from "express";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// CREATE A NEW ORDER
// ==========================================

router.post("/", protect, async (req, res) => {
  try {
    const { customer, items, subtotal, deliveryFee, total } = req.body;

    // Validate delivery information
    if (
      !customer ||
      !customer.fullName ||
      !customer.phone ||
      !customer.county ||
      !customer.town ||
      !customer.estate ||
      !customer.building
    ) {
      return res.status(400).json({
        message: "Please complete all required delivery details.",
      });
    }

    // Validate order items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your order must contain at least one item.",
      });
    }

    // Save order in MongoDB
    const newOrder = await Order.create({
      customerId: req.customer._id,

      customer: {
        fullName: customer.fullName,
        phone: customer.phone,
        county: customer.county,
        town: customer.town,
        estate: customer.estate,
        building: customer.building,
        instructions: customer.instructions || "",
      },

      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),

      subtotal,
      deliveryFee,
      total,

      status: "Pending Payment",
      paymentMethod: "M-Pesa",
      paymentStatus: "Pending",
    });

    return res.status(201).json({
      message: "Order saved successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Could not save your order.",
      error: error.message,
    });
  }
});

// ==========================================
// GET CUSTOMER ORDERS
// ==========================================

router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.customer._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);

    return res.status(500).json({
      message: "Could not retrieve orders.",
    });
  }
});

export default router;
