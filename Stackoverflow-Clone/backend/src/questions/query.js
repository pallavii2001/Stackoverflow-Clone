const _insertQuery = `
    INSERT INTO 
        Questions (id, title, body, user_id) 
    VALUES (?)`;

const _checkQuestionOwnerQuery = `
    SELECT 
        user_id 
    FROM 
        Questions 
    WHERE id= ?`;

const _updateQuery = `
    UPDATE 
        Questions 
    SET 
        body= ?  ,title= ?
    WHERE id = ?`;

const _deleteQuery = `
    DELETE FROM 
        Questions  
    WHERE   
        Questions.id = ?`;

const _searchQuery = `
    SELECT 
        id,
        title,
        body,
        user_id
    FROM 
        Questions 
    WHERE body LIKE ?`;

module.exports={_insertQuery,_checkQuestionOwnerQuery,_updateQuery,_deleteQuery,_searchQuery};