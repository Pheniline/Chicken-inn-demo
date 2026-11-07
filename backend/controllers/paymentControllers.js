import axios from "axios";

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
      throw new Error("Safaricom did not return an access token.");
    }

    res.status(200).json({
      message: "Successfully connected to Daraja Sandbox!",
    });
  } catch (error) {
    console.error(
      "Daraja connection error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      message:
        "Could not connect to Daraja Sandbox. Check your credentials and app permissions.",
    });
  }
};
