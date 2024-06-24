const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

async function authenticateToken(req, res, next) {
    try{
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. Token not provided.' });
        }
    
        const authenticatedData=await jwt.verify(token, process.env.JWT_SECRET);
        //console.log(authenticatedData)
            req.userId = authenticatedData.userId;
            next();
    }catch(error){
        const customError=new AppError(400,'invalid token')
        next(customError)
    }
    }

module.exports=authenticateToken  