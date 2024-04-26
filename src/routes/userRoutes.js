import express from "express";
import * as userController from "../controllers/userController.js";
import { upload, tempDir, storeImageDir } from "../middleware/multer.js";

const router = express.Router();

router.get("/myaccount", userController.myAccount);
router.patch("/subscription", userController.updateSubscription);
router.patch("/avatar", upload.single("avatar"), userController.updateAvatar);

export default router;
