import express from "express"
import {
    addToCart,
    getAllCart
 } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js"

const router = express.Router();

router.use(verifyToken)
router.post("/", addToCart);
router.get("/", getAllCart);

export default router