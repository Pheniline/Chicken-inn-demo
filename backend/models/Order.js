import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Customer who placed the order
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // Customer delivery information
    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
      },
      county: {
        type: String,
        required: true,
      },
      town: {
        type: String,
        required: true,
      },
      estate: {
        type: String,
        required: true,
      },
      building: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
        default: "",
      },
    },

    // Food items
    items: [
      {
        id: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // M-Pesa information
    checkoutRequestId: {
      type: String,
      default: null,
    },
    merchantRequestId: {
      type: String,
      default: null,
    },
    paymentPhone: {
      type: String,
      default: null,
    },

    // Financial details
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order progress
    status: {
      type: String,
      enum: [
        "Pending Payment",
        "Paid",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending Payment",
    },

    // Payment details
    paymentMethod: {
      type: String,
      enum: ["M-Pesa", "Cash"],
      default: "M-Pesa",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    mpesaReceiptNumber: {
      type: String,
      default: null,
    },
    mpesaResultDescription: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Create the Mongoose model
const Order = mongoose.model("Order", orderSchema);

// Temporary diagnostic checks
console.log("Model name:", Order.modelName);
console.log("Find method:", typeof Order.find);
console.log("Create method:", typeof Order.create);

export default Order;
