const executeQuery = require('../utils/db');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const response = require('../utils/successResponse');
const {_insertQuery}=require('./query')
const {_fetchAnswerDataQuery}=require('./query')
const {_updateQuery}=require('./query')
const {_questionOwnerQuery}=require('./query')
const {_deleteQuery}=require('./query')

let authenticatedId;
let responseObject = {
    message: "",
    data: null
};

let checkUserFunction;

// insert answer
const insertAnswer = async (req, res, next) => {
    try {
        checkUserFunction = false;
        const ansData = req.body;

        authenticatedId = req.userId;
        const id = ansData.id

        const isUserAllowed = await validateUserId(authenticatedId, ansData.ques_id, next);
        if (!isUserAllowed) {
            throw new AppError(404, "You are not allowed to answer this question");
        }

        const values = [id, ansData.body, ansData.ques_id, authenticatedId];
        await executeQuery(_insertQuery, [values]);

        responseObject = { message: "Answer created successfully", data: ansData };
        res.status(200).send(response(200, responseObject));
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            const customError = new AppError(400, error.message);
            next(customError);
        }
    }
};


// update answer
const updateAnswer = async (req, res, next) => {
    try {
        checkUserFunction = true;
        const updateData = req.body;
        
        authenticatedId = req.userId;
        
        const isUserAllowed = await validateUserId(authenticatedId, updateData[0].id, next);
        if (!isUserAllowed) {
            throw new AppError(403, 'You are not allowed to update this answer!');
        }

        // Using Promise.all to execute all update queries asynchronously
        await Promise.all(updateData.map(async upd => {
            const values = [upd.body, upd.id];
            await executeQuery(_updateQuery, values);
        }));

        responseObject = {
            message: "Answer updated",
            data: updateData
        };

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

// delete answer
const deleteAnswer = async (req, res, next) => {
    try {
        const data = req.body;
        authenticatedId = req.userId;

        const isUserAllowed = await validateUserIdDeleteAnswer(authenticatedId, data[0].id, next);
        if (!isUserAllowed) {
            throw new AppError(403, 'You are not allowed to delete this answer');
        }

        await Promise.all(data.map(async dlt => {
            const values = [dlt.id];
            await executeQuery(_deleteQuery, values);
        }));

        responseObject = {
            message: 'Answer has been deleted',
            data: data
        };
        
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

async function validateUserIdDeleteAnswer(userId, ansId, next) {
    try {
        const result = await executeQuery(_fetchAnswerDataQuery, [ansId]);
        
        if (result && result.length > 0) {
            const answerOwnerId = result[0].user_id;
            const questionOwnerId = await getQuestionOwnerId(result[0].ques_id, next);

            // Check if the user is the owner of the answer or the owner of the corresponding question
            return answerOwnerId === userId || questionOwnerId === userId;
        } else {
            // If the answer doesn't exist, the user is not allowed to delete
            return false;
        }
    } catch (error) {
        const customError = new AppError('400', error.message);
        next(customError);
    }
}

async function getQuestionOwnerId(quesId, next) {
    try {
        const result = await executeQuery(_questionOwnerQuery, [quesId]);

        if (result && result.length > 0) {
            return result[0].user_id;
        } else {
            return null;
        }
    } catch (error) {
        const customError = new AppError('400', error.message);
        next(customError);
    }
}

async function validateUserId(userId, quesId, next) {
    try {
        let result;
        
        if (checkUserFunction) {
            result = await executeQuery(_fetchAnswerDataQuery, [quesId]);
        } else { 
            result = await executeQuery(_questionOwnerQuery, [quesId]);
        }

        if (result && result.length > 0) {
            // If the question exists, check if the user ID matches the question's user ID
            if (checkUserFunction) {
                return result[0].user_id === userId;
            } else {
                return result[0].user_id !== userId;
            }
        } else {
            // If the question doesn't exist, the user is not allowed to answer
            throw new AppError(403, 'Answer does not exist');
        }
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            const customError = new AppError(400, error.message);
            next(customError);
        }
    }
}

module.exports = { insertAnswer, updateAnswer, deleteAnswer };
