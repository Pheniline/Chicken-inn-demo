import axios from "axios";
import Order from "../models/Order.js";

// ==========================================
// 1. TEST DARAJA CONNECTION
// ==========================================

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

// ==========================================
// 2. INITIATE M-PESA STK PUSH
// ==========================================

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

    if (order.checkoutRequestId) {
      return res.status(400).json({
        message: "A payment request has already been submitted for this order.",
      });
    }

    // Format Kenyan phone number
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

    const consumerKey = process.env.DARAJA_CONSUMER_KEY;
    const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
    const shortcode = process.env.DARAJA_SHORTCODE;
    const passkey = process.env.DARAJA_PASSKEY;
    const callbackUrl = process.env.DARAJA_CALLBACK_URL;

    if (
      !consumerKey ||
      !consumerSecret ||
      !shortcode ||
      !passkey ||
      !callbackUrl ||
      !callbackUrl.startsWith("https://")
    ) {
      return res.status(500).json({
        message: "Daraja configuration is incomplete.",
      });
    }

    // Generate OAuth access token
    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
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

    if (!accessToken) {
      throw new Error("Daraja access token was not returned.");
    }

    // Generate timestamp
    const date = new Date();

    const timestamp =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      String(date.getHours()).padStart(2, "0") +
      String(date.getMinutes()).padStart(2, "0") +
      String(date.getSeconds()).padStart(2, "0");

    // Generate STK password
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      "base64",
    );

    // Validate order amount
    const amount = Math.round(order.total);

    if (!Number.isSafeInteger(amount) || amount < 1) {
      return res.status(400).json({
        message: "The order amount is invalid.",
      });
    }

    // Send STK Push request
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

    // Save payment request details
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

// ==========================================
// 3. PROCESS M-PESA CALLBACK
// ==========================================

export const mpesaCallback = async (req, res) => {
  try {
    // NEW: Log every incoming callback request
    console.log("========== MPESA CALLBACK ARRIVED ==========");
    console.log("Request method:", req.method);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const stkCallback = req.body?.Body?.stkCallback;

    if (!stkCallback) {
      console.error("Invalid M-Pesa callback structure.");

      return res.status(400).json({
        message: "Invalid callback structure.",
      });
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = Number(stkCallback.ResultCode);

    if (!checkoutRequestId || !Number.isInteger(resultCode)) {
      return res.status(400).json({
        message: "Callback is missing required information.",
      });
    }

    console.log(
      "M-Pesa callback received:",
      checkoutRequestId,
      stkCallback.ResultDesc,
    );

    const order = await Order.findOne({
      checkoutRequestId,
    });

    if (!order) {
      console.error("No order found for checkout request:", checkoutRequestId);

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received.",
      });
    }

    // Prevent duplicate successful callbacks
    if (order.paymentStatus === "Completed") {
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Payment already processed.",
      });
    }

    // Handle failed or cancelled payment
    if (resultCode !== 0) {
      order.paymentStatus = "Failed";
      order.mpesaResultDescription =
        stkCallback.ResultDesc || "Payment failed or cancelled.";

      await order.save();

      console.log("Payment failed or cancelled:", stkCallback.ResultDesc);

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Payment failure recorded.",
      });
    }

    // Extract successful payment details
    const items = stkCallback.CallbackMetadata?.Item || [];

    const getValue = (name) => items.find((item) => item.Name === name)?.Value;

    const amount = Number(getValue("Amount"));
    const receipt = getValue("MpesaReceiptNumber");
    const phone = String(getValue("PhoneNumber") || "");

    // Verify payment details against the order
    if (
      !receipt ||
      !Number.isFinite(amount) ||
      amount !== Math.round(order.total) ||
      phone !== order.paymentPhone
    ) {
      console.error("Payment details require verification:", checkoutRequestId);

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Payment details require verification.",
      });
    }

    // Record successful payment
    order.paymentStatus = "Completed";
    order.status = "Paid";
    order.mpesaReceiptNumber = receipt;
    order.mpesaResultDescription =
      stkCallback.ResultDesc || "Payment completed successfully.";

    await order.save();

    console.log("Payment completed successfully:", receipt);

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Payment processed successfully.",
    });
  } catch (error) {
    console.error(
      "M-Pesa callback error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      message: "Callback processing failed.",
    });
  }
};
