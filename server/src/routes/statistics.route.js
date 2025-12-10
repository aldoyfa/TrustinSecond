import express from "express";
import { getRange, getSingle } from "../controllers/statistics.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.use(verifyToken);

// Semua endpoint dilindungi oleh JWT
router.get("/range", getRange);
router.get("/single", getSingle);

export default router