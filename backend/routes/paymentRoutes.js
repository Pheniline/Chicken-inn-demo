import express from "express";

import {
  testDarajaConnection,
  initiateStkPush,
} from "../controllers/paymentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test-connection", testDarajaConnection);

router.post("/stk-push", protect, initiateStkPush);

export default router;
