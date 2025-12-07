export const successResponse = (res, message, data = null, status = 200) => {
    return res.status(status).json({
        succsess : true,
        message,
        data,
    })
}

export const errorResponse = (res, message, data = null, status = 400) => {
    return res.status(status).json({
        succsess : false,
        message,
        data,
    })
}