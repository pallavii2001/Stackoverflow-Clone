const errorResponse=require('./errorResponse')


class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (err, req, res, next) => {
   console.log(err);
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Something went wrong";
    res.status(statusCode).json(errorResponse(statusCode, errorMessage));
}

module.exports = {errorHandler, AppError};