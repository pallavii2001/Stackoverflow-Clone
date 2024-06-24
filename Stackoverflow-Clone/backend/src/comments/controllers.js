const executeQuery = require('../utils/db');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const response = require('../utils/successResponse');
const {_insertQuery}=require('./query')
const {_fetchCommentsDataQuery}=require('./query')
const {_fetchCommentsUserIdQuery}=require('./query')
const {_updateQuery}=require('./query')
const {_questionOwnerQuery}=require('./query')
const {_deleteQuery}=require('./query')

let authenticatedId;
let result;
let responseObject = {
    message: "",
    data: null
};

// insert comment
const insertComments = async (req, res, next) => {
    try {
        const commentData = req.body;
        authenticatedId = req.userId;

        
            const values = [commentData.id, commentData.body, commentData.ans_id, authenticatedId];
            await executeQuery(_insertQuery, [values]);
   

        responseObject = { message: "Comments created successfully", data: commentData };
        res.status(200).send(response(200, responseObject));
    } catch (error) {
        const customError = new AppError(400, error.message);
        next(customError);
    }
};

// update comment
const updateComments = async (req, res, next) => {
    try {
        const updateData = req.body;
        authenticatedId = req.userId;

        const isUserAllowed = await validateUserId(authenticatedId, updateData[0].id, next);
        if (!isUserAllowed) {
            throw new AppError(403, 'You are not allowed to update this comment!');
        }

        // Using Promise.all to execute all update queries asynchronously
        await Promise.all(updateData.map(async upd => {
            const values = [upd.body, upd.id];
            await executeQuery(_updateQuery, values);
        }));

        responseObject = {
            message: "Comment updated",
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

// delete comment
const deleteComments = async (req, res, next) => {
    try {
        const data = req.body;
        authenticatedId = req.userId;

        const isUserAllowed = await validateUserIdDeleteComment(authenticatedId, data[0].id, next);
        if (!isUserAllowed) {
            throw new AppError(403, 'You are not allowed to delete this comment');
        }

        await Promise.all(data.map(async dlt => {
            const values = [dlt.id];
            await executeQuery(_deleteQuery, values);
        }));

        responseObject = {
            message: 'Comment has been deleted',
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

async function validateUserIdDeleteComment(userId, commentId, next) {
    try {
        const result = await executeQuery(_fetchCommentsDataQuery, [commentId]);
        
        if (result && result.length > 0) {
            const commentOwnerId = result[0].user_id;
            const questionOwnerId = await getQuestionOwnerId(result[0].ques_id, next);

            // Check if the user is the owner of the comment or the owner of the corresponding question
            return commentOwnerId === userId || questionOwnerId === userId;
        } else {
            // If the comment doesn't exist, the user is not allowed to delete
            throw new AppError(403, "Invalid id");
        }
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            const customError = new AppError('400', error.message);
            next(customError);
        }
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

async function validateUserId(userId, commentId, next) {
    try {
        result = await executeQuery(_fetchCommentsUserIdQuery, [commentId]);
        
        if (result && result.length > 0) {
            // If the comment exists, check if the user ID matches the comment's user ID
            return result[0].user_id === userId;
        } else {
            // If the comment doesn't exist, the user is not allowed to comment
            throw new AppError(403, 'Comment does not exist');
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

module.exports = { insertComments, updateComments, deleteComments };
