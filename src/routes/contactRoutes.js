// Routes define how HTTP requests are routed to the appropriate controllers.

import { Router } from "express";
import * as contactController from "../controllers/contactController.js";
import paginatedResults from "../config/pagination.js";
import { Contact } from "../models/contactModel.js";

const router = Router();

router.get("/", paginatedResults(Contact), contactController.getAll);
router.get("/favourites", contactController.getFavourites);
router.get("/:id", contactController.getById);
router.post("/", contactController.createContact);
router.put("/:id", contactController.updateById);
router.patch("/:id", contactController.updateById);
router.delete("/:id", contactController.deleteById);

export default router;
