const jwt = require('jsonwebtoken');

const executeQuery = require('../utils/db');
const { AppError } = require('../utils/errorHandler');
const response = require('../utils/successResponse');
const {_insertUserQuery}=require('./query')
const {_fetchUserByIdQuery}=require('./query')

let responseObject = {
    message: "",
    data: null
};

//create users
const createUser = async (req, res, next) => { 
    try {
        const {id, name} = req.body; 

        
        const values = [id, name];
        await executeQuery(_insertUserQuery, values);
        

        responseObject = { message: "Users created successfully" };
        res.status(200).send(response(200, responseObject));
    } catch (error) {
        const customError = new AppError(400, error.message);
        next(customError);
    }
};

//login user
const loginUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await getUserById(id);

        if (user.length === 0) {
            throw new AppError(404, "User not found");
        } else {
            const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            responseObject = {
                message: "Authentication token",
                data: token
            };
        }

        res.send(response(200, responseObject));
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            const customError = new AppError(400, error.message);
            next(customError);
        }
    }
};

const getUserById = async (id) => {
    const result = await executeQuery(_fetchUserByIdQuery, [id]);
    return result;
};

module.exports = { createUser, loginUser };
