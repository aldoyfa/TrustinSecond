import express from "express"
import {
    addToCart,
    getAllCart,
    updateCartItem,
    deleteCartItem
 } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js"

const router = express.Router();

router.use(verifyToken)
router.post("/", addToCart);
router.get("/", getAllCart);
router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);

export default router