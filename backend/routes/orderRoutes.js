import express from "express";

const router = express.Router();

// Temporary orders storage
let orders = [];

// CREATE a new order
router.post("/", (req, res) => {
  const { customer, items, subtotal, deliveryFee, total } = req.body;

  // Basic validation
  if (!customer || !items || items.length === 0) {
    return res.status(400).json({
      message: "Customer details and order items are required.",
    });
  }

  const newOrder = {
    id: Date.now(),
    customer,
    items,
    subtotal,
    deliveryFee,
    total,
    status: "Pending Payment",
    createdAt: new Date(),
  };

  orders.push(newOrder);

  res.status(201).json({
    message: "Order received successfully!",
    order: newOrder,
  });
});

// GET all orders (temporary testing endpoint)
router.get("/", (req, res) => {
  res.json(orders);
});

export default router;
