import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/current", userController.getCurrentUser);
router.patch("/subscription", userController.updateSubscription);

export default router;
