import express from "express";
import {
  Checkout,
  getAllinvoice,
  getInvoicebyId,
  getInvoicebyuseremail,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.use(verifyToken);

router.post("/checkout", Checkout);
router.get("/", getAllinvoice);
router.get("/user/:email", getInvoicebyuseremail);
router.get("/:id", getInvoicebyId);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;