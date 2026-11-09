import axios from "axios";
import Order from "../models/Order.js";

// Get an access token from Safaricom Daraja
const getAccessToken = async () => {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64",
  );

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    },
  );

  return response.data.access_token;
};

// Test Daraja connection
export const testDarajaConnection = async (req, res) => {
  try {
    await getAccessToken();

    res.status(200).json({
      message: "Successfully connected to Daraja Sandbox!",
    });
  } catch (error) {
    console.error(
      "Daraja connection error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      message: "Could not connect to Daraja Sandbox",
    });
  }
};

// Initiate M-Pesa STK Push
export const initiateStkPush = async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    if (!orderId || !phone) {
      return res.status(400).json({
        message: "Order ID and phone number are required.",
      });
    }

    const order = await Order.findById(orderId);

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
        message: "An M-Pesa payment request already exists for this order.",
      });
    }

    const formattedPhone = phone.replace(/\D/g, "");

    if (!/^254[17]\d{8}$/.test(formattedPhone)) {
      return res.status(400).json({
        message: "Enter a valid Kenyan phone number beginning with 254.",
      });
    }

    const accessToken = await getAccessToken();

    const shortcode = process.env.DARAJA_SHORTCODE;
    const passkey = process.env.DARAJA_PASSKEY;

    const timestamp = new Date()
      .toLocaleString("en-GB", {
        timeZone: "Africa/Nairobi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\D/g, "");

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      "base64",
    );

    const amount = Math.round(order.total);

    if (amount < 1) {
      return res.status(400).json({
        message: "Invalid payment amount.",
      });
    }

    const callbackUrl = process.env.DARAJA_CALLBACK_URL;

    if (!callbackUrl) {
      return res.status(500).json({
        message:
          "M-Pesa callback URL is missing from the environment configuration.",
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
        AccountReference: `CI-${order._id.toString().slice(-8)}`,
        TransactionDesc: "Chicken Inn Order Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = stkResponse.data;

    console.log("STK Push response:", result);

    if (result.ResponseCode !== "0" || !result.CheckoutRequestID) {
      return res.status(400).json({
        message: result.ResponseDescription || "M-Pesa request failed.",
      });
    }

    order.checkoutRequestId = result.CheckoutRequestID;
    order.merchantRequestId = result.MerchantRequestID;
    order.paymentPhone = formattedPhone;

    await order.save();

    return res.status(200).json({
      message: "Success. Request accepted for processing",
      checkoutRequestId: result.CheckoutRequestID,
    });
  } catch (error) {
    console.error("STK Push error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Could not initiate M-Pesa payment.",
      error: error.response?.data || error.message,
    });
  }
};

// Receive Safaricom payment callback
export const mpesaCallback = async (req, res) => {
  console.log("========== MPESA CALLBACK ARRIVED ==========");
  console.log("Request method:", req.method);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const callback = req.body?.Body?.stkCallback;

    if (!callback) {
      console.log("Invalid or missing callback data.");

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received.",
      });
    }

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    const resultDescription = callback.ResultDesc;

    console.log("Checkout Request ID:", checkoutRequestId);
    console.log("Result Code:", resultCode);
    console.log("Result Description:", resultDescription);

    const order = await Order.findOne({ checkoutRequestId });

    if (!order) {
      console.log("No order found for this checkout request.");

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received.",
      });
    }

    // Ignore duplicate successful callbacks
    if (order.paymentStatus === "Completed") {
      console.log("Payment was already processed.");

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback already processed.",
      });
    }

    // Payment was cancelled or failed
    if (resultCode !== 0) {
      order.paymentStatus = "Failed";
      order.mpesaResultDescription = resultDescription;

      await order.save();

      console.log("Payment failed or was cancelled.");

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback processed.",
      });
    }

    // Extract successful payment details
    const items = callback.CallbackMetadata?.Item || [];

    const getMetadataValue = (name) =>
      items.find((item) => item.Name === name)?.Value;

    const amount = getMetadataValue("Amount");
    const receiptNumber = getMetadataValue("MpesaReceiptNumber");
    const phoneNumber = getMetadataValue("PhoneNumber");

    console.log("Paid amount:", amount);
    console.log("M-Pesa receipt:", receiptNumber);
    console.log("Payment phone:", phoneNumber);

    // Verify the returned payment details
    if (
      amount == null ||
      !receiptNumber ||
      Number(amount) !== Math.round(order.total) ||
      String(phoneNumber) !== String(order.paymentPhone)
    ) {
      order.paymentStatus = "Failed";
      order.mpesaResultDescription = "Payment details did not match the order.";

      await order.save();

      console.log("Payment details did not match the order.");

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback processed.",
      });
    }

    // Mark order as paid
    order.paymentStatus = "Completed";
    order.status = "Paid";
    order.mpesaReceiptNumber = receiptNumber;
    order.mpesaResultDescription = resultDescription;

    await order.save();

    console.log("========== PAYMENT SUCCESSFUL ==========");
    console.log("Order ID:", order._id);
    console.log("Receipt:", receiptNumber);

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Payment processed successfully.",
    });
  } catch (error) {
    console.error(
      "M-Pesa callback processing error:",
      error.response?.data || error.message,
    );

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Callback received.",
    });
  }
};
