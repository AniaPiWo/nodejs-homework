import { Router } from "express";
import contactRouter from "./contactRoutes.js";
import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", authMiddleware, userRouter);
router.use("/contacts", authMiddleware, contactRouter);

export default router;
