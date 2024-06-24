const _insertQuery = `
    INSERT INTO 
        Comments (id,body,ans_id,user_id) 
    VALUES (?)`;

const _fetchCommentsUserIdQuery = `
    SELECT 
        user_id
    FROM 
        Comments 
    WHERE id= ? `;

const _fetchCommentsDataQuery = `
    SELECT 
        comments.user_id, Answers.ques_id
    FROM
        Comments
            INNER JOIN
        Answers ON Comments.ans_id = Answers.id
    WHERE
        Comments.id = ?`;

const _updateQuery = `
    UPDATE 
        Comments 
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
        Comments 
    WHERE 
        Comments.id = ?`;

module.exports={_insertQuery,_fetchCommentsDataQuery,_fetchCommentsUserIdQuery,_updateQuery,_questionOwnerQuery,_deleteQuery};