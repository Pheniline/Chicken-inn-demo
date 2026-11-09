import Customer from "../models/Customer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate authentication token
function generateToken(customerId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables.");
  }

  return jwt.sign({ id: customerId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

// REGISTER CUSTOMER
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingCustomer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (existingCustomer) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const customer = await Customer.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
    });

    const token = generateToken(customer._id);

    return res.status(201).json({
      message: "Account created successfully!",
      token,
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed.",
    });
  }
};

// LOGIN CUSTOMER
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const customer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (!customer) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(customer._id);

    return res.status(200).json({
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
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed.",
    });
  }
};
