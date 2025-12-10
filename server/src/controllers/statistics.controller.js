import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";


// getRange
export const getRange = async(req,res) => {
    const { start, end } = req.query;

    const data = await prisma.invoice.findMany({
        where:{
            date:{
                gte: new Date(start),
                lte: new Date(end)
            }
        }
    })

    const totalPesanan = data.reduce((sum, inv) => sum + 1, 0);
    const totalTerbayar = data.reduce((sum, inv) => sum + inv.total, 0);

    return successResponse(res, 'Statistics with rangedate successful', { totalPesanan, totalTerbayar });
}

// getSingle
export const getSingle = async(req,res) => {
    const { date } = req.query;

    const target = new Date(date)
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1);

    const data = await prisma.invoice.findMany({
        where:{
            date:{
                gte: target,
                lte: nextDay
            }
        }
    })

    const totalPesanan = data.length;
    const totalTerbayar = data.reduce((sum, inv) => sum + inv.total, 0);

    return successResponse(res, 'Statistics with singedate successful', { totalPesanan, totalTerbayar });
}