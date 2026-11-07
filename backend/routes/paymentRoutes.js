import express from "express";
import { testDarajaConnection } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/test-connection", testDarajaConnection);

export default router;
