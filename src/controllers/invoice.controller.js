import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const Checkout = async (req,res) => {
    const { email, name, phone } = req.body;

    //get cart current user logged in
    const carts = await prisma.cart.findMany({
        where: { userId: req.user.id },
        include: { product: true }
    })

    if (carts.length === 0) {
        return errorResponse(res, 'Cart is empty')
    }

    const items = carts.map(c => `${c.product.name} x ${c.quantity}`).join(', ');
    const total = carts.reduce((sum, item) => sum + item.total, 0);

    const invoice = await prisma.invoice.create({
        data: {
          email,
          name,
          phone,
          date: new Date(),
          items,
          total,
          userId: req.user.id
        }
    });

    // Update product stock for each item in cart
    for (const cart of carts) {
        await prisma.product.update({
            where: { id: cart.productId },
            data: {
                stock: {
                    decrement: cart.quantity
                }
            }
        });
    }

    //hapus cart hanya milik user ini
    await prisma.cart.deleteMany({
        where: { userId: req.user.id }
    })

    return successResponse(res, 'Checkout Successful', invoice);
}
// Get all invoices
export const getAllinvoice = async (req, res) => {
    try {
      const data = await prisma.invoice.findMany();
      return successResponse(res, 'Get all invoices', data );
    } catch (err) {
      return errorResponse(res, 'Failed get Invoice');
    }
}
  
// Get invoice by ID
export const getInvoicebyId = async (req, res) => {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: req.params.id }
      });
  
      if (!invoice) {
        return errorResponse(res, 'Invoice not found');
  
      }
  
      return successResponse(res, 'Get invoice by ID successful', invoice );
  
    } catch (err) {
      return errorResponse(res, 'get invoice by id fail', { error: err.message }, 500);
    }
}
  
// Get invoice by user email
export const getInvoicebyuseremail = async (req, res) => {
    try {
      const invoices = await prisma.invoice.findMany({
        where: { email: req.params.email }
      });
  
      return successResponse(res, 'Get invoice by ID successful', invoices);
  
    } catch (err) {
      return errorResponse(res, 'get invoice by email fail', { error: err.message }, 500);
    }
}