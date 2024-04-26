import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/verify/:verificationToken", authController.verify);
router.post("/verify", authController.resendEmail);
router.post("/logout", authMiddleware, authController.logout);

export default router;
