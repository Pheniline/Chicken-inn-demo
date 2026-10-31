import express from "express";

const router = express.Router();

// Temporary menu data
const menuItems = [
  {
    id: 1,
    name: "Crispy Chicken",
    price: 450,
    category: "Chicken",
  },
  {
    id: 2,
    name: "Chicken Burger",
    price: 550,
    category: "Burgers",
  },
  {
    id: 3,
    name: "French Fries",
    price: 200,
    category: "Sides",
  },
];

// GET all menu items
router.get("/", (req, res) => {
  res.json(menuItems);
});

export default router;
