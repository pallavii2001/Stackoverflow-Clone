const Joi = require('joi');

const userSchema = Joi.array().items(Joi.object({
    id: Joi.string().alphanum().min(1).max(4).required(),
    name: Joi.string().min(3).max(50).required(),
})); 

const questionSchema = Joi.array().items(Joi.object({
    id: Joi.string().alphanum().min(1).max(4).required(),
    title:Joi.string().min(3).max(25).required(),
    body: Joi.string().min(3).max(250).required(),
    user_id:Joi.string().alphanum().min(1).max(4)
})); 


const answerSchema = Joi.array().items(Joi.object({
    id: Joi.string().alphanum().min(1).max(4).required(),
    body: Joi.string().min(3).max(250).required(),
    ques_id: Joi.string().alphanum().min(1).max(4),
    user_id:Joi.string().alphanum().min(1).max(4)
})); 


const commentSchema = Joi.array().items(Joi.object({
    id: Joi.string().alphanum().max(4).required(),
    body: Joi.string().min(3).max(250).required(),
    ans_id: Joi.string().alphanum().min(1).max(4),
    user_id: Joi.string().alphanum().min(1).max(4)
})); 




const validateQuestionSchema =(req, res, next) => {
    const { error, value } = questionSchema.validate(req.body);
    console.log(value);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    // Attach the validated data to the request object for later use
    req.validatedData = value;
    next();
}

const validateAnswerSchema=(req, res, next) => {
    const { error, value } = answerSchema.validate(req.body);
    console.log(value);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    // Attach the validated data to the request object for later use
    req.validatedData = value;
    next();
}

const validateCommentSchema=(req, res, next) => {
    const { error, value } = commentSchema.validate(req.body);
    console.log(value);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    // Attach the validated data to the request object for later use
    //req.validatedData = value;
    next();
}

const validateUserSchema=(req, res, next) => {
    const { error, value } = userSchema.validate(req.body);
    console.log(value);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    // Attach the validated data to the request object for later use
    req.validatedData = value;
    next();
}


module.exports = {validateUserSchema,validateQuestionSchema,validateAnswerSchema,validateCommentSchema}
