const executeQuery = require('../utils/db');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const response = require('../utils/successResponse');
const{_insertQuery}=require('./query')
const{_checkQuestionOwnerQuery}=require('./query')
const{_deleteQuery}=require('./query')
const{_updateQuery}=require('./query')
const{_searchQuery}=require('./query')


let authenticatedId;
let responseObject = {
    message: "",
    data: null
};

const results = [];

const _fetchQuestionsQuery = `
SELECT
q.id AS question_id,
q.title AS question_title,
q.body AS question_body,
q.user_id AS question_user_id,
a.id AS answer_id,
a.body AS answer_body,
a.user_id AS answer_user_id,
c.id AS comment_id,
c.body AS comment_body,
c.user_id AS comment_user_id
FROM Questions q
LEFT JOIN Answers a ON q.id = a.ques_id
LEFT JOIN Comments c ON a.id = c.ans_id
ORDER BY q.id, a.id, c.id;

`;

//create Question
const insertQuestion = async (req, res, next) => {
    try {
        const {id, title, body} = req.body;
        authenticatedId = req.userId;

        
        const values = [id, title, body, authenticatedId];
        await executeQuery(_insertQuery, [values]);
        
        responseObject = { message: "Question created successfully" };
        res.status(200).send(response(200, responseObject));

    } catch (error) {
        const customError = new AppError(500, error.message);
        next(customError);
    }
};

//update Question
const updateQuestion = async (req, res, next) => {
    try {
        const {id, title, body} = req.body;
        authenticatedId = req.userId;

        const isUserAllowed = await validateUserId(authenticatedId, id);

        if (!isUserAllowed) {
            throw new AppError(403, "You are not allowed to update this question.");
        }

        
            const values = [body,title, id];
            await executeQuery(_updateQuery, values);

            responseObject = {
                message: "Question updated",
                
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

//delete Question
const deleteQuestion = async (req, res, next) => {
    try {
        const {id} = req.body;
        authenticatedId = req.userId;

        const isUserAllowed = await validateUserId(authenticatedId, id);
        if (!isUserAllowed) {
            throw new AppError(403, "You are not allowed to delete this question.");
        }

       
            const values = [id];
            await executeQuery(_deleteQuery, values);

            responseObject = {
                message: "Question deleted",
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

//search question
const searchQuestion = async (req, res, next) => {
    try {
        const srcData = req.body;

        await Promise.all(srcData.map(async src => {
            const values = [`%${src.word}%`];
            const result = await executeQuery(_searchQuery, values);
            results.push(result);
        }));

        responseObject = {
            message: "Questions fetched",
            data: results
        };

        res.send(response(200, responseObject));
    } catch (error) {
        const customError = new AppError(400, error.message);
        next(customError);
    }
};

//viewAll questions
const fetchQuestions = async (req, res, next) => {
    try {
        const result = await executeQuery(_fetchQuestionsQuery);
        const questionsWithStructure = await structureQuestion(result);

        responseObject = {
            message: "Questions fetched",
            data: questionsWithStructure
        };

        res.send(response(200, responseObject));
    } catch (error) {
        const customError = new AppError(400, error.message);
        next(customError);
    }
};

async function validateUserId(userId, quesId) {
    try {
        console.log(quesId);
        const result = await executeQuery(_checkQuestionOwnerQuery, [quesId]);
        
        if (result && result.length > 0) {
            // If the question exists, check if the user ID matches the question's user ID
            return result[0].user_id === userId;
        } else {
            throw new AppError(403, 'Question does not exist');
        }
    } catch (error) {
        throw error;
    }
}

const structureQuestion = async (questions) => {
    const structuredQuestions = [];
    let currentQuestion = null;

    questions.forEach(question => {
        const {
            question_id,
            question_title,
            question_body,
            question_user_id,
            answer_id,
            answer_body,
            answer_user_id,
            comment_id,
            comment_body,
            comment_user_id
        } = question;

        if (!currentQuestion || currentQuestion.question_id !== question_id) {
            // New question
            currentQuestion = {
                question_id,
                question_title,
                question_body,
                question_user_id,
                answers: []
            };
            structuredQuestions.push(currentQuestion);
        }

        if (answer_id) {
            // Answer exists
            let currentAnswer = currentQuestion.answers.find(answer => answer.answer_id === answer_id);
            if (!currentAnswer) {
                // New answer
                currentAnswer = {
                    answer_id,
                    answer_body,
                    answer_user_id,
                    comments: []
                };
                currentQuestion.answers.push(currentAnswer);
            }

            if (comment_id) {
                // Comment exists
                const comment = {
                    comment_id,
                    comment_body,
                    comment_user_id
                };
                currentAnswer.comments.push(comment);
            }
        }
    });

    return structuredQuestions;
};

module.exports = { insertQuestion, updateQuestion, deleteQuestion, fetchQuestions, searchQuestion };
