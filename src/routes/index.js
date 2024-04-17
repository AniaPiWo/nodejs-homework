import { Router } from "express";
import contactRouter from "./contactRoutes.js";
import authRouter from "./authRoutes.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use("/contacts", contactRouter);
//router.use("/contacts", authMiddleware, contactRouter);
router.use("/users", authRouter);

export default router;
