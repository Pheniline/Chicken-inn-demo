import axios from "axios";
import Order from "../models/Order.js";

// 1. Test Daraja authentication
export const testDarajaConnection = async (req, res) => {
  try {
    const consumerKey = process.env.DARAJA_CONSUMER_KEY;
    const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      return res.status(500).json({
        message: "Daraja credentials are missing from the environment.",
      });
    }

    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
    ).toString("base64");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    if (!response.data.access_token) {
      throw new Error("No access token returned.");
    }

    return res.status(200).json({
      message: "Successfully connected to Daraja Sandbox!",
    });
  } catch (error) {
    console.error(
      "Daraja connection error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      message: "Could not connect to Daraja Sandbox.",
    });
  }
};

// 2. Initiate M-Pesa STK Push
export const initiateStkPush = async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    if (!orderId || !phone) {
      return res.status(400).json({
        message: "Order ID and phone number are required.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      customerId: req.customer._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.paymentStatus === "Completed") {
      return res.status(400).json({
        message: "This order has already been paid.",
      });
    }

    let formattedPhone = phone.replace(/\s+/g, "");

    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("+254")) {
      formattedPhone = formattedPhone.slice(1);
    }

    if (!/^254[17]\d{8}$/.test(formattedPhone)) {
      return res.status(400).json({
        message: "Enter a valid Kenyan phone number.",
      });
    }

    const credentials = Buffer.from(
      `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`,
    ).toString("base64");

    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    const accessToken = tokenResponse.data.access_token;

    const date = new Date();

    const timestamp =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      String(date.getHours()).padStart(2, "0") +
      String(date.getMinutes()).padStart(2, "0") +
      String(date.getSeconds()).padStart(2, "0");

    const shortcode = process.env.DARAJA_SHORTCODE;
    const passkey = process.env.DARAJA_PASSKEY;

    if (!shortcode || !passkey) {
      return res.status(500).json({
        message: "Daraja shortcode or passkey is missing.",
      });
    }

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      "base64",
    );

    const amount = Math.round(order.total);

    if (!Number.isSafeInteger(amount) || amount < 1) {
      return res.status(400).json({
        message: "The order amount is invalid.",
      });
    }

    const callbackUrl = process.env.DARAJA_CALLBACK_URL;

    if (!callbackUrl || !callbackUrl.startsWith("https://")) {
      return res.status(500).json({
        message: "A public HTTPS callback URL is not configured.",
      });
    }

    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `ORDER-${order._id.toString().slice(-8)}`,
        TransactionDesc: "Chicken Inn Order Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (
      stkResponse.data.ResponseCode !== "0" ||
      !stkResponse.data.CheckoutRequestID
    ) {
      return res.status(502).json({
        message:
          stkResponse.data.ResponseDescription ||
          "Safaricom did not accept the payment request.",
      });
    }

    order.checkoutRequestId = stkResponse.data.CheckoutRequestID;
    order.merchantRequestId = stkResponse.data.MerchantRequestID;
    order.paymentPhone = formattedPhone;

    await order.save();

    return res.status(200).json({
      message: stkResponse.data.CustomerMessage || "Payment request submitted.",
      checkoutRequestId: stkResponse.data.CheckoutRequestID,
    });
  } catch (error) {
    console.error("STK Push error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Could not initiate M-Pesa payment.",
    });
  }
};
// 3. Receive M-Pesa payment callback
export const mpesaCallback = async (req, res) => {
  try {
    console.log("M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Callback received successfully",
    });
  } catch (error) {
    console.error("Callback error:", error.message);

    return res.status(500).json({
      message: "Callback processing failed",
    });
  }
};
