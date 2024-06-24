const _insertQuery = `
    INSERT INTO 
        Answers (id,body,ques_id,user_id) 
    VALUES (?)`;

const _fetchAnswerDataQuery = `
    SELECT 
        user_id,
        ques_id 
    FROM 
        Answers 
    WHERE id= ? `;

const _updateQuery = `
    UPDATE 
        Answers 
    SET 
        body= ? 
    WHERE 
        id = ?`;

const _questionOwnerQuery = `
    SELECT 
        user_id 
    FROM 
        Questions 
    WHERE id = ?`;

const _deleteQuery = `
    DELETE FROM 
        Answers 
    WHERE 
        Answers.id = ?`;

module.exports={_insertQuery,_fetchAnswerDataQuery,_updateQuery,_questionOwnerQuery,_deleteQuery};