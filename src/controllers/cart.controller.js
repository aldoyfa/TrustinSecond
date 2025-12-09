import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

// addToCart,
export const addToCart = async (req,res) => {
    const { productId, quantity } = req.body

    const product = await prisma.product.findUnique({
        where: {id: productId}
    })

    if (!product) return errorResponse(res,"Product not found", { error: "Product not found" }, 404)

    // Check if product already exists in user's cart
    const existingCartItem = await prisma.cart.findFirst({
        where: {
            productId,
            userId: req.user.id
        }
    })

    let cart;
    if (existingCartItem) {
        // Update existing cart item - add to quantity
        const newQuantity = existingCartItem.quantity + quantity
        const newTotal = product.price * newQuantity
        
        cart = await prisma.cart.update({
            where: { id: existingCartItem.id },
            data: {
                quantity: newQuantity,
                total: newTotal
            }
        })
    } else {
        // Create new cart item
        const total = product.price * quantity
        
        cart = await prisma.cart.create({
            data:{
                productId,
                quantity,
                total,
                userId: req.user.id
            }
        })
    }

    return successResponse(res, "Add to cart successful", cart);
}

// getAllCart
export const getAllCart = async (req,res) => {
    const cartItems = await prisma.cart.findMany({
        where: {userId: req.user.id},
        include: { product: true },
    })

    return successResponse(res, "get all cart successful", cartItems)
}

// updateCartItem
export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params
        const { quantity } = req.body

        const cartItem = await prisma.cart.findUnique({
            where: { id },
            include: { product: true }
        })

        if (!cartItem) return errorResponse(res, "Cart item not found", null, 404)
        if (cartItem.userId !== req.user.id) return errorResponse(res, "Unauthorized", null, 403)

        const newTotal = cartItem.product.price * quantity

        const updated = await prisma.cart.update({
            where: { id },
            data: {
                quantity,
                total: newTotal
            }
        })

        return successResponse(res, "Cart item updated", updated)
    } catch (error) {
        return errorResponse(res, "Update cart item failed", { error: error.message }, 500)
    }
}

// deleteCartItem
export const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params

        const cartItem = await prisma.cart.findUnique({
            where: { id }
        })

        if (!cartItem) return errorResponse(res, "Cart item not found", null, 404)
        if (cartItem.userId !== req.user.id) return errorResponse(res, "Unauthorized", null, 403)

        await prisma.cart.delete({
            where: { id }
        })

        return successResponse(res, "Cart item deleted", null)
    } catch (error) {
        return errorResponse(res, "Delete cart item failed", { error: error.message }, 500)
    }
}