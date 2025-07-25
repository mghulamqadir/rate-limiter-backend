import { Router } from "express";
import { configAdmin, getStatus, requestClient } from "../controllers/rate_limiter.controller.js";

const router = Router();
router.post("/configure", configAdmin);
router.get("/status/:client_id", getStatus);
router.get("/request/:client_id", requestClient);

export default router;