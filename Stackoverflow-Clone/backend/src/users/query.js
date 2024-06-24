const _insertUserQuery = `
    INSERT INTO 
        Users (id, name) 
    VALUES (?, ?)`;

const _fetchUserByIdQuery = `
    SELECT 
        id,
        name 
    FROM 
        Users 
    WHERE id = ?`;

module.exports={_insertUserQuery,_fetchUserByIdQuery}