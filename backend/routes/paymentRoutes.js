import express from "express";

import {
  testDarajaConnection,
  initiateStkPush,
  mpesaCallback,
} from "../controllers/paymentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test-connection", testDarajaConnection);

router.post("/stk-push", protect, initiateStkPush);
router.post("/callback", mpesaCallback);

export default router;
