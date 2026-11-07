import Customer from "../models/Customer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER CUSTOMER
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Check required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create customer
    const customer = await Customer.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully!",
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
};

// LOGIN CUSTOMER
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, customer.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate authentication token
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful!",
      token,
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
};
